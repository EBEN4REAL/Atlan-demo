<template>
    <div class="relative w-full px-3 py-1">
        <div class="flex items-center w-full" v-if="selectedColumn?.label">
            <component
                :is="getDataTypeImage(selectedColumn?.type)"
                class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
            ></component>
            <div style="max-width: 90%" class="truncate">
                <span class="mb-0 ml-1 text-sm text-gray-700">
                    {{ selectedColumn?.label }}
                </span>
            </div>
        </div>
        <span v-else class="text-gray-500">
            {{ placeholder }}
        </span>

        <div class="absolute right-3 top-1">
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
        watch,
        inject,
        computed,
        defineComponent,
        PropType,
        ref,
        onMounted,
        ComputedRef,
        onUnmounted,
        toRefs,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { selectedTables } from '~/types/insights/VQB.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useJoin } from '~/components/insights/playground/editor/vqb/composables/useJoin'
    import { pluralizeString, getValidStringUsingCount } from '~/utils/string'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectedColumn: {
                type: Object,
                required: true,
            },
            selectedTables: {
                type: Object as PropType<selectedTables[]>,
            },
        },

        setup(props, { emit }) {
            const { disabled, selectedTables } = toRefs(props)
            const { selectedColumn } = useVModels(props)
            const { getDataTypeImage } = useColumn()
            const { isJoinPanelStateDisabledComputed } = useJoin()
            const isJoinPanelDisabled = inject(
                'isJoinPanelDisabled'
            ) as Ref<Boolean>
            const isAreaFocused = inject('isAreaFocused') as Ref<Boolean>
            const totalColumnsCount = inject('totalColumnsCount') as Ref<number>
            const isColumnLoading = inject('isColumnLoading') as Ref<Boolean>
            const isTableLoading = inject('isTableLoading') as Ref<Boolean>
            const isTableSelected = inject('isTableSelected') as Ref<Boolean>
            const totalTablesCount = inject('totalTablesCount') as Ref<number>
            const totalViewsCount = inject('totalViewsCount') as Ref<number>
            const getTableInitialBody = inject(
                'getTableInitialBody'
            ) as Function
            const replaceTableBody = inject('replaceTableBody') as Function
            const getColumnInitialBody = inject(
                'getColumnInitialBody'
            ) as Function
            const replaceColumnBody = inject('replaceColumnBody') as Function

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const placeholder = computed(() => {
                let data = ''

                if (
                    !isJoinPanelStateDisabledComputed(
                        isJoinPanelDisabled.value,
                        selectedTables.value
                    )
                ) {
                    if (!isTableSelected.value) {
                        if (isTableLoading.value) {
                            data = 'Loading tables and views...'
                        } else {
                            data = `Select from ${
                                totalTablesCount.value
                            } ${pluralizeString(
                                'table',
                                totalTablesCount.value,
                                false
                            )} ${getValidStringUsingCount(
                                totalViewsCount.value,
                                `and ${totalViewsCount.value} ${pluralizeString(
                                    'view',
                                    totalViewsCount.value,
                                    false
                                )}`
                            )}`
                        }
                    } else {
                        if (isColumnLoading.value) {
                            data = 'Loading columns...'
                        } else {
                            data = `Select from ${
                                totalColumnsCount.value
                            }  ${pluralizeString(
                                'column',
                                totalColumnsCount.value,
                                false
                            )}`
                        }
                    }
                } else {
                    if (isColumnLoading.value) {
                        data = 'Loading columns...'
                    } else {
                        data = `Select from ${
                            totalColumnsCount.value
                        }  ${pluralizeString(
                            'column',
                            totalColumnsCount.value,
                            false
                        )}`
                    }
                }
                return data
            })

            watch(
                [isJoinPanelDisabled, selectedTables],
                () => {
                    if (
                        isJoinPanelStateDisabledComputed(
                            isJoinPanelDisabled.value,
                            selectedTables.value
                        )
                    ) {
                        replaceColumnBody(
                            getColumnInitialBody(
                                selectedTables.value,
                                'initial'
                            )
                        )
                    } else {
                        replaceTableBody(
                            getTableInitialBody(selectedTables.value)
                        )
                    }
                },
                {
                    deep: true,
                    immediate: true,
                }
            )

            return {
                isColumnLoading,
                isTableLoading,
                selectedColumn,
                disabled,
                placeholder,
                isAreaFocused,
                getDataTypeImage,
            }
        },
    })
</script>
<style lang="less" scoped></style>
