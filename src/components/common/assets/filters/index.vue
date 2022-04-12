<template>
    <div class="flex flex-col h-full">
        <div
            class="px-4 pb-3 pt-3.5 text-sm bg-white border-b shadow-sm filter-head"
        >
            <div
                v-if="totalFilteredCount > 0"
                class="flex items-center justify-between leading-none"
            >
                <span>
                    {{ totalFilteredCount }}
                    {{ totalFilteredCount > 1 ? 'filters' : 'filter' }}</span
                >
                <div class="flex leading-none text-gray-500">
                    <span
                        class="text-red-500 clear-filter-asset"
                        @click="handleResetAll"
                    >
                        <span class="text-sm leading-none cursor-pointer"
                            >Clear All</span
                        >
                    </span>
                </div>
            </div>
            <div
                v-else
                class="flex items-center justify-between leading-none text-gray-500 no-filter"
            >
                <span> {{ noFilterTitle }}</span>
            </div>
        </div>
        <slot></slot>
        <div class="h-full overflow-y-auto">
            <a-collapse
                v-model:activeKey="localActiveKeyValue"
                :accordion="isAccordion"
                :bordered="false"
                :class="$style.facetfilter"
                @change="handleActiveKeyChange"
            >
                <template
                    v-for="item in dynamicList"
                    :key="`${item.id}_${componentState}`"
                >
                    <Panel
                        v-model="localValue"
                        :item="item"
                        :component-parent-key="`${item.id}_${componentState}`"
                        :active-key="localActiveKeyValue"
                        @change="handleChange"
                    ></Panel>
                </template>
            </a-collapse>
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'

    import Panel from './panel.vue'

    export default defineComponent({
        name: 'CommonFilter',
        components: {
            Panel,
        },
        props: {
            filterList: {
                type: Array,
                required: false,
                default: () => [],
            },
            modelValue: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            isAccordion: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            typeName: {
                type: String,
                required: false,
                default: () => '__all',
            },
            activeKey: {
                required: false,
            },
            allowCustomFilters: {
                type: Boolean,
                required: false,
                default: () => true,
            },
            noFilterTitle: {
                type: String,
                required: false,
                default: () => 'Filters',
            },
            extraCountFilter: {
                type: Number,
                required: false,
                default: () => 0,
            },
            denyCustomMetadata: {
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: [
            'change',
            'reset',
            'update:modelValue',
            'changeActiveKey',
            'update:activeKey',
        ],
        setup(props, { emit }) {
            const { modelValue, activeKey } = useVModels(props, emit)
            const {
                typeName,
                isAccordion,
                filterList,
                allowCustomFilters,
                extraCountFilter,
                denyCustomMetadata,
            } = toRefs(props)
            const localValue = ref(modelValue.value)
            const localActiveKeyValue = ref(activeKey.value)
            watch(modelValue, (newModelValue) => {
                localValue.value = newModelValue
                localActiveKeyValue.value = activeKey.value
            })

            const componentState = ref(0)
            const forceRender = () => {
                componentState.value += 1
            }
            const { getList: cmList } = useCustomMetadataFacet()

            const dynamicList = computed(() => {
                const arr = filterList.value?.filter((el) => {
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
                if (allowCustomFilters.value) {
                    return [
                        ...arr,
                        ...cmList(
                            typeName.value,
                            true,
                            false,
                            denyCustomMetadata.value
                        ),
                    ]
                }
                return [...arr]
            })

            const totalFilteredCount = computed(() => {
                let count = 0 + extraCountFilter.value
                Object.keys(localValue.value).forEach((key) => {
                    if (key !== 'hierarchy' && key !== 'connector') {
                        if (Array.isArray(localValue.value[key])) {
                            if (localValue.value[key].length > 0) {
                                count += 1
                            }
                        } else if (
                            typeof localValue.value[key] === 'object' &&
                            localValue.value[key] !== null
                        ) {
                            if (Object.keys(localValue.value[key]).length > 0) {
                                count += 1
                            }
                        } else if (typeof localValue.value[key] === 'string')
                            count += 1
                    }
                })
                return count
            })

            const handleChange = (filterItem) => {
                modelValue.value = localValue.value
                emit('change', filterItem)
            }

            const handleResetAll = () => {
                localValue.value = {}
                activeKey.value = []
                emit('reset')
                forceRender()
            }

            const handleActiveKeyChange = () => {
                activeKey.value = localActiveKeyValue.value
                emit('changeActiveKey')
            }

            return {
                localActiveKeyValue,
                dynamicList,
                handleChange,
                localValue,
                handleActiveKeyChange,
                totalFilteredCount,
                handleResetAll,
                componentState,
                isAccordion,
                filterList,
                allowCustomFilters,
            }
        },
    })
</script>

<style lang="less" module>
    .facetfilter {
        :global(.ant-collapse-item) {
            :global(.ant-collapse-header) {
                padding-left: 1rem !important;
                padding-right: 1rem !important;
            }
        }
    }
</style>
