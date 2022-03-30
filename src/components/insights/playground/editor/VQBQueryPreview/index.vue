<template>
    <div class="rounded" style="width: 400px; max-height: 280px">
        <div
            class="flex items-center justify-between w-full p-3 border-b border-gray-300"
        >
            <span class="text-sm font-bold text-gray-700">SQL Query</span>
            <div>
                <div
                    class="flex items-center text-sm cursor-pointer text-primary"
                    @click="handleAddNewTab"
                >
                    <AtlanIcon icon="Query" class="w-4 h-4 mr-1.5 -mt-0.5" />
                    <span>Open in new tab</span>
                </div>
            </div>
        </div>
        <SQLSnippet :text="generateSQLQuery(activeInlineTab, limitRows)" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, ComputedRef, Ref, toRaw } from 'vue'
    import { format } from 'sql-formatter'
    import { useVModels } from '@vueuse/core'
    import SQLSnippet from '~/components/common/sql/snippet.vue'
    import { generateSQLQuery } from '~/components/insights/playground/editor/vqb/composables/generateSQLQuery'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useActiveTab } from '~/components/insights/common/composables/useActiveTab'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'

    export default defineComponent({
        name: 'VQB query Preview',
        components: {
            SQLSnippet,
        },
        props: {
            showQueryPreview: {
                type: Boolean,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { showQueryPreview } = useVModels(props)
            const { inlineTabAdd } = useInlineTab()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const limitRows = inject('limitRows') as Ref<{
                checked: boolean
                rowsCount: number
            }>
            const { generateNewActiveTab } = useActiveTab()

            const editorText = format(
                generateSQLQuery(activeInlineTab.value, limitRows.value),
                {
                    language: 'sql', // Defaults to "sql" (see the above list of supported dialects)
                    indent: '    ', // Defaults to two spaces
                }
            )
                .replaceAll('` ', '`') // needed for backticks, as formatter put space by default between backticks
                .replaceAll(' `', '`')
                .replaceAll('AS`', 'AS `') // previous replace removes space bw AS and backtick - undoing that change with this replace

            const handleAddNewTab = () => {
                const inlineTabData = generateNewActiveTab({
                    activeInlineTab,
                    label: `Copy ${activeInlineTab.value.label} preview`,
                    editorText,
                })
                inlineTabAdd(inlineTabData, inlineTabs, activeInlineTabKey)
                showQueryPreview.value = false
            }

            return {
                generateSQLQuery,
                activeInlineTab,
                limitRows,
                handleAddNewTab,
            }
        },
    })
</script>
<style lang="less" scoped></style>
