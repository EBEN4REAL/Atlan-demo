<template>
    <div
        class="relative w-full px-3 py-1"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
    >
        <div
            class="selector-height chip-container py-0.5"
            v-if="enrichedSelectedItems.length !== 0"
        >
            <template
                v-for="(item, index) in enrichedSelectedItems"
                :key="item + index"
            >
                <div
                    class="inline-flex cursor-pointer items-center px-3 py-0.5 truncate justify-center mr-2 text-xs text-gray-700 rounded-full bg-gray-light"
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

        <div
            class="absolute right-3 carron-pos"
            @click.stop="clearAllSelected"
            v-if="enrichedSelectedItems?.length > 0 && mouseOver"
        >
            <AtlanIcon :icon="'Cross'" class="w-4 h-4" />
        </div>
        <div class="absolute right-3 carron-pos" v-else>
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
        ref,
        computed,
        defineComponent,
        ComputedRef,
        PropType,
        toRefs,
    } from 'vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Sub panel Head',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
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
            tableQualfiedName: {
                type: String,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { disabled, tableQualfiedName } = toRefs(props)
            const { getDataTypeImage } = useColumn()
            const { selectedItems, selectedColumnsData } = useVModels(props)
            const { updateVQB } = useVQB()
            const { getTableName } = useUtils()
            const mouseOver = ref(false)
            const isAreaFocused = inject('isAreaFocused') as Ref<Boolean>
            const totalColumnsCount = inject('totalColumnsCount') as Ref<Number>
            const isColumnLoading = inject('isColumnLoading') as Ref<Boolean>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const map = inject('map') as Ref<Object>

            const placeholder = computed(() => {
                let data = ''
                data = `Select a table first`
                if (tableQualfiedName.value) {
                    data = `Select from ${totalColumnsCount.value} columns`
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

            const handleMouseOver = () => {
                if (!mouseOver.value) {
                    mouseOver.value = true
                }
            }
            const handleMouseOut = () => {
                if (mouseOver.value) {
                    mouseOver.value = false
                }
            }

            const clearAllSelected = () => {
                selectedItems.value = []
                map.value = {}
                selectedColumnsData.value = []
                updateVQB(activeInlineTab, inlineTabs)
                console.log(map.value, 'destroy')
            }

            return {
                mouseOver,
                handleMouseOver,
                getTableName,
                isColumnLoading,
                enrichedSelectedItems,
                disabled,
                placeholder,
                isAreaFocused,
                getDataTypeImage,
                handleMouseOut,
                clearAllSelected,
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
