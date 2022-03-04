<template>
    <div class="" @click="open">
        <slot />
    </div>
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
                <AtlanButton
                    color="minimal"
                    padding="compact"
                    @click="visible = false"
                >
                    Cancel
                </AtlanButton>
                <AtlanButton
                    type="primary"
                    :disabled="
                        (askQuestionModal ? !message : false) ||
                        !channel ||
                        loading
                    "
                    size="sm"
                    @click="handleCtaClick"
                >
                    {{ ctaText }}
                </AtlanButton>
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
    import { defineProps, defineEmits, ref, watch, toRefs, h } from 'vue'
    import { message as toast } from 'ant-design-vue'

    import intStore from '~/store/integrations/index'
    import AtlanButton from '@/UI/button.vue'
    import {
        shareOnSlack,
        askQuestionOnSlack,
    } from '~/composables/integrations/slack/useSlack'
    import access from '~/constant/accessControl/map'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { resourceId } from '~/composables/integrations/slack/useAskAQuestion'
    import SuccessToast from '@/common/assets/misc/slackHelpers/AskAQuestionSuccessToast.vue'

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
    })

    const emit = defineEmits(['closeParent', 'success'])

    const store = intStore()

    const { tenantSlackStatus } = toRefs(store)
    const { assetType, askQuestionModal } = toRefs(props)

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

    const title = ref(
        askQuestionModal.value ? 'Ask a question' : 'Share on Slack'
    )

    const ctaText = ref(askQuestionModal.value ? 'Send' : 'Post')

    const inputLabel = ref(askQuestionModal.value ? 'Question' : 'Message')

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
        if (askQuestionModal.value) {
            // call ask question api
            handleSendQuestion()
        } else {
            shareToSlack()
        }
    }

    const handleSendQuestion = () => {
        if (resourceId.value) resourceId.value = ''
        console.log('will send askQuestionOnSlack')
        loading.value = true

        toast.loading({
            key: 'postQuestionOnSlack',
            content: 'Posting on slack ...',
            duration: 5,
        })

        const { data, isLoading, error, isReady } = askQuestionOnSlack({
            assetID: props.assetID,
            channelAlias: channel.value,
            message: message.value,
            link: props.link,
        })

        watch([isLoading, error], () => {
            if (!isLoading.value && !error.value) {
                loading.value = false

                console.log('data', data.value)

                const { slackLink } = data.value
                if (slackLink)
                    toast.success({
                        key: 'postQuestionOnSlack',
                        content: h(SuccessToast, {
                            link: [slackLink],
                        }),
                        class: ['successToast'],
                        duration: 5,
                    } as any)
                else
                    toast.success({
                        key: 'postQuestionOnSlack',
                        content: 'Question posted',
                        duration: 2,
                    })

                emit('success', data.value)
                visible.value = false
                useAddEvent('integration', 'slack', 'asset_question_posted', {
                    asset_type: assetType.value,
                })
            } else if (error.value) {
                loading.value = false
                const errMsg = error.value?.response?.data?.errorMessage
                const generalError = 'Network error'
                const e = errMsg || generalError
                toast.error({
                    content: e,
                    key: 'postQuestionOnSlack',
                    duration: 2,
                })
            }
        })
    }

    const shareToSlack = () => {
        visible.value = false
        toast.loading({
            key: 'shareSlack',
            content: 'Sharing on slack ...',
            duration: 10,
        })

        const { data, isLoading, error, isReady } = shareOnSlack({
            assetID: props.assetID,
            channelAlias: channel.value,
            message: message.value,
            link: props.link,
        })

        watch([isLoading, error], () => {
            if (!isLoading.value && !error.value) {
                toast.success({
                    key: 'shareSlack',
                    content: 'Successfully shared.',
                    duration: 2,
                })
                useAddEvent('integration', 'slack', 'asset_shared', {
                    asset_type: assetType.value,
                    has_message: !!message.value,
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
