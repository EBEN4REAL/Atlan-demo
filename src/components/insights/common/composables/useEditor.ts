import { Ref, toRaw, ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
import { format, FormatOptions } from 'sql-formatter'
import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'

export function useEditor(
    tabs?: Ref<activeInlineTabInterface[]>,
    activeInlineTab?: Ref<activeInlineTabInterface>,
    sqlVariables?: Ref<CustomVaribaleInterface[]>
) {
    let decorations = []
    let cursorDecorations = []
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
    const { isSqlVariablesChanged, setSqlVariables } = useCustomVariable()
    function onEditorContentChange(
        event: any,
        editorText: string,
        editorInstance: any
    ) {
        if (activeInlineTab?.value && tabs?.value) {
            const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
                {},
                activeInlineTab.value
            )
            const res: CustomVaribaleInterface[] = isSqlVariablesChanged(
                editorText,
                sqlVariables,
                event,
                editorInstance
            )
            /* If there are any array changes show them here */
            setSqlVariables(sqlVariables, res)
            activeInlineTabCopy.playground.editor.variables = res
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
            onEditorContentChange(event, text, editorInstance)
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

    const changeMoustacheTemplateColor = (
        editorInstance: any,
        monacoInstance: any,
        matches: any
    ) => {
        const el = matches.map((t) => {
            const s = t[0]?.range ?? []
            const token = t.token
            return {
                range: new monacoInstance.Range(
                    s.startLineNumber,
                    s.startColumn,
                    s.endLineNumber,
                    s.startColumn + token.length
                ),
                options: { inlineClassName: 'moustacheDecoration' },
            }
        })
        console.log(el, 'el')
        // older moustacheDecorations needed
        decorations = editorInstance?.deltaDecorations(decorations, el)
    }
    const findCustomVariableMatches = (
        editorInstance: any,
        editorText: string
    ) => {
        const reg = /{{\s*[\w\.]+\s*}}/gm
        const v: string[] | null = editorText.match(reg)
        const matches = []
        if (editorInstance) {
            for (let i = 0; i < v?.length; i++) {
                const t = editorInstance.getModel().findMatches(v[i])
                matches.push({ ...t, token: v[i] })
                console.log(t, 'position', v[i])
            }
            return matches
        }
    }
    const toggleGhostCursor = (
        isVisible: boolean,
        editorInstance: any,
        monacoInstance,
        editorPos: Ref<{
            column: number
            lineNumber: number
        }>
    ) => {
        const t = {
            range: new monacoInstance.Range(
                editorPos.value.lineNumber,
                editorPos.value.column - 1,
                editorPos.value.lineNumber,
                editorPos.value.column
            ),
            options: { inlineClassName: 'ghostCursor' },
        }
        if (isVisible) {
            cursorDecorations = editorInstance?.deltaDecorations(
                cursorDecorations,
                [t]
            )
        } else {
            cursorDecorations = editorInstance?.deltaDecorations(
                cursorDecorations,
                []
            )
        }
    }
    const editorConfig = ref({
        theme: 'vs',
        tabSpace: 3,
        fontSize: 12,
    })

    return {
        toggleGhostCursor,
        findCustomVariableMatches,
        changeMoustacheTemplateColor,
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
