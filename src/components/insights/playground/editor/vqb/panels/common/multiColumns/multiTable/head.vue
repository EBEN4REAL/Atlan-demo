<template>
    <div class="relative w-full px-3 py-1">
        <div
            class="py-1 selector-height chip-container"
            v-if="enrichedSelectedItems.length !== 0"
        >
            <template
                v-for="(item, index) in enrichedSelectedItems"
                :key="item + index"
            >
                <div
                    class="inline-flex items-center justify-center px-3 py-0.5 mr-2 text-xs text-gray-700 truncate rounded-full cursor-pointer bg-gray-light"
                >
                    <component
                        v-if="item.type !== 'Columns'"
                        :is="getDataTypeImage(item.type)"
                        class="flex-none -mt-0.5 h-4 w-4 text-xs text-gray-500 mr-1"
                    ></component>
                    <AtlanIcon
                        v-else
                        icon="Columns"
                        class="w-4 h-4 mr-1 text-xs text-gray-500"
                    />

                    <a-tooltip>
                        <template #title>
                            <div>
                                {{
                                    `TABLE: ${getTableName(item.qualifiedName)}`
                                }}
                            </div>
                        </template>

                        <div class="overflow-hidden truncate overflow-ellipsis">
                            {{ item.label }}
                        </div>
                    </a-tooltip>
                </div>
            </template>
        </div>
        <span v-else class="text-gray-500">
            {{ placeholder }}
        </span>

        <div class="absolute right-3 carron-pos">
            <AtlanIcon
                :icon="isAreaFocused ? 'ChevronUp' : 'ChevronDown'"
                class="w-4 h-4"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        Ref,
        inject,
        computed,
        defineComponent,
        PropType,
        toRefs,
    } from 'vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { selectedTables } from '~/types/insights/VQB.interface'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectedTables: {
                type: Object as PropType<selectedTables[]>,
            },
            selectedItems: {
                type: Object as PropType<string[]>,
                required: true,
            },
            selectedColumnsData: {
                type: Object as PropType<
                    Array<{
                        qualifiedName: string
                        label: string
                        type: Number
                    }>
                >,
                required: true,
            },
        },

        setup(props, { emit }) {
            const {
                disabled,
                selectedTables,
                selectedColumnsData,
                selectedItems,
            } = toRefs(props)
            const { getDataTypeImage } = useColumn()
            const { getTableName } = useUtils()
            const isAreaFocused = inject('isAreaFocused') as Ref<Boolean>
            const totalTablesCount = inject('totalTablesCount') as Ref<Number>
            const totalColumnsCount = inject('totalColumnsCount') as Ref<Number>
            const isColumnLoading = inject('isColumnLoading') as Ref<Boolean>
            const isTableLoading = inject('isTableLoading') as Ref<Boolean>
            const isTableSelected = inject('isTableSelected') as Ref<Boolean>

            const placeholder = computed(() => {
                let data = ''

                if (selectedTables.value?.length > 1) {
                    if (!isTableSelected.value) {
                        if (isTableLoading.value) {
                            data = 'Loading...'
                        } else {
                            data = `Select from ${totalTablesCount.value} tables`
                        }
                    } else {
                        if (isColumnLoading.value) {
                            data = 'Loading...'
                        } else {
                            data = `Select from ${totalColumnsCount.value} columns`
                        }
                    }
                } else {
                    if (isColumnLoading.value) {
                        data = 'Loading...'
                    } else {
                        data = `Select from ${totalColumnsCount.value} columns`
                    }
                }
                return data
            })

            const enrichedSelectedItems = computed(() => {
                const data: any[] = []
                selectedItems.value.forEach((val) => {
                    if (val === 'all') {
                        data.push({
                            type: 'Columns',
                            label: 'All columns',
                        })
                    } else {
                        const t = selectedColumnsData.value.find(
                            (e) => e.qualifiedName === val
                        )
                        data.push({
                            ...t,
                            type: t?.type ?? 'Columns',
                            label: t?.label,
                        })
                    }
                })
                return data
            })

            return {
                getTableName,
                isColumnLoading,
                isTableLoading,
                enrichedSelectedItems,
                disabled,
                placeholder,
                isAreaFocused,
                getDataTypeImage,
            }
        },
    })
</script>
<style lang="less" scoped>
    .chip-container {
        gap: 4px;
        max-width: 100% !important;
        flex-wrap: wrap;
        display: flex;
        align-items: center;
    }
    .parent-ellipsis-container {
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .parent-ellipsis-container-extension {
        flex-shrink: 0;
    }
    .selector-height {
        // min-height: 34px;
    }
    .carron-pos {
        transform: translateY(-50%);
        top: 50%;
    }
</style>
