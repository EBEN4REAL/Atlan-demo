<template>
    <div class="relative w-full px-3 py-1">
        <div class="flex items-center w-full" v-if="selectedColumn?.label">
            <component
                :is="getDataTypeImage(selectedColumn?.type)"
                class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
            ></component>
            <span class="mb-0 ml-1 text-sm text-gray-700 truncate">
                {{ selectedColumn?.label }}
            </span>
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
        onUnmounted,
        toRefs,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { selectedTables } from '~/types/insights/VQB.interface'

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
                            data = `${totalTablesCount.value} tables available`
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
