<template>
    <div :class="[' mx-3 mt-1 mb-4']">
        <div class="flex items-stretch" style="height: 32px">
            <TableSelector typeName="Table" style="width: 30%" />
            <div style="width: 30%">
                <ColumnSelector />
            </div>
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
            const { expand } = toRefs(props)
            const cols = ref([{ type: 'string', label: 'customer_name' }])

            return {}
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
