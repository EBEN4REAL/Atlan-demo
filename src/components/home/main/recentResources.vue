<template>
    <transition v-if="list.length" name="fade">
        <div>
            <h2 class="mb-3 text-sm font-semibold text-gray-500">
                <AtlanIcon icon="Link"></AtlanIcon> Recent Resources
            </h2>
            <div
                v-if="isLoading"
                class="flex items-center justify-center border border-gray-200 rounded"
                style="min-height: 150px"
            >
                <AtlanLoader class="w-full h-10" />
            </div>
            <div
                v-else
                class="overflow-y-auto border border-gray-200 rounded resources-container"
                style="min-height: 150px"
            >
                <div
                    v-if="list.length == 0"
                    class="flex flex-col items-center justify-center h-full"
                >
                    <AtlanIcon
                        icon="EmptyResource2"
                        alt="EmptyResource"
                        class="w-auto h-32"
                    />
                </div>
                <div v-else class="flex flex-col">
                    <div
                        v-for="(item, index) in list"
                        :key="index"
                        class="border-b last:border-0"
                    >
                        <component
                            :is="getPreviewComponent(item?.attributes?.link)"
                            :link="item"
                            :asset-subtitle="true"
                            class="border-none"
                        >
                            <template v-if="item.attributes?.asset" #subtitle>
                                <AssetTitleCtx
                                    :item="item.attributes.asset"
                                    class="mt-2"
                                ></AssetTitleCtx>
                            </template>
                        </component>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        computed,
        provide,
        defineAsyncComponent,
    } from 'vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        InternalAttributes,
        AssetRelationAttributes,
    } from '~/constant/projection'
    import {
        isSlackLink,
        getChannelAndMessageIdFromSlackLink,
    } from '~/composables/integrations/useSlack'
    import integrationStore from '~/store/integrations/index'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import AssetTitleCtx from '@/common/widgets/resources/resourcesWidgetV2/misc/assetTitleContext.vue'

    export default defineComponent({
        name: 'RecentResources',
        components: {
            AssetTitleCtx,
            slackLinkPreview: defineAsyncComponent(
                () =>
                    import(
                        '@/common/widgets/resources/resourcesWidgetV2/previewCard/slackPreview.vue'
                    )
            ),
            linkPreview: defineAsyncComponent(
                () =>
                    import(
                        '@/common/widgets/resources/resourcesWidgetV2/previewCard/linkPreviewCard.vue'
                    )
            ),
        },
        setup() {
            const dependentKey = ref('HOME_RECENTS_ASSETS')
            const limit = ref(15)
            const offset = ref(0)
            const queryText = ref('')

            const readOnly = ref(true)
            provide('readOnly', readOnly)

            const facets = ref({
                typeNames: ['Link'],
            })
            const postFacets = ref({
                typeName: 'Link',
            })
            const aggregations = ref(['typeName'])
            const preference = ref({
                // sort: 'name.keyword-desc',
                sort: '__timestamp-desc',
                display: [],
            })
            const defaultAttributes = ref([
                'link',
                '__createdBy',
                '__timestamp',
                '__modificationTimestamp',
                '__modifiedBy',
                '__guid',
                'asset',
            ])
            const store = integrationStore()

            const { tenantSlackStatus, userSlackStatus } = toRefs(store)
            const relationAttributes = ref([
                'name',
                'certificateStatus',
                'certificateUpdatedAt',
                'certificateUpdatedBy',
            ])
            function getPreviewComponent(url) {
                if (
                    isSlackLink(url) &&
                    tenantSlackStatus.value.configured &&
                    userSlackStatus.value.configured
                ) {
                    return 'slackLinkPreview'
                }
                return 'linkPreview'
            }

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                isValidating,
                fetch,
                error,
                quickChange,
                updateList,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                suppressLogs: true,
            })

            // const { links } = useAssetInfo()
            // const allResources = computed(() => {
            //     if (list.value) {
            //         return list.value.map((a) => ({
            //             title: a.displayText,
            //             links: links(a),
            //         }))
            //     }
            //     return []
            //     // return links(selectedAsset.value)?.sort((a, b) =>
            //     //     // eslint-disable-next-line no-underscore-dangle
            //     //     a.attributes.__timestamp < b.attributes.__timestamp
            //     //         ? -1
            //     //         : 1
            //     // )
            // })
            return {
                // allResources,
                isLoading,
                list,
                getPreviewComponent,
                userSlackStatus,
                tenantSlackStatus,
            }
        },
    })
</script>

<style lang="less" scoped>
    .resources-container {
        height: 360px;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
