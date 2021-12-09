<template>
    <div class="flex flex-col h-full">
        <div class="px-4 pt-2 pb-2.5 text-sm bg-white border-b shadow-sm filter-head">
            <div
                v-if="totalFilteredCount > 0"
                class="flex items-center justify-between"
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
            <div v-else class="flex items-center justify-between text-gray-500 no-filter">
                <span> {{noFilterTitle}}</span>
            </div>
        </div>
        <slot></slot>
        <div class="h-full overflow-y-auto">
            <a-collapse
                v-model:activeKey="localActiveKeyValue"
                :accordion="isAccordion"
                :class="$style.filter"
                expand-icon-position="right"
                :bordered="false"
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
                default() {
                    return []
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
            activeKey: {
                required: false,
            },
            allowCustomFilters: {
                required: false,
                default() {
                    return true
                },
            },
            noFilterTitle: {
                required: false,
                default() {
                    return "Filters"
                },
            },
            extraCountFilter: {
                required: false,
                default() {
                    return 0
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
            const { typeName, isAccordion, filterList, allowCustomFilters, extraCountFilter } =
                toRefs(props)
            const localValue = ref(modelValue.value)
            const localActiveKeyValue = ref(activeKey.value)

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
                    return [...arr, ...cmList(typeName.value)]
                }
                return [...arr]
            })

            const totalFilteredCount = computed(() => {
                let count = 0 + extraCountFilter.value
                Object.keys(localValue.value).forEach((key) => {
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
                    }
                })
                return count
            })

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
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
    .filter {
        :global(.ant-collapse-item) {
            @apply border-b border-gray-light !important;
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
