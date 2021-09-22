<template>
    <div class="flex flex-col px-5 py-4">
        <div class="mb-5">
            <SearchAndFilter
                v-model:value="queryText"
                @change="handleSearchChange"
                :autofocus="true"
                placeholder="Search columns"
            >
                <template #filter>
                    <div class="flex items-center justify-between mb-2 text-sm">
                        <span>Data type</span>
                        <span
                            class="text-gray-500 cursor-pointer hover:text-gray"
                            @click="clearAllFilters"
                            >Clear</span
                        >
                    </div>
                    <DataTypes
                        v-model:filters="filters"
                        @update:filters="handleFilterChange"
                    />
                </template>
            </SearchAndFilter>
        </div>

        <div
            v-for="(asset, index) in list"
            :key="index"
            class="flex flex-col mb-4 overflow-y-auto"
        >
            <ColumnListItem
                :asset="asset"
                @asset-mutation="propagateToColumnList"
            />
        </div>

        <div v-if="isLoadMore" class="flex items-center justify-center">
            <button
                :disabled="isLoading"
                class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full  text-primary"
                :class="isLoading ? 'px-2 w-9' : 'px-5 w-32'"
                @click="loadMore"
            >
                <template v-if="!isLoading">
                    <p
                        class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300  overflow-ellipsis whitespace-nowrap"
                    >
                        Load more
                    </p>
                    <AtlanIcon icon="ArrowDown" />
                </template>
                <svg
                    v-else
                    class="w-5 h-5 text-primary animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    ></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </button>
        </div>
        <div
            v-if="isLoading && !isLoadMore"
            class="flex items-center justify-center mt-4 text-sm leading-none"
        >
            <a-spin size="small" class="mr-2 leading-none"></a-spin
            ><span>Getting column info</span>
        </div>
        <div
            v-if="list.length <= 0 && !isLoading"
            class="flex flex-col items-center"
        >
            <img
                :src="emptyScreen"
                alt="No columns"
                class="w-2/5 m-auto mb-4"
            />
            <span class="text-gray-500">No columns found</span>
            <a-button class="mt-3" @click="clearFiltersAndSearch"
                >Clear all filters</a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
    import DataTypes from '@common/facets/dataType.vue'
    import { toRefs, useDebounceFn } from '@vueuse/core'
    import { computed, defineComponent, PropType, ref, Ref, watch } from 'vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ColumnListItem from '~/components/discovery/preview/tabs/columns/columnListItem.vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import useColumns2 from '~/composables/asset/useColumns2'
    import emptyScreen from '~/assets/images/empty_search.png'

    import { dataTypeList } from '~/constant/datatype'
    import { assetInterface } from '~/types/assets/asset.interface'
    import {
        BasicSearchAttributes,
        ColumnAttributes,
    } from '~/constant/projection'
    import { useBusinessMetadataStore } from '~/store/businessMetadata'

    export default defineComponent({
        name: 'ColumnTab',
        components: { DataTypes, ColumnListItem, SearchAndFilter },
        props: {
            id: String,
            componentData: {
                type: Object as PropType<any>,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const isFilterVisible = ref(false)
            const queryText = ref('')
            const limit = ref(20)
            const offset = ref(0)
            const filters: Ref<string[]> = ref([])
            const dataTypeFilters = ref([])

            const { dataTypeImage } = useAssetInfo()
            const { selectedAsset } = toRefs(props)
            /*
            const assetId = computed(() => selectedAsset.value.guid) */

            const assetQualifiedName = computed(
                () => selectedAsset.value.attributes?.qualifiedName
            )

            const { list, isLoading, replaceBody, isLoadMore } = useColumns2({
                entityParentQualifiedName: assetQualifiedName,
            })

            const updateBody = () => {
                const initialBody = {
                    typeName: 'Column',
                    excludeDeletedEntities: true,
                    includeClassificationAttributes: true,
                    includeSubClassifications: true,
                    includeSubTypes: true,
                    entityFilters: {},
                    limit: limit.value,
                    offset: offset.value,
                    attributes: [
                        'description',
                        'userDescription',
                        'customDescription',
                        'owner',
                        'expert',
                        'files',
                        'table',
                        'database',
                        'atlanSchema',
                        'profileSchedule',
                        'isProfileScheduled',
                        'order',
                        'extra',
                        'metadata',
                        'commits',
                        'siteName',
                        'siteQualifiedName',
                        'topLevelProjectName',
                        'topLevelProjectQualifiedName',
                        'isTopLevelProject',
                        'projectHierarchy',
                        'projectName',
                        'workbookName',
                        'datasourceName',
                        ...BasicSearchAttributes,
                        ...useBusinessMetadataStore()
                            .getBusinessMetadataListProjections,
                        ...ColumnAttributes,
                    ],
                }
                initialBody.entityFilters = {
                    condition: 'AND',
                    criterion: [
                        {
                            condition: 'OR',
                            criterion: [...dataTypeFilters.value],
                        },
                        {
                            condition: 'OR',
                            criterion: [
                                {
                                    attributeName: 'tableQualifiedName',
                                    attributeValue: assetQualifiedName.value,
                                    operator: 'eq',
                                },
                                {
                                    attributeName: 'viewQualifiedName',
                                    attributeValue: assetQualifiedName.value,
                                    operator: 'eq',
                                },
                            ],
                        },
                    ],
                }

                if (queryText.value) {
                    initialBody.query = queryText.value
                }
                replaceBody(initialBody)
            }

            const loadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                    updateBody()
                }
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                updateBody()
            }, 150)

            const propagateToColumnList = () => {}

            const clearAllFilters = () => {
                filters.value = []
                dataTypeFilters.value = []
                offset.value = 0
                updateBody()
            }

            const clearFiltersAndSearch = () => {
                filters.value = []
                dataTypeFilters.value = []
                queryText.value = ''
                offset.value = 0
                updateBody()
            }
            const handleFilterChange = () => {
                offset.value = 0
                dataTypeFilters.value = dataTypeList
                    .filter((typeList) => filters.value.includes(typeList.id))
                    .reduce((acc: string[], dt) => [...acc, ...dt.type], [])
                    .map((filter) => ({
                        attributeName: 'dataType',
                        attributeValue: filter,
                        operator: 'eq',
                    }))
                updateBody()
            }

            watch(assetQualifiedName, (newParent, oldParent) => {
                if (newParent !== oldParent) {
                    offset.value = 0
                    filters.value = []
                    dataTypeFilters.value = []
                    updateBody()
                }
            })

            return {
                isFilterVisible,
                list,
                queryText,
                dataTypeImage,
                clearAllFilters,
                isLoading,
                dataTypeList,
                filters,
                propagateToColumnList,
                isLoadMore,
                loadMore,
                handleSearchChange,
                handleFilterChange,
                emptyScreen,
                clearFiltersAndSearch,
            }
        },
    })
</script>

<style scoped>
    .chip {
        @apply px-1 py-0.5 mr-1;
        @apply rounded;
        @apply flex;
        @apply items-center;
        @apply text-xs;
        @apply border;
        @apply border-gray-300;
    }
</style>
