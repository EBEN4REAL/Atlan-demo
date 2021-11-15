<template>
    <div class="flex flex-col h-full">
        <div class="px-4 py-2.5 text-sm border-b shadow-sm bg-white">
            <div
                class="flex items-center justify-between"
                v-if="totalFilteredCount > 0"
            >
                <span>
                    {{ totalFilteredCount }}
                    {{ totalFilteredCount > 1 ? 'filters' : 'filter' }}</span
                >
                <div class="flex font-medium text-gray-500">
                    <span class="text-gray-500" @click="handleResetAll">
                        <span class="text-sm cursor-pointer hover:text-primary"
                            >Clear All</span
                        >
                    </span>
                </div>
            </div>
            <div class="flex items-center justify-between text-gray-500" v-else>
                <span> Filters</span>
            </div>
        </div>
        <div class="h-full overflow-y-auto">
            <a-collapse
                v-model:activeKey="activeKey"
                :accordion="isAccordion"
                :class="$style.filter"
                expand-icon-position="right"
                @change="handleActivePanelChange"
                :bordered="false"
            >
                <template
                    v-for="item in dynamicList"
                    :key="`${item.id}_${componentState}`"
                >
                    <Panel
                        :item="item"
                        v-model="localValue"
                        :activeKey="activeKey"
                        @change="handleChange"
                    ></Panel>
                </template>
            </a-collapse>
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, defineComponent, ref, Ref, toRefs, watch } from 'vue'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import Panel from './panel.vue'

    import { glossaryFilters } from '~/constant/filters/discoveryFilters'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
            Panel,
        },
        props: {
            filtersList: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            isAccordion: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            typeName: {
                type: String,
                required: false,
                default() {
                    return '_all'
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const discoveryStore = useAssetStore()
            const { getConnectorImageMap } = useAssetInfo()
            const { modelValue } = useVModels(props, emit)
            const { typeName } = toRefs(props)
            const localValue = ref(modelValue.value)

            const totalAppliedFiltersCount = ref(0)
            const activeKey: Ref<string[]> = ref([])

            const componentState = ref(0)
            const forceRender = () => {
                componentState.value += 1
            }

            if (discoveryStore.activeFacetTab?.length > 0) {
                activeKey.value = discoveryStore.activeFacetTab
            } else {
                activeKey.value = ['hierarchy']
            }

            const { list: cmList } = useCustomMetadataFacet()

            const dynamicList = computed(() => {
                if (props.filtersList?.length > 0) {
                    const arr = glossaryFilters.filter((el) =>
                        props.filtersList?.includes(el.id)
                    )
                    return [...arr, ...cmList.value]
                }

                const arr = glossaryFilters.filter((el) => {
                    if (el.includes) {
                        if (el.includes.includes(typeName.value)) {
                            return true
                        }

                        if (
                            el.id === 'column' &&
                            modelValue.value.column?.length > 0
                        ) {
                            return true
                        }
                        if (
                            el.id === 'table' &&
                            modelValue.value.table?.length > 0
                        ) {
                            return true
                        }

                        return false
                    }

                    return true
                })
                return [...arr, ...cmList.value]
            })

            const totalFilteredCount = computed(() => {
                if (
                    !!Object.keys(localValue.value).find(
                        (k) => k === 'typeName'
                    )
                ) {
                    return Object.keys(localValue.value).length - 1
                }
                return Object.keys(localValue.value).length
            })

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const handleClear = (id: string) => {}

            const handleResetAll = () => {
                localValue.value = {}
                activeKey.value = []
                handleChange()
                forceRender()
            }

            // Function to build filter applied string for owner facet

            const handleActivePanelChange = () => {
                discoveryStore.setActivePanel(activeKey.value)
            }

            return {
                activeKey,

                dynamicList,

                handleChange,
                handleClear,
                localValue,
                handleActivePanelChange,
                getConnectorImageMap,
                totalFilteredCount,
                handleResetAll,
                componentState,
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-b border-gray-200 !important;
        }

        :global(.ant-collapse-item-active) {
            @apply bg-white;

            :global(.title) {
                @apply text-primary !important;
            }
        }

        :global(.ant-collapse-header) {
            @apply px-4 !important;
            @apply py-3 !important;

            &:hover {
                @apply bg-white;
                /* some rules */
            }
        }

        :global(.ant-collapse-item:last-child) {
            @apply border-gray-300;
        }

        :global(.ant-collapse-content-box) {
            @apply pb-3;
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
        }
        :global(.ant-collapse-content) {
            @apply bg-white !important;
        }
    }
</style>
