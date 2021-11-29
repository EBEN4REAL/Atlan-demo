import { Ref, toRaw, ref, watch } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
import { format, FormatOptions } from 'sql-formatter'
import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'

export function useEditor(
    tabs?: Ref<activeInlineTabInterface[]>,
    activeInlineTab?: Ref<activeInlineTabInterface>
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
            // const res: CustomVaribaleInterface[] = isSqlVariablesChanged(
            //     editorText,
            //     sqlVariables,
            //     event,
            //     editorInstance
            // )
            // /* If there are any array changes show them here */
            // setSqlVariables(sqlVariables, res)
            // activeInlineTabCopy.playground.editor.variables = res
            // console.log('editor content update')
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
        let q: string = query.slice()
        q.replaceAll(/[ ,;)(]+/gm, ' ')
        const matches = q.match(/{{\s*[\w\.]+\s*}}/gm) ?? []
        matches.map((x) => {
            q = q.replace(x, (a) => {
                const temp = a.match(/[\w\.]+/)[0]
                return variables[temp]
            })
        })
        if (/{{\s*[\w\.]+\s*}}/gm.test(q)) {
            return moustacheInterpolator(q, variables)
        }
        return q
    }
    function removeMoustacheSpaces(text) {
        let t = text.replaceAll('{ { ', '{{')
        t = t.replaceAll(' } }', '}}')
        return t
    }
    function semicolonSeparateQuery(query: string) {
        // check if it have semicolon
        const queryTextValues = query?.split(';')
        // always select the first one for now
        let queryText = ''
        if(queryTextValues && queryTextValues.length) {
            queryText = queryTextValues[0]
        }
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

    function getParsedQueryCursor(
        variables: CustomVaribaleInterface[],
        query: string,
        type = 'auto',
        editorInstance: any,
        monacoInstance: any
    ) {
        // console.log('cursor')
        
            // console.log('cursor')
            if(type==='auto') {
                // 1. find cursor position done
                const pos = editorInstance.getPosition()
                console.log('position: ', pos)
                console.log('position editor: ', editorInstance)

                const queryTextValues = query?.split(';')

                // 2. find seperate query with position
                const queryPositions = []
                if(queryTextValues && queryTextValues.length) {
                    queryTextValues.forEach(query=> {
                        let match = toRaw(editorInstance).getModel().findMatches(query);
                        queryPositions.push({ match: match, token: query })
                    })
                }
                
                console.log('position match: ', queryPositions) 

                let semiColonMatchs = toRaw(editorInstance).getModel().findMatches(';');
                console.log('position semi: ', semiColonMatchs)

                let lineIndex = semiColonMatchs.findIndex((match)=> {
                    if(match.range.endLineNumber>pos.lineNumber) {
                        return match   
                    }
                    if(match.range.endLineNumber===pos.lineNumber  && match.range.endColumn>pos.column) {
                        return match
                    }
                })
                console.log('position line: ', lineIndex)


                if(lineIndex!==-1) {
                    let queryStartLine
                    let queryEndLine
                    let queryStartColumn
                    let queryEndColumn

                    if(lineIndex==0) {
                        let data = semiColonMatchs[0].range
                        queryStartLine=1;
                        queryStartColumn=1;
                        queryEndLine = data.startLineNumber
                        queryEndColumn = data.startColumn

                    } else {
                        let data1 = semiColonMatchs[lineIndex-1].range
                        let data2 = semiColonMatchs[lineIndex].range

                        queryStartLine=data1.endLineNumber;
                        queryStartColumn=data1.endColumn;
                        queryEndLine = data2.startLineNumber
                        queryEndColumn = data2.startColumn
                    }

                    console.log('position query: ', {
                        queryStartLine,
                        queryEndLine,
                        queryStartColumn,
                        queryEndColumn
                    })
                    setSelection(toRaw(editorInstance), toRaw(monacoInstance), {
                        startLineNumber: queryStartLine,
                        startColumnNumber: queryStartColumn,
                        endLineNumber: queryEndLine,
                        endColumnNumber: queryEndColumn
                    })
                    
                }


               
                // 3. check position and find raw query

            }
            // const queryText = semicolonSeparateQuery(query)
            // const parseVariables: { [key: string]: string } = {}
            // variables.forEach((v) => {
            //     parseVariables[v.name] = v.value
            // })
            // return moustacheInterpolator(queryText, parseVariables)
        

        // return semicolonSeparateQuery(query)
    }

    function formatter(text: string, options?: FormatOptions) {
        /* It formats and changes {{abc}}-> { {abc} } */
        const t = format(text, options)
        return removeMoustacheSpaces(t)
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

    const setMoustacheTemplateColor = (
        editorInstance: any,
        monacoInstance: any,
        matches: any
    ) => {
        let el = []
        matches.forEach((t) => {
            const token = t.token
            t.matches.forEach((d) => {
                const s = d?.range
                const obj = {
                    range: new monacoInstance.Range(
                        s.startLineNumber,
                        s.startColumn,
                        s.endLineNumber,
                        s.startColumn + token.length
                    ),
                    options: { inlineClassName: 'moustacheDecoration' },
                }
                el.push(obj)
            })
        })
        // older moustacheDecorations needed
        decorations = editorInstance?.deltaDecorations(decorations, el)
    }
    const clearMoustacheTemplateColor = (editorInstance: any) => {
        // older moustacheDecorations needed
        decorations = editorInstance?.deltaDecorations(decorations ?? [], [])
    }
    const findCustomVariableMatches = (
        editorInstance: any,
        editorText: string
    ) => {
        const reg = /{{\s*[\w\.]+\s*}}/gm
        const v: string[] | null = editorText?.match(reg)
        console.log('match: ', v)
        const matches = []
        if (editorInstance) {
            for (let i = 0; i < v?.length; i++) {
                const t = editorInstance.getModel().findMatches(v[i])
                matches.push({ matches: t, token: v[i] })
            }
            // console.log('matches: ', matches)
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
    const resetErrorDecorations = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        editor: any
    ) => {
        if (activeInlineTab.value) {
            activeInlineTab.value.playground.resultsPane.result.errorDecorations =
                editor.deltaDecorations(
                    activeInlineTab.value.playground.resultsPane.result
                        .errorDecorations,
                    []
                )
        }
    }

    const setErrorDecorations = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        editor: any,
        monaco: any
    ) => {
        if (
            activeInlineTab.value &&
            activeInlineTab.value.playground.resultsPane.result.errorDecorations
                ?.length > 0
        ) {
            const lineRegex = /(?:line )([0-9]+)/gim
            /* [["Line 3", "3"], ["line 3", "3"]] */
            const linesInfo = [
                ...activeInlineTab.value.playground.resultsPane.result.queryErrorObj.errorMessage?.matchAll(
                    lineRegex
                ),
            ]
            let startLine
            if (
                linesInfo?.length &&
                linesInfo[0]?.length > 1 &&
                activeInlineTab.value.playground.resultsPane.result
                    .errorDecorations?.length > 0
            ) {
                startLine = linesInfo[0][1]
                activeInlineTab.value.playground.resultsPane.result.errorDecorations =
                    editor.deltaDecorations(
                        activeInlineTab.value.playground.resultsPane.result
                            .errorDecorations,
                        [
                            {
                                range: new monaco.Range(
                                    Number(startLine),
                                    1,
                                    Number(startLine),
                                    1
                                ),
                                options: {
                                    linesDecorationsClassName:
                                        'edtiorErrorDotDecoration',
                                },
                            },
                        ]
                    )
            }
        }
    }

    // const editor_preference_keys = {
    //     theme: 'theme',
    //     tabSpace: 'tabSpace',
    //     fontSize: 'fontSize',
    // }

    return {
        clearMoustacheTemplateColor,
        setErrorDecorations,
        resetErrorDecorations,
        toggleGhostCursor,
        findCustomVariableMatches,
        setMoustacheTemplateColor,
        setEditorFocusedState,
        setEditorPos,
        formatter,
        setSelection,
        focusEditor,
        modifyEditorContent,
        onEditorContentChange,
        getParsedQuery,
        getParsedQueryCursor
    }
}
