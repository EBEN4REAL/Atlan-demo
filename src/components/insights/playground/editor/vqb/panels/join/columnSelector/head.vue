<template>
    <div class="relative w-full px-3 py-1">
        <div class="flex w-full">
            <component
                :is="getDataTypeImage(selectedColumn?.type)"
                class="flex-none w-auto h-4 mr-1 text-gray-500"
            ></component>
            <div class="w-full">
                <div
                    v-if="selectedColumn?.label"
                    style="max-width: 98%"
                    class="flex items-center text-xs truncate"
                >
                    <span
                        class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                    >
                        {{ selectedColumn?.label }}
                    </span>
                </div>
                <div v-else-if="subIndex == 0" class="text-gray-700">
                    Select left table
                </div>
                <div v-else-if="subIndex == 1" class="text-gray-700">
                    Select right table
                </div>

                <div
                    class="mt-0.5 text-xs text-gray-500 truncate"
                    style="max-width: 90%"
                >
                    <span v-if="selectedColumn?.tableName" class="truncate">
                        {{ selectedColumn?.tableName }}
                    </span>
                    <span v-else>
                        {{ placeholder }}
                    </span>
                </div>
            </div>
        </div>

        <div class="absolute right-4 top-3.5">
            <AtlanIcon icon="ChevronDown" class="w-4 h-4" />
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
        ref,
        onMounted,
        onUnmounted,
        toRefs,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            subIndex: {
                type: Number,
                required: true,
            },
            isAreaFocused: {
                type: Boolean,
                required: true,
                default: false,
            },
            selectedColumn: {
                type: Object,
                required: true,
            },
            totalTablesCount: {
                type: Number,
                required: true,
            },
            totalColumnsCount: {
                type: Number,
                required: true,
            },
            isTableSelected: {
                type: Boolean,
                required: true,
                default: false,
            },
        },

        setup(props, { emit }) {
            const { disabled, totalColumnsCount, isTableSelected, subIndex } =
                toRefs(props)
            const { isAreaFocused, selectedColumn } = useVModels(props)
            const { getDataTypeImage } = useColumn()

            const {
                list: TableList,
                replaceBody: replaceTableBody,
                data: tablesData,
                isLoading: isTableLoading,
            } = useAssetListing('', false)
            const totalTablesCount = computed(
                () => tablesData.value?.approximateCount || 0
            )

            const placeholder = computed(() => {
                let data = !isTableSelected.value
                    ? `${totalTablesCount.value} tables available`
                    : `Select from ${totalColumnsCount.value} columns`

                return data
            })

            // const getTableInitialBody = () => {
            //     return {
            //         dsl: useBody({
            //             schemaQualifiedName:
            //                 activeInlineTab.value.playground.editor.context
            //                     .attributeValue,
            //             context:
            //                 activeInlineTab.value.playground.editor.context,

            //             searchText: queryText.value,
            //             tableQualifiedNamesContraint:
            //                 tableQualifiedNamesContraint.value,
            //         }),
            //         attributes: attributes,
            //     }
            // }

            return {
                subIndex,
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
