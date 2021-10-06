import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'

export function useEditor(
    tabs?: Ref<activeInlineTabInterface[]>,
    activeInlineTab?: Ref<activeInlineTabInterface>
) {
    const { modifyActiveInlineTabEditor } = useInlineTab()
    function onEditorContentChange(event: any, editorText: string) {
        if (activeInlineTab && tabs?.value) {
            const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
                {},
                activeInlineTab.value
            )
            activeInlineTabCopy.playground.editor.text = editorText
            modifyActiveInlineTabEditor(activeInlineTabCopy, tabs)
        }
    }

    function modifyEditorContent(
        editorInstance: any,
        monacoInstance: any,
        content: string
    ) {
        const model = monacoInstance?.editor?.createModel(content, 'atlansql')
        editorInstance?.setModel(null)
        editorInstance?.setModel(model)
        editorInstance?.getModel().onDidChangeContent((event) => {
            const text = editorInstance.getValue()
            onEditorContentChange(event, text)
        })
    }
    function moustacheInterpolator(query, variables) {
        query.match(/{{\s*[\w\.]+\s*}}/g).map((x) => {
            query = query.replace(x, (a) => {
                const temp = a.match(/[\w\.]+/)[0]
                return variables[temp]
            })
        })
        if (/{{\s*[\w\.]+\s*}}/g.test(query)) {
            return moustacheInterpolator(query, variables)
        }
        return query
    }
    function semicolonSeparateQuery(query: string) {
        // check if it have semicolon
        const queryTextValues = query.split(';')
        // always select the first one for now
        let queryText = queryTextValues[0]
        return queryText
    }
    function getParsedQuery(
        variables: CustomVaribaleInterface[],
        query: string
    ) {
        if (
            variables.length > 0 &&
            query?.match(/{{\s*[\w\.]+\s*}}/g)?.length > 0
        ) {
            const queryText = semicolonSeparateQuery(query)
            const parseVariables: { [key: string]: string } = {}
            variables.forEach((v) => {
                parseVariables[v.name] = v.value
            })
            return moustacheInterpolator(queryText, parseVariables)
        }

        return semicolonSeparateQuery(query)
    }
    function focusEditor(editorInstance) {
        editorInstance.focus()
    }
    function setSelection(
        editorInstance,
        monacoInstance,
        selectionObject: {
            startLineNumber: number
            startColumnNumber: number
            endLineNumber: number
            endColumnNumber: number
        }
    ) {
        const {
            startLineNumber,
            startColumnNumber,
            endLineNumber,
            endColumnNumber,
        } = selectionObject
        editorInstance.setSelection(
            new monacoInstance.Selection(
                startLineNumber,
                startColumnNumber,
                endLineNumber,
                endColumnNumber
            )
        )
    }

    return {
        setSelection,
        focusEditor,
        modifyEditorContent,
        onEditorContentChange,
        getParsedQuery,
    }
}
