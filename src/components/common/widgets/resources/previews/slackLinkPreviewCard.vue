<template>
    <template v-if="isLoading">
        <div class="p-2 border rounded">
            <a-skeleton
                :loading="true"
                avatar
                active
                :title="false"
                :paragraph="{ rows: 2 }"
            />
        </div>
    </template>
    <LinkPreview v-else-if="error" v-bind="$props" />
    <template v-else>
        <div
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
                        <ShowLess :text="data.message.text" />
                        <!-- <a-typography-paragraph
                            :ellipsis="{
                                rows: 2,
                                expandable: true,
                                symbol: 'more',
                            }"
                            :content="data.message.text"
                            class="break-all"
                        /> -->
                        <!-- <Truncate :tooltip-text="data.message.text" :rows="2" /> -->
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
                <div class="flex-grow"></div>
                <!-- extract this into component -->
                <div class="">
                    <a-dropdown trigger="click" placement="bottomRight">
                        <div
                            class="flex justify-end w-5 mt-1"
                            @click="(e) => e.stopPropagation()"
                        >
                            <AtlanIcon
                                icon="KebabMenu"
                                class="h-4 m-0 cursor-pointer hover:text-primary"
                            />
                        </div>

                        <template #overlay>
                            <a-menu mode="vertical">
                                <EditResource
                                    :asset="selectedAsset"
                                    :edit-permission="editPermission"
                                    :item="item"
                                    :updating="true"
                                    ><template #trigger>
                                        <a-menu-item key="edit">
                                            <div class="flex items-center">
                                                <AtlanIcon
                                                    icon="Edit"
                                                    class="h-4 mb-0.5 mr-1"
                                                />
                                                Edit
                                            </div>
                                        </a-menu-item></template
                                    ></EditResource
                                >
                                <DeleteResource
                                    :asset="selectedAsset"
                                    :item="item"
                                    :edit-permission="editPermission"
                                >
                                    <template #trigger>
                                        <a-menu-item key="delete">
                                            <div
                                                class="flex items-center text-red-500"
                                            >
                                                <AtlanIcon
                                                    icon="Delete"
                                                    class="h-4 mb-0.5 mr-1"
                                                />
                                                Delete
                                            </div>
                                        </a-menu-item>
                                    </template>
                                </DeleteResource>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </template>
        </div>
    </template>
</template>

<script lang="ts">
    // Vue
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    import { defineComponent, computed, toRefs } from 'vue'

    import integrationStore from '~/store/integrations/index'
    import {
        getChannelAndMessageIdFromSlackLink,
        UnfurlSlackMessage,
    } from '~/composables/integrations/useSlack'
    import LinkPreview from '@/common/widgets/resources/previews/linkPreviewCard.vue'
    import DeleteResource from '../deleteResource.vue'
    import EditResource from '../addResource.vue'
    import Truncate from '@/common/ellipsis/index.vue'
    import ShowLess from '@/UI/ShowLess.vue'

    dayjs.extend(relativeTime)

    export default defineComponent({
        components: {
            LinkPreview,
            DeleteResource,
            EditResource,
            Truncate,
            ShowLess,
        },
        props: {
            item: {
                type: Object,
                required: true,
            },
            selectedAsset: {
                type: Object,
                required: false,
                default: () => {},
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const timeAgo = (time: string) => dayjs().from(time, true)

            const { item } = toRefs(props)
            const { link } = item.value.attributes
            const { channelId, messageId } =
                getChannelAndMessageIdFromSlackLink(link)
            const { data, isLoading, error, mutate } = UnfurlSlackMessage(
                {
                    conversationId: channelId,
                    messageId,
                },
                {
                    immediate: false,
                }
            )
            mutate()

            function openLink(url) {
                if (!url) {
                    return
                }
                window.open(url)
            }

            return {
                channelId,
                messageId,
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
