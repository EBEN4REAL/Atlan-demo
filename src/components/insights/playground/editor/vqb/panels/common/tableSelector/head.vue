<template>
    <div class="relative w-full px-3 py-1">
        <div
            class="flex items-center truncate parent-ellipsis-container"
            v-if="getTableNameFromTableQualifiedName(modelValue ?? '')"
        >
            <AtlanIcon
                :icon="
                    getEntityStatusIcon(
                        selectedTableData.assetType,
                        selectedTableData.certificateStatus
                    )
                "
                class="w-4 h-4 mr-2 -mt-0.5"
                style="min-width: 16px"
            />
            <span class="parent-ellipsis-container-base"
                >{{ getTableNameFromTableQualifiedName(modelValue ?? '') }}
            </span>
        </div>
        <span v-else class="text-gray-500 truncate">
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
        watch,
        Ref,
        inject,
        computed,
        defineComponent,
        PropType,
        ComputedRef,
        toRefs,
    } from 'vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            modelValue: {
                type: String,
                required: true,
            },
            selectedTableData: {
                type: Object as PropType<{
                    certificateStatus: string | undefined
                    assetType: string | undefined
                }>,
            },
        },

        setup(props, { emit }) {
            const { disabled, selectedTableData, modelValue } = toRefs(props)
            const { getTableNameFromTableQualifiedName } = useUtils()

            const { getDataTypeImage } = useColumn()
            const isAreaFocused = inject('isAreaFocused') as Ref<Boolean>
            const totalTablesCount = inject('totalTablesCount') as Ref<Number>
            const isTableLoading = inject('isTableLoading') as Ref<Boolean>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const getTableInitialBody = inject(
                'getTableInitialBody'
            ) as Function
            const replaceTableBody = inject('replaceTableBody') as Function

            const placeholder = computed(() => {
                if (isTableLoading.value) return 'Loading...'
                if (
                    activeInlineTab.value.playground.editor.context
                        .attributeName
                )
                    return `Select from ${totalTablesCount.value} tables`
                return `Select a table first`
            })

            watch(
                () => activeInlineTab.value.playground.editor.context,
                (newContext) => {
                    if (
                        !modelValue.value?.includes(newContext.attributeValue)
                    ) {
                        replaceTableBody(getTableInitialBody())
                    }
                }
            )

            return {
                selectedTableData,
                modelValue,
                getEntityStatusIcon,
                isTableLoading,
                disabled,
                placeholder,
                isAreaFocused,
                getDataTypeImage,
                getTableNameFromTableQualifiedName,
            }
        },
    })
</script>
<style lang="less" scoped></style>
