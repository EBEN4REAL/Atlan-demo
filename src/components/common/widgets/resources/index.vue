<template>
    <div class="flex flex-col w-full h-full px-5 pt-4 overflow-auto gap-y-5">
        <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-500">Resources</span>

            <AddResources
                v-if="links(selectedAsset)?.length > 0"
                :asset="selectedAsset"
                :edit-permission="linkEditPermission"
                ><template #trigger>
                    <a-button
                        class="text-gray-500 border border-transparent rounded shadow-none hover:border-gray-400"
                    >
                        <AtlanIcon icon="Add" /> </a-button
                ></template>
            </AddResources>
        </div>
        <div>
            <div
                v-if="links(selectedAsset)?.length > 0"
                class="flex flex-col gap-y-4"
            >
                <div v-for="(item, index) in links(selectedAsset)" :key="index">
                    <component
                        :is="getPreviewComponent(item?.attributes?.link)"
                        :edit-permission="linkEditPermission"
                        :item="item"
                        :selected-asset="selectedAsset"
                        class=""
                    />
                </div>
                <SlackUserLoginTrigger
                    v-if="
                        hasAtleastOneSlackLink &&
                        !hasUserLevelSlackIntegration &&
                        hasTenantLevelSlackIntegration
                    "
                    class="mt-6"
                />
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
                <AddResources
                    :asset="selectedAsset"
                    :edit-permission="linkEditPermission"
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
    import SlackUserLoginTrigger from '@common/integrations/slack/slackUserLoginTriggerCard.vue'
    import {
        isSlackLink,
        getChannelAndMessageIdFromSlackLink,
    } from '~/composables/integrations/useSlack'
    import { UnfurlSlackMessage } from '~/composables/integrations/useIntegrations'

    dayjs.extend(relativeTime)

    export default defineComponent({
        components: {
            SlackUserLoginTrigger,
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
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const timeAgo = (time: string) => dayjs().from(time, true)
            const { links, selectedAssetUpdatePermission, assetPermission } =
                useAssetInfo()
            const hasUserLevelSlackIntegration = true
            const hasTenantLevelSlackIntegration = true

            function getPreviewComponent(url) {
                if (
                    isSlackLink(url) &&
                    hasUserLevelSlackIntegration &&
                    hasTenantLevelSlackIntegration
                ) {
                    return 'slackLinkPreview'
                }
                return 'linkPreview'
            }

            const { selectedAsset, isDrawer } = toRefs(props)

            const hasAtleastOneSlackLink = computed(() => {
                const linkArr = links(selectedAsset.value)
                const slackLink = linkArr.some((link) =>
                    isSlackLink(link?.attributes?.link)
                )
                return slackLink
            })

            const linkEditPermission = computed(
                () =>
                    selectedAssetUpdatePermission(
                        selectedAsset.value,
                        isDrawer.value,
                        'RELATIONSHIP_ADD',
                        'Link'
                    ) && assetPermission('CREATE_LINK')
            )

            return {
                links,
                linkEditPermission,
                hasAtleastOneSlackLink,
                hasUserLevelSlackIntegration,
                isSlackLink,
                timeAgo,
                getPreviewComponent,
                hasTenantLevelSlackIntegration,
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
