import { Ref, toRaw, ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
import { format, FormatOptions } from 'sql-formatter'

export function useEditor(
    tabs?: Ref<activeInlineTabInterface[]>,
    activeInlineTab?: Ref<activeInlineTabInterface>
) {
    function setEditorPos(
        editorInstance: any,
        editorPos: Ref<{ column: number; lineNumber: number }>
    ) {
        const pos = editorInstance.getPosition()
        editorPos.value = pos
    }
    function setEditorFocusedState(
        state: boolean,
        editorFocused: Ref<boolean>
    ) {
        editorFocused.value = state
    }
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
    function removeMoustacheSpaces(text) {
        let t = text.replace('{ { ', '{{')
        t = t.replace(' } }', '}}')
        return t
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
    function formatter(text: string, options?: FormatOptions) {
        /* It formats and changes {{abc}}-> { {abc} } */
        const t = format(text, options)
        return removeMoustacheSpaces(t)
    }
    function focusEditor(editorInstance) {
        editorInstance.focus()
    }
    function setEditorTheme(
        monacoInstance,
        editorConfig: Ref<editorConfigInterface>,
        themeName: string
    ) {
        if (themeName) {
            console.log(monacoInstance.editor.setTheme, themeName)
            monacoInstance.editor.setTheme(themeName)
            editorConfig.value.theme = themeName
        }
    }
    function setTabSpaces(
        editorInstance: any,
        editorConfig: Ref<editorConfigInterface>,
        tabSpace: number
    ) {
        // console.log(editorInstance.getModel())
        editorInstance.getModel().updateOptions({ tabSize: tabSpace })
        editorConfig.value.tabSpace = tabSpace
        // monacoInstance.editor.setTheme(themeName)
        // editorConfig.value.theme = themeName
    }
    function setFontSizes(
        editorInstance: any,
        editorConfig: Ref<editorConfigInterface>,
        size: number
    ) {
        console.log(size)
        // console.log(editorInstance.getModel())
        editorInstance.updateOptions({ fontSize: size })
        editorConfig.value.fontSize = size
        // monacoInstance.editor.setTheme(themeName)
        // editorConfig.value.theme = themeName
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
    const editorConfig = ref({
        theme: 'vs',
        tabSpace: 3,
        fontSize: 12,
    })
    return {
        setFontSizes,
        setTabSpaces,
        editorConfig,
        setEditorTheme,
        setEditorFocusedState,
        setEditorPos,
        formatter,
        setSelection,
        focusEditor,
        modifyEditorContent,
        onEditorContentChange,
        getParsedQuery,
    }
}
