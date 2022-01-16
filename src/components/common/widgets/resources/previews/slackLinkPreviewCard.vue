<template>
    <div>
        <div
            v-if="!isLoading"
            class="flex p-2 border rounded cursor-pointer hover:bg-gray-100"
            @click="openLink(item?.attributes?.link)"
        >
            <template v-if="data">
                <div class="relative h-8 mr-3 min-w-link-left-col">
                    <!-- avatar -->
                    <img
                        class="rounded-full"
                        :src="data.user.image_32"
                        alt=""
                    />
                    <AtlanIcon
                        :icon="'Slack'"
                        class="absolute slack-icon-avatar-overlay"
                    ></AtlanIcon>
                </div>
                <div class="flex flex-col">
                    <div class="flex items-center">
                        <!-- sender -->
                        <span class="mr-2 font-bold">{{
                            data.user.real_name
                        }}</span>
                        <span class="text-xs text-gray-500">
                            {{
                                timeAgo(
                                    new Date(
                                        data.message.ts * 1000
                                    ).toISOString()
                                )
                            }}
                            ago</span
                        >
                    </div>
                    <!-- message -->
                    <div>
                        {{ data.message.text }}
                    </div>
                    <div class="flex text-sm text-gray-500">
                        <span class="" v-if="data.message.reply_count">
                            {{ data.message.reply_count }}
                            replies
                            <span class="ml-1 mr-1 text-gray-300">•</span>
                        </span>
                        <span> #{{ data?.channel?.name }} </span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    import { defineComponent, computed, toRefs } from 'vue'

    import integrationStore from '~/store/integrations/index'
    import { getChannelAndMessageIdFromSlackLink } from '~/composables/integrations/useSlack'
    import { UnfurlSlackMessage } from '~/composables/integrations/useIntegrations'

    dayjs.extend(relativeTime)

    export default defineComponent({
        components: {},
        props: {
            item: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const timeAgo = (time: string) => dayjs().from(time, true)

            // todo
            // todo add loading state whenever missing
            // todo add simmer effecr
            const { item } = toRefs(props)
            const { link } = item.value.attributes
            const { channelId, messageId } =
                getChannelAndMessageIdFromSlackLink(link)
            const { data, isLoading, error } = UnfurlSlackMessage(
                {
                    conversationId: channelId,
                    messageId,
                },
                {
                    immediate: true,
                }
            )
            function openLink(url) {
                if (!url) {
                    return
                }
                window.open(url)
            }
            return {
                data,
                isLoading,
                error,
                timeAgo,
                openLink,
            }
        },
    })
</script>
<style lang="less" scoped>
    .slack-icon-avatar-overlay {
        height: 1rem;
        bottom: -3px;
        right: -6px;
        border-radius: 100px;
        /* box-shadow: -1px 1px 4px white; */
        background: white;
        padding: 0.9px;
    }
    .min-w-link-left-col {
        min-width: 2rem;
    }
</style>
