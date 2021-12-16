<template>
    <a-tooltip placement="bottomLeft">
        <span
            v-if="
                ['table', 'tablepartition'].includes(
                    item.typeName?.toLowerCase()
                )
            "
            class="text-gray-500 mr-2"
            ><span class="font-semibold tracking-tight text-gray-500 "
                >{{ rowCount(item, false) }}
            </span>
             Rows</span
        >
        <template #title>
            <span v-if="sizeBytes(item, false)" class="font-semibold"
                >{{ rowCount(item, true) }} rows ({{
                    sizeBytes(item, false)
                }})</span
            >
        </template>
    </a-tooltip>
    <span class="text-gray-500">
        <span class="font-semibold tracking-tight text-gray-500">{{
            columnCount(item, false)
        }}</span>
         Cols</span
    >
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'AssetListItem',
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['closeModal'],
        setup() {
            const { rowCount, columnCount } = useAssetInfo()

            return {
                rowCount,
                columnCount,
            }
        },
    })
</script>
