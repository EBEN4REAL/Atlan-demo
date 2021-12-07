<template>
    <div class="p-4 bg-white rounded" style="min-height: 140px">
        <div class="flex items-center justify-between mb-5">
            <div class="flex items-center">
                <!-- <AtlanIcon icon="Resources" class="w-auto h-8 mr-3" /> -->
                <span class="text-base font-bold text-gray">Resources</span>
            </div>
            <AddResources v-if="links(asset)?.length > 0" :asset="asset"
                ><template #trigger>
                    <a-button
                        class="text-gray-500 border border-transparent rounded shadow-none  hover:border-gray-400"
                    >
                        <AtlanIcon icon="Add" /> </a-button
                ></template>
            </AddResources>
        </div>
        <div>
            <div v-if="links(asset)?.length > 0" class="flex flex-col gap-y-4">
                <div v-for="(item, index) in links(asset)" :key="index">
                    <component
                        :is="getPreviewComponent(item?.attributes?.link)"
                        :item="item"
                        class=""
                    />
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
                <AddResources :asset="asset"
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

import {
    defineComponent,
    PropType,
    computed,
    toRefs,
    defineAsyncComponent,
} from 'vue'
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
    components: {
        AddResources,
        AtlanButton,
        AtlanIcon,
        slackLinkPreview: defineAsyncComponent(
            () => import('./previews/slackLinkPreviewCard.vue')
        ),
        linkPreview: defineAsyncComponent(
            () => import('./previews/linkPreviewCard.vue')
        ),
    },
    props: {
        asset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    },
    setup(props) {
        const timeAgo = (time: string) => dayjs().from(time, true)
        const { links } = useAssetInfo()
        console.log('links', links)

        function getPreviewComponent(url) {
            // hasSlackLink && !isSlackAuthDone
            return 'linkPreview'
        }

        const pV = { id: '80c84f2f-ba68-410b-b099-91aacf38ec6f' }
        const { asset } = toRefs(props)

        const hasSlackLink = computed(() => {
            const linkArr = links(asset.value)
            const slackLink = linkArr.some((link) =>
                isSlackLink(link?.attributes?.link)
            )
            return slackLink
        })

        const isSlackAuthDone = true

        return {
            links,
            hasSlackLink,
            isSlackAuthDone,
            isSlackLink,
            timeAgo,
            getPreviewComponent,
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
