<template>
    <div class="p-3 rounded" style="width: 400px; max-height: 280px">
        <div class="mb-3">
            <span class="text-sm text-gray-700">SQL Query</span>
        </div>
        <SQLSnippet :text="generateSQLQuery(activeInlineTab, limitRows)" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, ComputedRef, Ref } from 'vue'
    import SQLSnippet from '~/components/common/sql/snippet.vue'
    import { generateSQLQuery } from '~/components/insights/playground/editor/vqb/composables/generateSQLQuery'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        name: 'VQB query Preview',
        components: {
            SQLSnippet,
        },

        setup(props, { emit }) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const limitRows = inject('limitRows') as Ref<{
                checked: boolean
                rowsCount: number
            }>

            return { generateSQLQuery, activeInlineTab, limitRows }
        },
    })
</script>
<style lang="less" scoped></style>
