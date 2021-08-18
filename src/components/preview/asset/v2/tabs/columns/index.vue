<template>
    <div class="flex flex-col px-5 py-4">
        <div class="flex items-center justify-between mb-5">
            <a-input
                v-model:value="searchTerm"
                placeholder="Search columns"
                size="default"
                :class="$style.searchbar"
            >
                <template #prefix>
                    <Fa icon="fal search" class="mr-2 text-gray-500" />
                </template>
            </a-input>
            <a-popover
                v-model:visible="isFilterVisible"
                trigger="click"
                placement="leftTop"
            >
                <template #content>
                    <div class="flex items-center justify-between mb-2 text-sm">
                        <span>By type</span>
                        <span
                            class="text-gray-500 cursor-pointer hover:font-bold"
                            @click="clearAllFilters"
                            >clear all</span
                        >
                    </div>
                    <!-- <p class="mb-1 text-xs text-gray-500">By type</p> -->
                    <DataTypes v-model:filters="filters" />
                </template>

                <div
                    tabindex="0"
                    class="flex items-center px-4 py-1 transition-shadow border border-gray-300 rounded  hover:border-gray-300"
                    @keyup.enter="isFilterVisible = !isFilterVisible"
                >
                    <span> Filters</span>
                    <Fa
                        icon="fas chevron-down"
                        class="ml-1 transition-transform transform"
                        :class="isFilterVisible ? '-rotate-180' : 'rotate-0'"
                    />
                </div>
            </a-popover>
        </div>

        <div
            class="flex flex-col mb-4 overflow-y-auto"
            v-for="(asset, index) in filteredList"
            :key="index"
        >
            <div class="flex items-center mb-1">
                <component
                    :is="dataTypeImage(asset)"
                    class="w-3 h-3 mr-1 text-gray"
                ></component>
                <span
                    class="items-center flex-shrink mr-2 text-xs leading-tight  text-gray"
                >
                    {{ asset.displayText }}
                </span>
                <div class="chip pkey" v-if="asset.attributes.isPrimary">
                    <Fa icon="fas key" />
                    <span class="pl-1">Pkey</span>
                </div>
                <div class="chip fkey" v-if="asset.attributes.isPrimary">
                    <Fa icon="fas key" class="transform rotate-180" />
                    <span class="pl-1">Fkey</span>
                </div>
            </div>
            <span class="text-xs leading-relaxed text-gray-500">
                {{ asset.attributes.description || 'No description' }}
            </span>
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
    import { computed, defineComponent, PropType, ref } from 'vue'
    import { toRefs } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useColumns } from '~/composables/asset/useColumnRelations'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { dataTypeList } from '~/constant/datatype'
    import DataTypes from '@common/facets/dataType.vue'

    export default defineComponent({
        components: { DataTypes },
        name: 'Column Tab',
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
    }
    .pkey {
        color: #52c7d7;
        background-color: #52c7d71a;
    }
    .fkey {
        color: #d452d7;
        background-color: #d452d71a;
    }
</style>

<style lang="less" module>
    .searchbar {
        @apply mr-2 border-none rounded;
        @apply bg-gray-300 bg-opacity-50;
        @apply outline-none;
        :global(.ant-input) {
            @apply h-6;
            @apply bg-transparent;
            @apply text-gray-500;
        }
        ::placeholder {
            @apply text-gray-500 opacity-80;
        }
    }
</style>
