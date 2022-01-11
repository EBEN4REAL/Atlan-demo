<template>
    <div class="flex items-center font-normal" style="font-size: 10px">
        <div
            class="flex items-center p-1 rounded"
            style="background-color: #fffbf5"
            v-if="isPrimary"
        >
            <AtlanIcon icon="primaryKey" class="w-3 h-3 mr-0.5"></AtlanIcon>
            <span style="color: #eb9d07" class="">Pkey</span>
        </div>
        <div
            class="flex items-center p-1 ml-2 mr-1 rounded"
            style="background-color: #f9f5fe"
            v-if="isForeign"
        >
            <AtlanIcon icon="ForeignKey" class="w-3 h-3 mr-0.5"></AtlanIcon>
            <span class="" style="color: #9040f5">Fkey</span>
        </div>

        <div
            class="flex items-center p-1 ml-2 mr-1 rounded"
            style="background-color: #edfdf9"
            v-if="isPartition"
        >
            <span class="" style="color: #00a680">Partition key</span>
        </div>
        <div
            class="flex items-center p-1 ml-2 mr-1 rounded"
            style="background-color: #edfdf9"
            v-if="isDist"
        >
            <span class="" style="color: #00a680">Distribution key</span>
        </div>
        <div
            class="flex items-center p-1 ml-2 mr-1 rounded"
            style="background-color: #edfdf9"
            v-if="isClustered"
        >
            <span class="" style="color: #00a680">Clustured key</span>
        </div>
        <div
            class="flex items-center p-1 ml-2 mr-1 rounded"
            style="background-color: #edfdf9"
            v-if="isSort"
        >
            <span class="" style="color: #00a680">Sort key</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    export default defineComponent({
        name: 'ColumnKeys',
        components: {},
        props: {
            isPrimary: {
                type: Boolean,
                required: false,
                default: false,
            },
            isForeign: {
                type: Boolean,
                required: false,
                default: false,
            },
            isPartition: {
                type: Boolean,
                required: false,
                default: false,
            },
            isSort: {
                type: Boolean,
                required: false,
                default: false,
            },
            isClustered: {
                type: Boolean,
                required: false,
                default: false,
            },
            isDist: {
                type: Boolean,
                required: false,
                default: false,
            },
            topStyle: {
                type: String,
                required: false,
                default: 'top-0',
            },
        },

        setup(props, { emit }) {
            const { topStyle } = toRefs(props)
            return {
                topStyle,
            }
        },
    })
</script>
<style lang="less" scoped></style>
