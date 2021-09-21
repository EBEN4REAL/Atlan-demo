<template>
    <div class="flex flex-col px-5 py-4">
        <div class="mb-5">
            <SearchAndFilter
                v-model:value="searchTerm"
                :dot="!!filters.length"
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
                    <DataTypes v-model:filters="filters" />
                </template>
            </SearchAndFilter>
        </div>

        <div
            v-for="(asset, index) in filteredList"
            :key="index"
            class="flex flex-col mb-4 overflow-y-auto"
        >
            <ColumnListItem
                :asset="asset"
                @asset-mutation="propagateToColumnList"
            />
        </div>
        <div
            v-if="isLoadMore || isLoading"
            class="flex items-center justify-center"
        >
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
            v-if="isLoading"
            class="flex items-center justify-center mt-4 text-sm leading-none"
        >
            <a-spin size="small" class="mr-2 leading-none"></a-spin
            ><span>Getting column info</span>
        </div>
    </div>
</template>

<script lang="ts">
    import DataTypes from '@common/facets/dataType.vue'
    import { toRefs } from '@vueuse/core'
    import { computed, defineComponent, PropType, ref, watch } from 'vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ColumnListItem from '~/components/discovery/preview/tabs/columns/columnListItem.vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { useColumns } from '~/composables/asset/useColumnRelations'
    import useColumns2 from '~/composables/asset/useColumns2'

    import { dataTypeList } from '~/constant/datatype'
    import { assetInterface } from '~/types/assets/asset.interface'

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
            const { dataTypeImage } = useAssetInfo()
            const { selectedAsset } = toRefs(props)
            /* 
            const assetId = computed(() => selectedAsset.value.guid) */

            const assetQualifiedName = computed(
                () => selectedAsset.value.attributes?.qualifiedName
            )

            const {
                filteredList,
                isLoading,
                searchTerm,
                filters,
                clearAllFilters,
                mutate,
                isLoadMore,
                loadMore,
            } = useColumns2({
                entityParentQualifiedName: assetQualifiedName,
            })

            const propagateToColumnList = () => {
                mutate()
            }

            /*  const {
                filteredList,
                isLoading,
                columnList,
                searchTerm,
                filters,
                clearAllFilters,
            } = useColumns(assetId) */

            return {
                isFilterVisible,
                filteredList,
                searchTerm,
                dataTypeImage,
                clearAllFilters,
                isLoading,
                dataTypeList,
                filters,
                propagateToColumnList,
                isLoadMore,
                loadMore,
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
