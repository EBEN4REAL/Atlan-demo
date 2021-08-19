<template>
    <div class="flex flex-col px-5 py-4">
        <div class="flex items-center justify-between mb-5">
            <a-input
                v-model:value="searchTerm"
                placeholder="Search columns"
                size="default"
                :class="$style.searchbar"
            >
                <template #suffix>
                    <AtlanIcon icon="Search" />
                </template>
            </a-input>
            <a-popover
                v-model:visible="isFilterVisible"
                trigger="click"
                placement="leftTop"
            >
                <template #content>
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

                <a-button class="p-1 ml-2 rounded">
                    <AtlanIcon
                        :icon="filters.length ? 'FilterDot' : 'Filter'"
                        class="h-6"
                    />
                </a-button>
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
                    class="flex-none w-auto h-4 mr-2 text-gray"
                ></component>
                <span
                    class="
                        flex-shrink
                        pt-0.5
                        mr-2
                        overflow-hidden
                        text-xs
                        font-bold
                        align-middle
                        text-gray
                        overflow-ellipsis
                    "
                >
                    {{ asset.displayText }}
                </span>
                <div class="chip" v-if="asset.attributes.isPrimary">
                    <AtlanIcon icon="PrimaryKey" />
                </div>
                <div class="chip" v-if="asset.attributes.isPrimary">
                    <AtlanIcon icon="ForeignKey" />
                </div>
            </div>
            <span
                class="text-xs leading-relaxed text-gray-500 whitespace-pre-wrap "
            >
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
        @apply border;
        @apply border-gray-300;
    }
</style>

<style lang="less" module>
    .searchbar {
        @apply mr-2 rounded;
        @apply border-2 border-gray-300 !important;
        @apply outline-none;
        :global(.ant-input) {
            @apply h-6;
            @apply bg-transparent;
            @apply text-gray-500;
        }
        &:hover {
            border-right-width: 2px !important;
            box-shadow: 0 0 0 2px rgb(82 119 215 / 20%);
        }
        ::placeholder {
            @apply text-gray-500 opacity-80 text-sm;
        }
    }
</style>
