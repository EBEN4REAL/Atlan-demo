<template>
    <div :class="[' mx-3 mt-1 mb-4']">
        <div class="flex items-center">
            <TableSelector
                typeName="Table"
                style="width: 30%"
                v-model:modelValue="tableQualfiedName"
            />
            <ColumnSelector
                style="width: 30%"
                class="z-10"
                v-model:selectedItems="cols"
                v-model:queryText="queryText"
                :tableQualfiedName="tableQualfiedName"
                @checkboxChange="checkboxChange"
            >
                <template #chip="{ item }">
                    <div
                        class="flex items-center px-3 py-0.5 my-1 justify-center mr-2 text-xs text-gray-700 rounded-full bg-gray-light"
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
                        <span> {{ item.label }}</span>
                    </div>
                </template>
            </ColumnSelector>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import TablesTree from '~/components/insights/playground/editor/vqb/dropdowns/tables/index.vue'
    import TableSelector from '../tableSelector/index.vue'
    import ColumnSelector from '../columnSelector/index.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            TablesTree,
            TableSelector,
            ColumnSelector,
        },
        props: {
            expand: {
                type: Boolean,
                required: true,
                default: false,
            },
        },

        setup(props, { emit }) {
            const { getDataTypeImage } = useColumn()
            const tableQualfiedName = ref(undefined)
            const queryText = ref('')
            const { expand } = toRefs(props)
            const cols = ref([])

            const checkboxChange = (checkedArr: string[]) => {
                console.log(checkedArr)
            }

            return {
                getDataTypeImage,
                checkboxChange,
                queryText,
                tableQualfiedName,
                cols,
            }
        },
    })
</script>
<style lang="less" scoped>
    .border-shift-plus {
        padding: 13px;
    }
    .border-shift-minus {
        padding: 12px;
    }
    .custom-shadow {
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }
</style>
