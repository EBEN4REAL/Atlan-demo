import { ref, toRaw, Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
import { useEditor } from '~/components/insights/common/composables/useEditor'
import { useActiveTab } from '~/components/insights/common/composables/useActiveTab'
import { useRunQueryUtils } from '~/components/insights/common/composables/useRunQueryUtils'

export default function useOpenQuery({
    tabs,
    activeInlineTabKey,
    activeInlineTab,
    item,
    editorInstance,
    monacoInstance,
    limitRows,
}) {
    const { modifyActiveInlineTab, inlineTabAdd, modifyActiveInlineTabEditor } =
        useInlineTab()

    const { queryRun } = useRunQuery()
    const { focusEditor, setSelection } = useEditor()

    let query = item?.value?._source?.message?.userSqlQuery
    let metadata = item?.value?._source?.message?.queryMetadata
        ? item?.value?._source?.message?.queryMetadata[0]
        : {}

    // let { table, schema, catalog } = metadata
    let table = metadata?.table
    let schema = metadata?.schema
    let catalog = metadata?.catalog
    let connectionQualifiedName =
        item?.value?._source?.message?.connectionQualifiedName

    let limit = item?.value?._source?.message?.numberOfRows

    const handleAddNewTab = async (
        query,
        context,
        explorerContext,
        previewItem
    ) => {
        const { generateNewActiveTab } = useActiveTab()

        const inlineTabData = generateNewActiveTab({
            activeInlineTab,
            label: `${previewItem.title} preview`,
            editorText: query,
            context,
            schemaConnectors: explorerContext,
            queryConnectors: {
                connector: previewItem.connectionQualifiedName,
            },
        })

        inlineTabAdd(inlineTabData, tabs, activeInlineTabKey)
    }

    const selectionObject: Ref<any> = ref({
        startLineNumber: 1,
        startColumnNumber: 1,
        endLineNumber: 1,
        endColumnNumber: 1,
    })

    const getData = (activeInlineTab, dataList, columnList) => {
        if (activeInlineTab && tabs?.value) {
            const activeInlineTabCopy: activeInlineTabInterface = JSON.parse(
                JSON.stringify(toRaw(activeInlineTab.value))
            )
            activeInlineTabCopy.playground.editor.dataList = dataList

            activeInlineTabCopy.playground.editor.columnList = columnList
            const saveQueryDataInLocalStorage = false
            modifyActiveInlineTabEditor(
                activeInlineTabCopy,
                tabs,
                false,
                saveQueryDataInLocalStorage
            )
            setSelection(
                toRaw(editorInstance.value),
                toRaw(monacoInstance.value),
                selectionObject.value
            )
            focusEditor(toRaw(editorInstance.value))
        }
    }

    const previewQuery = (runQuery = false) => {
        console.log('preview query: ', {
            item,
            connectionQualifiedName,
            schema,
            catalog,
        })

        let newQuery = query

        let queryConnectionQualifiedName = connectionQualifiedName
        let queryDatabaseQualifiedName = connectionQualifiedName + '/' + catalog
        let querySchemaQualifiedName = queryDatabaseQualifiedName + '/' + schema

        handleAddNewTab(
            newQuery,
            {
                attributeName: 'schemaQualifiedName',
                attributeValue: querySchemaQualifiedName,
            },
            {
                attributeName: 'schemaQualifiedName',
                attributeValue: querySchemaQualifiedName,
            },
            {
                title: 'title',
                connectionQualifiedName: connectionQualifiedName,
            }
        )

        if (runQuery) {
            let activeInlineTabCopy: activeInlineTabInterface = Object.assign(
                {},
                activeInlineTab.value
            )
            playQuery(newQuery, newQuery, activeInlineTabCopy)
        }
    }

    const { onRunCompletion, onQueryIdGeneration } = useRunQueryUtils(
        editorInstance,
        monacoInstance
    )

    const playQuery = (newQuery, newText, activeInlineTabCopy) => {
        activeInlineTabCopy.playground.editor.text = newText
        modifyActiveInlineTab(
            activeInlineTabCopy,
            tabs,
            activeInlineTabCopy.isSaved
        )

        const activeInlineTabKeyCopy = activeInlineTabKey.value

        const tabIndex = tabs.value.findIndex(
            (tab) => tab.key === activeInlineTabKeyCopy
        )

        queryRun(
            tabIndex,
            getData,
            limit,
            onRunCompletion,
            onQueryIdGeneration,
            newText,
            editorInstance,
            monacoInstance,
            ref(false), // open in vqb
            tabs
        )
    }

    return {
        previewQuery,
    }
}
