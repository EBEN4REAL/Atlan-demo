<template>
    <div class="w-full">
        <a-tabs
            class="w-full assetbar"
            v-model:activeKey="localFacetMap.typeName"
            @change="handleChange"
        >
            <a-tab-pane v-for="item in assetTypeList" :key="item.id">
                <template #tab>
                    <div>
                        <span>{{ item.label }}</span>
                        <span class="chip">{{
                            getCountString(item.count)
                        }}</span>
                    </div>
                </template>
            </a-tab-pane>
            <template v-slot:tabBarExtraContent>
                <a-popover trigger="click" placement="bottomLeft" class="">
                    <template #content>
                        <div
                            class="flex flex-col py-1 rounded  gap-y-3 preference-container"
                        >
                            <div class="pt-3">
                                <p class="mb-2 text-sm text-gray-500">
                                    Asset Category
                                </p>
                                <div class="flex flex-wrap">
                                    <template
                                        v-for="item in assetCategoryList"
                                        :key="item.id"
                                    >
                                        <div
                                            class="px-2 py-1 mb-1 mr-1 border rounded cursor-pointer "
                                            :class="
                                                isAssetStatusSelected(item)
                                                    ? 'bg-primary-light border-white hover:bg-primary-light text-gray'
                                                    : ' text-gray-500'
                                            "
                                            @click="
                                                () => toggleStatusSelect(item)
                                            "
                                        >
                                            {{ item.label }}
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>

                    <div class="flex items-center mt-1 hover:text-primary">
                        <AtlanIcon icon="Globe" class="w-7 h-7" />
                        <AtlanIcon icon="ChevronDown" class="w-4 h-4" />
                    </div>
                </a-popover>
            </template>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        nextTick,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { getCountString } from '~/utils/number'

    import { useVModels } from '@vueuse/core'

    import { assetCategoryList } from '~/constant/assetCategory'

    export default defineComponent({
        name: 'AssetTypeTabs',
        props: {
            facetMap: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            assetTypeList: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            assetTypeMap: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            total: {
                type: Number,
                required: false,
                default() {
                    return 0
                },
            },
            modelValue: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            connectors: {
                type: Array,
                required: false,
                default() {
                    return ['snowflake']
                },
            },
        },
        emits: ['change', 'update:facetMap'],
        setup(props, { emit }) {
            const { facetMap } = useVModels(props, emit)

            const { assetTypeList } = toRefs(props)

            const localFacetMap = ref(facetMap.value)

            const assetCategory: Ref<string[]> = ref([])

            const isAssetStatusSelected = (property) =>
                assetCategory.value.includes(property.id)

            const toggleStatusSelect = (property) => {
                if (assetCategory.value.includes(property.id)) {
                    const index = assetCategory.value.indexOf(property.id)
                    assetCategory.value.splice(index, 1)
                } else {
                    assetCategory.value.push(property.id)
                }
            }
            // const assetType = ref<String>(props.modelValue)

            // const handleChange = () => {
            //     console.log('sadasd')
            //     emit('update:modelValue', assetType.value)
            // }

            const handleChange = () => {
                const found = assetTypeList.value.find(
                    (item) =>
                        item.id.toLowerCase() ===
                        localFacetMap.value?.typeName?.toLowerCase()
                )

                if (found) {
                    localFacetMap.value.count = found.count
                }

                facetMap.value = localFacetMap.value

                emit('change')
            }

            // watch(
            //     () => props.assetTypeList,
            //     () => {
            //         // check if the current assetType exists in assetTypeList
            //         const found = props.assetTypeList.find(
            //             (item) => item.id === assetType.value
            //         )
            //         if (!found) {
            //             assetType.value = 'Catalog'
            //             handleChange()
            //         }
            //     },
            //     {
            //         immediate: true,
            //     }
            // )
            // const sortedAssetTypeList = computed(() => {
            //     // remove catalog object so that the rest of list can be used for filtering
            //     const assetTypeListWithoutCatalog = props.assetTypeList.filter(
            //         (type) => type.id !== 'Catalog'
            //     )
            //     // get catalog object - to reconstruct the sorted list- this would always be the first tab
            //     const catalogObject = props.assetTypeList.filter(
            //         (type) => type.id === 'Catalog'
            //     )
            //     // filter out types with 0 results
            //     const typesWithNoResults = assetTypeListWithoutCatalog.filter(
            //         (type) => !props.assetTypeMap[type.id]
            //     )
            //     // filter out types with results
            //     const typesWithResults = assetTypeListWithoutCatalog.filter(
            //         (type) =>
            //             props.assetTypeMap[type.id] &&
            //             props.assetTypeMap[type.id] > 0
            //     )
            //     return [
            //         ...catalogObject,
            //         ...typesWithResults,
            //         ...typesWithNoResults,
            //     ]
            // })
            // watch(assetTypeMap, () => {
            //     const prev = assetType.value
            //     assetType.value = ''
            //     nextTick(() => (assetType.value = prev))
            // })

            return {
                assetTypeList,
                getCountString,
                assetCategoryList,
                isAssetStatusSelected,
                toggleStatusSelect,

                handleChange,
                localFacetMap,

                // getCountString,
                // sortedAssetTypeList,
            }
        },
    })
</script>

<style lang="less">
    .assetbar {
        .ant-tabs-bar {
            @apply mb-0 border-0 !important;
        }
        .ant-tabs-tab {
            @apply bg-white text-sm mr-1 !important;
            border: 1px solid #e6e6eb;
            border-radius: 24px !important;
            border: 1px solid #e6e6eb !important;

            padding: 3px 8px !important;
            box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05) !important;

            transition: all 0.8s ease-out;
        }
        .ant-tabs-tab:first-child {
            @apply ml-3 !important;
        }
        .ant-tabs-tab-active {
            @apply bg-primary-light !important;
            @apply text-primary !important;
            @apply border-primary !important;
        }

        .ant-tabs-ink-bar {
            @apply hidden !important;
        }

        .ant-tabs-nav-wrap {
            margin-top: 4px !important;
            min-height: 30px !important;
        }

        .ant-tabs-extra-content {
            float: left !important;
        }
    }
</style>

<style scoped>
    .chip {
        @apply py-0.5 ml-2;
        @apply rounded;
        @apply tracking-wide;
        @apply text-xs;
        @apply font-bold;
        @apply text-gray-400;
    }
    .active {
        @apply text-primary;
    }
    .active .chip {
        @apply text-primary;
        @apply bg-primary-light;
    }
</style>
