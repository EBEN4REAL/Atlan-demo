<template>
    <div class="w-full">
        <a-tabs
            class="w-full"
            :class="$style.assetbar"
            v-model:activeKey="localFacetMap.typeName"
            @change="handleChange"
        >
            <a-tab-pane v-for="item in assetTypeList" :key="item.id">
                <template #tab>
                    <div
                        :class="{ active: item.id === localFacetMap.typeName }"
                    >
                        <span>{{ item.label }}</span>
                        <span :class="$style.chip">{{
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
                                            class="px-2 py-1 mr-1 border rounded cursor-pointer "
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

                    <div
                        class="flex items-center hover:text-primary"
                        :class="$style.tab"
                    >
                        <AtlanIcon icon="Globe" class="w-auto h-5" />
                        <AtlanIcon icon="ChevronDown" class="w-3 h-3" />
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

            return {
                assetTypeList,
                getCountString,
                assetCategoryList,
                isAssetStatusSelected,
                toggleStatusSelect,
                handleChange,
                localFacetMap,
            }
        },
    })
</script>

<style lang="less" module>
    .assetbar {
        .chip {
            @apply ml-1;
            @apply tracking-wide;
            @apply text-xs;
            @apply font-bold;
            @apply text-gray-400;
        }

        .active {
            .chip {
                @apply text-primary;
            }
        }
        :global(.ant-tabs-tab) {
            @apply bg-white text-sm mr-1 !important;
            border: 1px solid #e6e6eb;
            border-radius: 24px !important;
            border: 1px solid #e6e6eb !important;

            padding: 3px 8px !important;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05) !important;

            transition: all 0.8s ease-out;
        }
        :global(.ant-tabs-nav) {
            @apply mb-1;
        }

        :global(.ant-tabs-tab:first-child) {
        }

        :global(.ant-tabs-nav-container-scrolling) {
            padding-left: 24px;
            padding-right: 24px;
        }

        :global(.ant-tabs-tab-active) {
            @apply bg-primary-light !important;
            @apply text-primary !important;
            @apply border-primary !important;

            .chip {
                @apply text-primary !important;
            }
        }

        :global(.ant-tabs-ink-bar) {
            @apply hidden !important;
        }

        :global(.ant-tabs-nav-wrap) {
            margin-top: 0px !important;
            min-height: 30px !important;
        }

        :global(.ant-tabs-extra-content) {
            float: left !important;
        }

        :global(.ant-tabs-tab-arrow-show) {
            margin-top: -3px;
            width: 24px !important;
        }
    }

    .tab {
        @apply bg-white text-sm mr-1 !important;
        border: 1px solid #e6e6eb;
        border-radius: 24px !important;
        border: 1px solid #e6e6eb !important;

        padding: 3px 8px !important;
        box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05) !important;

        transition: all 0.8s ease-out;
    }
</style>
