<template>
    <div class="flex flex-col px-5 py-4">
        <div class="mb-5">
            <SearchAndFilter
                v-model:value="searchTerm"
                :dot="!!filters.length"
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
            <ColumnListItem :asset="asset" />
        </div>
        <div
            v-if="!isReady"
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
    import { computed, defineComponent, PropType, ref } from 'vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ColumnListItem from '~/components/discovery/preview/tabs/columns/columnListItem.vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { useColumns } from '~/composables/asset/useColumnRelations'
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

            const assetId = computed(() => selectedAsset.value.guid)
            const {
                filteredList,
                isReady,
                error,
                searchTerm,
                filters,
                clearAllFilters,
            } = useColumns(assetId)

            return {
                isFilterVisible,
                filteredList,
                searchTerm,
                dataTypeImage,
                clearAllFilters,
                isReady,
                error,
                dataTypeList,
                filters,
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
