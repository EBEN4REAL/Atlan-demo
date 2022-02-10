<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <transition v-if="list.length" name="fade">
        <div>
            <h2 class="mb-3 text-sm font-semibold text-gray-500">
                <AtlanIcon icon="InformationAnnouncement"></AtlanIcon> Recent
                announcements
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
                <div v-for="(item, index) in list" :key="index" class="">
                    <!-- <AssetTitleCtx :item="item" /> -->
                    <AnnouncementWidget
                        :selectedAsset="item"
                        :noBorder="true"
                        :showAssetName="true"
                        class="mb-1 last:mb-0"
                    />
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
            const limit = ref(15)
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
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
