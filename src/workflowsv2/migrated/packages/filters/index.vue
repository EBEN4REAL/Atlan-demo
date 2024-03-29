<template>
    <div class="flex flex-col">
        <slot></slot>

        <div class="overflow-y-auto">
            <a-collapse
                v-model:activeKey="localActiveKeyValue"
                :accordion="isAccordion"
                expand-icon-position="right"
                :bordered="false"
                class="bg-transparent"
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

    import Panel from './panel.vue'

    export default defineComponent({
        name: 'PackageFilter',
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
                    return '__all'
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
                    return 'Filters'
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
            const {
                typeName,
                isAccordion,
                filterList,
                allowCustomFilters,
                extraCountFilter,
            } = toRefs(props)
            const localValue = ref(modelValue.value)
            const localActiveKeyValue = ref(activeKey.value)

            const componentState = ref(0)
            const forceRender = () => {
                componentState.value += 1
            }

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
                localValue.value = {
                    verified: true,
                }
                activeKey.value = []
                emit('reset')
                forceRender()
            }

            const handleActiveKeyChange = () => {
                console.log('sddas')
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
