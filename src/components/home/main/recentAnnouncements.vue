<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <div v-if="list.length">
        <h2 class="mb-3 text-lg font-bold text-gray-500">
            Recent announcements
        </h2>
        <div v-if="isLoading">
            <AtlanLoader class="h-10" />
        </div>
        <div v-else class="overflow-y-auto resources-container">
            <div v-for="(item, index) in list" :key="index" class="mb-4">
                <AssetTitleCtx :item="item" />
                <AnnouncementWidget :selectedAsset="item" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        computed,
        defineAsyncComponent,
    } from 'vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        InternalAttributes,
        AssetRelationAttributes,
    } from '~/constant/projection'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AssetPopover from '@/common/popover/assets/index.vue'
    import AssetTitleCtx from '@/home/shared/assetTitleContext.vue'

    export default defineComponent({
        name: 'RecentAnnouncements',
        components: {
            AnnouncementWidget,
            CertificateBadge,
            AssetPopover,
            AssetTitleCtx,
        },
        setup() {
            const dependentKey = ref('HOME_RECENTS_ANNOUNCEMENTS')
            const limit = ref(10)
            const offset = ref(0)
            const queryText = ref('')

            const facets = ref([
                {
                    announcementTitle: [
                        {
                            operator: 'isNotNull',
                            operand: 'announcementTitle',
                        },
                    ],
                },
            ])

            const postFacets = ref({})
            const aggregations = ref(['typeName'])
            const preference = ref({
                sort: 'announcementUpdatedAt-desc',
                display: [],
            })
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])

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

            const {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
            } = useAssetInfo()

            return {
                isLoading,
                list,
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
            }
        },
    })
</script>

<style lang="less" scoped>
    .resources-container {
        height: 390px;
    }
</style>
