<template>
    <div class="" @click="open">
        <slot />
    </div>
    <a-modal v-model:visible="visible" :closable="false" @afterClose="clearAll">
        <div class="flex flex-col p-4 gap-y-4">
            <div class="flex items-center gap-x-3">
                <AtlanIcon icon="Slack" class="h-5 mb-1" />
                <h2 class="text-xl font-bold">Share on Slack</h2>
            </div>
            <template v-if="slack">
                <div class="">
                    <h3 class="text-lg">Channel</h3>
                    <a-select
                        v-model:value="channel"
                        class="w-full"
                        :options="channels"
                    />
                </div>
                <div class="">
                    <h3 class="text-lg">Message</h3>
                    <a-textarea v-model:value="message" />
                </div>
            </template>
            <template v-else>
                <div class="p-4">
                    Please integrate your worksplace, in order to share on
                    slack.
                </div>
            </template>
        </div>

        <template #footer>
            <div class="flex items-center justify-end w-full space-x-3">
                <template v-if="slack">
                    <AtlanButton color="minimal" @click="visible = false">
                        Cancel
                    </AtlanButton>
                    <AtlanButton
                        type="primary"
                        :disabled="!channel"
                        @click="shareToSlack"
                    >
                        Share
                    </AtlanButton>
                </template>
                <router-link
                    v-else
                    v-auth="access.CREATE_INTEGRATION"
                    to="/admin/integration"
                >
                    <AtlanButton>Add integration</AtlanButton>
                </router-link>
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { message as toast } from 'ant-design-vue'

import intStore from '~/store/integrations/index'
import AtlanButton from '@/UI/button.vue'
import { shareOnSlack } from '~/composables/integrations/useSlack'
import access from '~/constant/accessControl/map'

const props = defineProps({
    link: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['closeParent'])

const store = intStore()

const slack = store.getIntegration('slack', true)

console.log('slack', slack.id)

const channels = ref([])

const getChannels = () => {
    if (!slack) return []
    channels.value =
        slack?.config?.channels.map((channel) => ({
            value: channel.id,
            label: `# ${channel.name}`,
        })) ?? []
    return null
}

getChannels()

const visible = ref(false)
const channel = ref('')
const message = ref('')

const clearAll = () => {
    channel.value = ''
    message.value = ''
}
const open = () => {
    visible.value = true
    emit('closeParent')
}

const shareToSlack = () => {
    visible.value = false
    toast.loading({
        key: 'shareSlack',
        content: 'Sharing on slack ...',
        duration: 10,
    })

    const { data, isLoading, error, isReady } = shareOnSlack({
        integrationId: slack.id,
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

<style scoped></style>
