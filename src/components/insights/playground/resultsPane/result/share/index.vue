<template>
    <span @click="open">
        <slot />
    </span>

    <a-modal v-model:visible="visible" :closable="false" @afterClose="clearAll">
        <div class="flex flex-col p-4 gap-y-4">
            <div class="flex items-center gap-x-3">
                <AtlanIcon icon="Slack" class="h-5 mb-1" />
                <h2 class="text-xl font-bold">{{ title }}</h2>
            </div>
            <div class="">
                <h3 class="font-bold">Channel</h3>
                <a-select
                    v-model:value="channel"
                    class="w-full"
                    :options="channels"
                />
            </div>
            <div class="">
                <h3 class="font-bold">{{ inputLabel }}</h3>
                <a-textarea v-model:value="message" />
            </div>
        </div>

        <template #footer>
            <div class="flex items-center justify-end w-full space-x-3">
                <AtlanButton2
                    color="secondary"
                    label="Cancel"
                    @click="visible = false"
                />

                <AtlanButton2
                    :disabled="
                        (askQuestionModal ? !message : false) ||
                        !channel ||
                        loading
                    "
                    :label="ctaText"
                    @click="handleCtaClick"
                />
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
    import {
        defineProps,
        defineEmits,
        ref,
        watch,
        toRefs,
        h,
        PropType,
    } from 'vue'
    import { message as toast } from 'ant-design-vue'

    import intStore from '~/store/integrations/index'
    import AtlanButton from '@/UI/button.vue'
    import access from '~/constant/accessControl/map'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { resourceId } from '~/composables/integrations/slack/useAskAQuestion'
    import SuccessToast from '@/common/assets/misc/slackHelpers/AskAQuestionSuccessToast.vue'
    import { useSlackTableExport } from '~/components/insights/common/composables/useTableExport'
    import useShareSlack from './useShareSlack'
    const props = defineProps({
        link: {
            type: String,
            required: true,
        },
        assetID: {
            type: String,
            required: true,
        },
        assetType: {
            type: String,
            required: true,
        },
        askQuestionModal: {
            type: Boolean,
            default: false,
        },
        columns: {
            type: Object as PropType<any[]>,
            required: true,
        },
        dataList: {
            type: Object as PropType<any[]>,
            required: true,
        },
    })

    const emit = defineEmits(['closeParent', 'success', 'change'])

    const store = intStore()

    const { tenantSlackStatus } = toRefs(store)
    const { assetType, askQuestionModal, columns, dataList } = toRefs(props)

    const channels = ref([])

    const getChannels = () => {
        channels.value =
            tenantSlackStatus.value.channels.map((channel) => ({
                value: channel.id,
                label: `# ${channel.name}`,
            })) ?? []
        return null
    }

    getChannels()

    const visible = ref(false)
    const channel = ref('')
    const message = ref('')
    const loading = ref(false)

    const title = ref('Share results on Slack')

    const ctaText = ref('Post')

    const inputLabel = ref('Message')

    const clearAll = () => {
        channel.value = ''
        message.value = ''
    }

    const open = () => {
        clearAll()
        channel.value = channels.value[0].value
        visible.value = true
        emit('closeParent')
    }

    const handleCtaClick = () => {
        debugger
        const { filename, file } = useSlackTableExport(
            columns.value,
            dataList.value
        )
        shareToSlack(filename, file)
    }

    const shareToSlack = (filename: string, file: any) => {
        const { origin } = window.location
        const url = `${origin}/api/service/slack/files`

        const reqConfig = ref({
            url,
            formDataFormat: {
                name: filename,
                initialComment: message.value,
                channel: channel.value,
                file: '{{file}}',
            },
        })
        const { handleUpload, uploading, error, success } = useShareSlack(
            reqConfig,
            emit,
            file
        )
        handleUpload()

        visible.value = false
        toast.loading({
            key: 'shareSlack',
            content: 'Sharing on slack ...',
            duration: 10,
        })

        watch([uploading, error], () => {
            if (!uploading.value && !error.value) {
                toast.success({
                    key: 'shareSlack',
                    content: 'Successfully shared.',
                    duration: 2,
                })
            } else if (error.value) {
                const errMsg = error.value?.response?.data?.errorMessage
                const generalError = 'Network error'
                const e = errMsg || generalError
                toast.error({
                    content: e,
                    key: 'shareSlack',
                    duration: 2,
                })
            }
        })
    }
</script>

<style lang="less">
    .successToast {
        .ant-message-success {
            @apply flex items-center;
        }
    }
</style>
