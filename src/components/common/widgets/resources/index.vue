<template>
    <div class="p-4 bg-white rounded" style="min-height: 140px">
        <div class="flex items-center justify-between mb-5">
            <div class="flex items-center">
                <AtlanIcon icon="Resources" class="w-auto h-8 mr-3" /><span
                    class="text-base font-bold text-gray"
                    >Resources</span
                >
            </div>
            <AddResources
                v-if="links(asset)?.length > 0"
                :asset="asset"
                placement="left"
                ><template #trigger>
                    <a-button
                        class="text-gray-500 border border-transparent rounded shadow-none  hover:border-gray-400"
                    >
                        <AtlanIcon icon="Add" /> </a-button
                ></template>
            </AddResources>
        </div>
        <div>
            <div v-if="links(asset)?.length > 0" class="flex flex-col gap-y-2">
                <div v-for="(item, index) in links(asset)" :key="index">
                    <div v-if="isSlackLink(item.attributes.link)" class="mb-2">
                        <div
                            v-if="!slackUnfurls[item.guid].isLoading.value"
                            class="flex p-2 border rounded"
                        >
                            <div
                                class="relative h-8 mr-3"
                                style="min-width: 2rem"
                            >
                                <!-- avatar -->
                                <img
                                    class="rounded-full"
                                    :src="
                                        slackUnfurls[item.guid].data.value.user
                                            .image_32
                                    "
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
                                        slackUnfurls[item.guid].data.value.user
                                            .real_name
                                    }}</span>
                                    <span class="text-xs text-gray-500">
                                        {{
                                            timeAgo(
                                                new Date(
                                                    slackUnfurls[item.guid].data
                                                        .value.message.ts * 1000
                                                ).toISOString()
                                            )
                                        }}
                                        ago</span
                                    >
                                </div>
                                <!-- message -->
                                <div>
                                    {{
                                        slackUnfurls[item.guid].data.value
                                            .message.text
                                    }}
                                </div>
                                <div class="flex text-xs text-gray-500">
                                    <!-- v-if="
                                            slackUnfurls[item.guid].data.value
                                                ?.channel?.name
                                        " -->
                                    <span
                                        class=""
                                        v-if="
                                            slackUnfurls[item.guid].data.value
                                                .message.reply_count
                                        "
                                    >
                                        {{
                                            slackUnfurls[item.guid].data.value
                                                .message.reply_count
                                        }}
                                        replies
                                        <span class="ml-1 mr-1 text-gray-300"
                                            >•</span
                                        >
                                    </span>
                                    <span>
                                        #{{
                                            slackUnfurls[item.guid].data.value
                                                ?.channel?.name
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="flex">
                        <a
                            class="flex cursor-pointer gap-x-2 hover:underline"
                            :href="`//${item?.attributes?.link}`"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                :src="`https://www.google.com/s2/favicons?domain=${item?.attributes?.link}&sz=64`"
                                :alt="item?.attributes?.name"
                                class="w-4 h-4 mr-1"
                            />
                            <span class="text-sm text-gray-500">{{
                                item?.attributes?.name
                            }}</span>
                        </a>
                    </div>
                </div>
                <div
                    v-if="hasSlackLink && !isSlackAuthDone"
                    class="flex items-start w-2/3 p-2 mt-4 bg-gray-100 border rounded "
                >
                    <AtlanIcon
                        :icon="'Slack'"
                        class="h-5 mt-1 mr-2"
                    ></AtlanIcon>
                    <div class="flex flex-col">
                        <span class="font-bold">Connect to Slack</span>
                        <span class="text-gray-500"
                            >Sign in to see richer content previews for slack
                            links</span
                        >
                    </div>
                    <AtlanButton :size="'sm'" class="ml-auto" color="primary"
                        >Connect</AtlanButton
                    >
                </div>
            </div>
            <div
                v-else
                class="flex flex-col items-center justify-center h-full gap-y-3"
            >
                <AtlanIcon
                    icon="EmptyResource"
                    alt="EmptyResource"
                    class="w-auto h-32"
                />
                <p class="text-sm text-center text-gray-700">
                    Add URLs related to this asset
                </p>
                <AddResources :asset="asset" placement="top"
                    ><template #trigger>
                        <AtlanButton
                            size="lg"
                            color="primary"
                            padding="compact"
                        >
                            <AtlanIcon icon="Add" class="inline mb-0.5 mr-1" />
                            Add Resource
                        </AtlanButton></template
                    ></AddResources
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// Vue
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { defineComponent, PropType, computed } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'
import AddResources from './addResource.vue'
import useAssetInfo from '~/composables/discovery/useAssetInfo'
import AtlanButton from '~/components/UI/button.vue'
import integrationStore from '~/store/integrations/index'
import AtlanIcon from '../../icon/atlanIcon.vue'
import {
    isSlackLink,
    getChannelAndMessageIdFromSlackLink,
} from '~/composables/integrations/useSlack'
import { UnfurlSlackMessage } from '~/composables/integrations/useIntegrations'

dayjs.extend(relativeTime)

export default defineComponent({
    components: { AddResources, AtlanButton, AtlanIcon },
    props: {
        asset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    },
    setup() {
        const timeAgo = (time: string) => dayjs().from(time, true)
        // const { links } = useAssetInfo()
        // console.log('links', links)

        const links = () => [
            {
                typeName: 'Link',
                attributes: {
                    qualifiedName: 'c82b5454-0b52-4cc3-189b-a712ef0d1eeb',
                    name: 'Insights discussion',
                    link: 'https://atlanhq.slack.com/archives/C02DDQ79H6Z/p1638282533490900',
                },
                guid: '519bb87d-deec-488b-a896-6fc4840edc4c',
                status: 'ACTIVE',
                displayText: 'Insights discussion',
                classificationNames: [],
                classifications: [],
                meaningNames: [],
                meanings: [],
                isIncomplete: false,
                labels: [],
            },
            {
                typeName: 'Link',
                attributes: {
                    qualifiedName: 'c82b5454-0b52-34c3-446b-1212ef0d1eeb',
                    name: 'Discovery discussion',
                    link: 'https://atlanhq.slack.com/archives/C02CBB6SPDM/p1638280885031500?thread_ts=1638280466.031300&cid=C02CBB6SPDM',
                },
                guid: '519bb87d-deec-488b-a896-6fc48422dc4c',
                status: 'ACTIVE',
                displayText: 'Discovery discussion',
                classificationNames: [],
                classifications: [],
                meaningNames: [],
                meanings: [],
                isIncomplete: false,
                labels: [],
            },
            // {
            //     typeName: 'Link',
            //     attributes: {
            //         qualifiedName: 'c82b5454-0b52-3453-436b-1212ef0d1111',
            //         name: 'Discovery discussion',
            //         link: 'https://atlanhq.slack.com/archives/C02CBB6SPDM/p1638280885031500?thread_ts=1638280466.031300&cid=C02CBB6SPDM',
            //     },
            //     guid: '519bb87d-deec-488b-a896-87578422dc4c',
            //     status: 'ACTIVE',
            //     displayText: 'Discovery discussion',
            //     classificationNames: [],
            //     classifications: [],
            //     meaningNames: [],
            //     meanings: [],
            //     isIncomplete: false,
            //     labels: [],
            // },
            // {
            //     typeName: 'Link',
            //     attributes: {
            //         qualifiedName: 'c82b5454-0b52-4cc3-189b-a712ef0d1ee1',
            //         name: 'Notion doc',
            //         link: 'https://www.notion.so',
            //     },
            //     guid: '519bb87d-deec-488b-a896-3fc4840edc4c',
            //     status: 'ACTIVE',
            //     displayText: 'Notion doc',
            //     classificationNames: [],
            //     classifications: [],
            //     meaningNames: [],
            //     meanings: [],
            //     isIncomplete: false,
            //     labels: [],
            // },
        ]

        const pV = { id: '80c84f2f-ba68-410b-b099-91aacf38ec6f' }

        const slackUnfurls = computed(() => {
            const linkUnfurlMap = {}
            links().forEach((linkItem) => {
                const { link } = linkItem.attributes
                const isSlack = isSlackLink(link)
                if (isSlack) {
                    const { channelId, messageId } =
                        getChannelAndMessageIdFromSlackLink(link)
                    const { data, isLoading, error } = UnfurlSlackMessage(
                        pV,
                        {
                            actionData: {
                                channelId,
                                messageId,
                            },
                        },
                        {
                            immediate: true,
                        }
                    )
                    linkUnfurlMap[linkItem.guid] = { data, isLoading, error }
                }
            })
            return linkUnfurlMap
        })

        const hasSlackLink = computed(() => {
            const linkArr = links()
            const slackLink = linkArr.some((link) =>
                isSlackLink(link.attributes.link)
            )
            return slackLink
        })

        const isSlackAuthDone = true
        return {
            links,
            hasSlackLink,
            isSlackAuthDone,
            isSlackLink,
            slackUnfurls,
            timeAgo,
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
</style>
