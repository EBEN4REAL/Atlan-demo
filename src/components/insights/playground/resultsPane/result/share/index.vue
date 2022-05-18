<template>
    <span @click="open">
        <slot />
    </span>

    <a-popover
        placement="topLeft"
        overlayClassName="slack_popover"
        v-model:visible="visible"
        class="mb-4"
    >
        <template #content>
            <div
                class="flex flex-col p-4 rounded-lg gap-y-3.5"
                style="width: 240px"
            >
                <div class="flex items-center">
                    <AtlanIcon icon="Slack" class="h-4 mb-1 mr-2" />
                    <h2 class="text-sm font-bold">{{ title }}</h2>
                </div>
                <div class="">
                    <h3 class="text-xs mb-0.5">Channel</h3>
                    <a-select
                        v-model:value="channel"
                        :options="channels"
                        :class="$style.selector"
                        class="w-full border rounded border-new-gray-300"
                    >
                        <template #suffixIcon>
                            <AtlanIcon icon="ChevronDown" />
                        </template>
                    </a-select>
                </div>
                <div class="">
                    <h3 class="text-xs mb-0.5">{{ inputLabel }}</h3>
                    <a-textarea
                        v-model:value="message"
                        class="border border-new-gray-300"
                        placeholder="Add some context"
                    />
                </div>
                <div
                    class="flex items-center justify-end w-full mt-3 space-x-3"
                >
                    <AtlanButton2
                        color="secondary"
                        label="Cancel"
                        class="flex-1 font-bold border border-new-gray-300"
                        @click="visible = false"
                    />

                    <AtlanButton2
                        :disabled="
                            (askQuestionModal ? !message : false) ||
                            !channel ||
                            loading
                        "
                        :label="ctaText"
                        class="flex-1 font-bold"
                        @click="handleCtaClick"
                    />
                </div>
            </div>
        </template>
    </a-popover>
</template>

<script setup lang="ts">
    import {
        Ref,
        defineProps,
        defineEmits,
        ref,
        watch,
        toRefs,
        h,
        PropType,
        inject,
    } from 'vue'
    import { message as toast } from 'ant-design-vue'

    import intStore from '~/store/integrations/index'
    import AtlanButton from '@/UI/button.vue'
    import access from '~/constant/accessControl/map'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { resourceId } from '~/composables/integrations/slack/useAskAQuestion'
    import SuccessToast from '@/common/assets/misc/slackHelpers/AskAQuestionSuccessToast.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    import { useSlackTableExport } from '~/components/insights/common/composables/useTableExport'
    import { useVModels } from '@vueuse/core'

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
        visible: {
            type: Boolean,
            required: true,
        },
    })

    const emit = defineEmits(['closeParent', 'success', 'change'])
    const showSaveQueryModal = inject('showSaveQueryModal') as Ref<Boolean>
    const activeInlineTab = inject(
        'activeInlineTab'
    ) as Ref<activeInlineTabInterface>
    const { visible } = useVModels(props)

    const store = intStore()

    const { tenantSlackStatus } = toRefs(store)
    const { assetType, askQuestionModal, columns, dataList } = toRefs(props)

    const channels = ref([])

    const getChannels = () => {
        channels.value =
            tenantSlackStatus.value.queryOutputChannels.map((channel) => ({
                value: channel.id,
                label: `# ${channel.name}`,
            })) ?? []
        return null
    }

    getChannels()

    const channel = ref('')
    const message = ref('')
    const loading = ref(false)

    const title = ref('Share to slack')

    const ctaText = ref('Share')

    const inputLabel = ref('Description')
    watch(visible, (newVisible) => {
        if (!newVisible) {
            channel.value = ''
            message.value = ''
        }
    })

    const open = () => {
        channel.value = channels.value[0].value
        visible.value = true
        emit('closeParent')
    }

    const handleCtaClick = () => {
        if (!activeInlineTab.value.queryId) {
            showSaveQueryModal.value = true
            return
        }
        const { filename, file } = useSlackTableExport(
            columns.value,
            dataList.value
        )
        shareToSlack(filename, file)
    }

    const shareToSlack = (filename: string, file: any) => {
        const { origin } = window.location
        const url = `${origin}/api/service/slack/files`
        const assetLink = `${origin}/insights?id=${activeInlineTab.value.queryId}`
        const assetId = activeInlineTab.value.queryId

        const reqConfig = ref({
            url,
            formDataFormat: {
                openTitle: 'Hello world',
                filename: filename,
                initialComment: message.value,
                channel: channel.value,
                file: '{{file}}',
                assetId: assetId,
                assetLink: assetLink,
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

//
<style lang="less">
    .successToast {
        .ant-message-success {
            @apply flex items-center;
        }
    }
    .slack_popover .ant-popover-content .ant-popover-inner {
        @apply rounded-lg !important;
    }
</style>
<style lang="less" module>
    .selector {
        :global(.ant-select-selector) {
            border: none !important;
        }
    }
</style>
