<template>
    <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-5 py-4">
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    class="mb-0.5"
                />
                <span class="ml-1 font-semibold text-gray-500">Objects</span>
            </span>
        </div>

        <div
            v-if="
                !isValidating &&
                error &&
                error?.message !== 'operation cancelled'
            "
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>

        <div
            v-else-if="list.length === 0 && !isValidating && queryText === ''"
            class="flex-grow"
        >
            <EmptyView
                empty-screen="NoAssetsFound"
                desc="No objects present in this bucket"
            ></EmptyView>
        </div>
        <div
            v-else-if="list.length === 0 && isValidating"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanLoader class="h-10" />
        </div>

        <div v-else class="flex flex-col flex-grow overflow-y-auto">
            <div class="px-5 pb-0">
                <SearchAdvanced
                    v-model:value="queryText"
                    :autofocus="true"
                    :placeholder="`Search ${totalCount} objects`"
                    class=""
                    @change="handleSearchChange"
                />
            </div>

            <div
                v-if="list.length === 0 && !isValidating && queryText !== ''"
                class="flex items-center justify-center flex-grow"
            >
                <EmptyView
                    empty-screen="NoAssetsFound"
                    image-class="h-44"
                    desc="No objects found"
                ></EmptyView>
            </div>

            <!-- {{ list }} -->
            <AssetList
                v-else
                ref="assetlistRef"
                :list="list"
                :is-load-more="isLoadMore"
                :is-loading="isValidating"
                @loadMore="handleLoadMore"
                class="mt-2"
            >
                <template #default="{ item, itemIndex }">
                    <AssetItem
                        :item="item"
                        :item-index="itemIndex"
                        :asset-name-truncate-percentage="'93%'"
                        class="px-2 hover:bg-primary-menu"
                        is-compact
                        :enable-sidebar-drawer="true"
                        @updateDrawer="handleListUpdate"
                    />
                </template>
            </AssetList>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType, watch } from 'vue'

    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'

    import AssetItem from '@common/assets/list/assetItem.vue'
    import { useDebounceFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'

    import AssetList from '@/common/assets/list/index.vue'

    import {
        DefaultRelationAttributes,
        MinimalAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    export default defineComponent({
        name: 'ColumnWidget',
        components: {
            SearchAdvanced,
            PreviewTabsIcon,
            AssetList,
            AssetItem,
            EmptyView,
            ErrorView,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            tab: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const { qualifiedName } = useAssetInfo()

            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')

            const facets = ref({})
            const postFacets = ref({ typeName: 'S3Object' })

            const dependentKey = ref('DEFAULT_S3OBJECTS')
            const defaultAttributes = ref([...MinimalAttributes])
            const preference = ref({})

            const relationAttributes = ref([...DefaultRelationAttributes])

            const updateFacet = () => {
                facets.value = {}

                facets.value.s3BucketQualifiedName = qualifiedName(
                    selectedAsset.value
                )
            }

            const {
                list,
                isValidating,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                error,
                updateList,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                suppressLogs: true,
            })

            const handleListUpdate = (asset: any) => {
                updateList(asset)
            }

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

            return {
                isValidating,
                queryText,
                list,
                facets,
                isLoadMore,
                postFacets,
                fetch,
                quickChange,
                totalCount,
                updateFacet,
                handleSearchChange,
                handleLoadMore,
                error,
                handleListUpdate,
            }
        },
    })
</script>
