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
        if (queryTextValues && queryTextValues.length) {
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
                /* Check for date type */
                if (v?.type === 'date') {
                    parseVariables[v.name] = `'${v.value?.format(
                        'YYYY-MM-DD'
                    )}'`
                } else {
                    parseVariables[v.name] = v.value
                }
            })
            return moustacheInterpolator(queryText, parseVariables)
        }

        return semicolonSeparateQuery(query)
    }

    // function getParsedQueryData(
    //     variables: CustomVaribaleInterface[],
    //     query: string
    // ) {
    //     if (
    //         variables.length > 0 &&
    //         query?.match(/{{\s*[\w\.]+\s*}}/g)?.length > 0
    //     ) {
    //         // const queryText = semicolonSeparateQuery(query)
    //         const parseVariables: { [key: string]: string } = {}
    //         variables.forEach((v) => {
    //             parseVariables[v.name] = v.value
    //         })
    //         return moustacheInterpolator(query, parseVariables)
    //     }

    //     return query
    // }

    function getParsedQueryCursor(
        variables: CustomVaribaleInterface[],
        query: string,
        type = 'auto',
        editorInstance: any,
        monacoInstance: any
    ) {
        // console.log('cursor')

        // console.log('cursor')
        if (type === 'auto') {
            // 1. find cursor position done
            const pos = editorInstance?.getPosition()

            console.log('position cursor: ', pos)
            console.log('position editor: ', editorInstance)

            // let parsedQuery = getParsedQueryData(variables, query)
            // parsedQuery = parsedQuery.replace(/(\r\n|\n|\r)/gm, "")
            console.log('position match query parsed: ', query)

            const queryTextValues = query?.split(';')
            console.log('position match query: ', queryTextValues)

            const queryPositions = []
            if (queryTextValues && queryTextValues.length) {
                queryTextValues.forEach((query) => {
                    let q = `${query};`
                    let match = toRaw(editorInstance)
                        ?.getModel()
                        ?.findMatches(`${q.replace(/^\s+|\s+$/g, '')}`)
                    queryPositions.push({
                        match: match,
                        token: query.replace(/^\s+|\s+$/g, ''),
                        rawQuery: query,
                    })
                })
            }

            console.log('position match: ', queryPositions)

            let semiColonMatchs = toRaw(editorInstance)
                ?.getModel()
                ?.findMatches(';')
            console.log('position match semi: ', semiColonMatchs)

            let independentQueryMatches = semiColonMatchs.map(
                (match, index) => {
                    let data = queryPositions[index].match.map((m) => {
                        if (
                            m.range.endLineNumber ===
                                match.range.endLineNumber &&
                            m.range.endColumn === match.range.endColumn
                        ) {
                            return {
                                range: m.range,
                                rawQuery: queryPositions[index].rawQuery,
                            }
                        }
                    })
                    for (var i = 0; i < data.length; i++) {
                        if (data[i] !== undefined) {
                            return data[i]
                        }
                    }
                }
            )

            console.log('position match final: ', independentQueryMatches)

            // let lineIndex = semiColonMatchs.findIndex((match)=> {
            //     if(match.range.endLineNumber>pos.lineNumber) {
            //         return match
            //     }
            //     if(match.range.endLineNumber===pos.lineNumber  && match.range.endColumn>pos.column) {
            //         return match
            //     }
            // })

            let lineIndex
            for (var i = 0; i < independentQueryMatches.length - 1; i++) {
                console.log('position match: ', independentQueryMatches[i + 1])
                if (
                    pos.lineNumber <
                    independentQueryMatches[i + 1].range.startLineNumber
                ) {
                    //different line, pick 1st query
                    lineIndex = independentQueryMatches[i]
                    console.log('position match line less: ', lineIndex)
                    break
                } else if (
                    pos.lineNumber ===
                    independentQueryMatches[i + 1].range.startLineNumber
                ) {
                    // same line, check start column of second

                    // find all lines with starting point on this line
                    var start = i + 1
                    var end = i + 1

                    while (end < independentQueryMatches.length) {
                        if (
                            pos.lineNumber ===
                            independentQueryMatches[end].range.startLineNumber
                        ) {
                            end++
                        } else {
                            end = end - 1
                            break
                        }
                    }
                    if (end === independentQueryMatches.length) {
                        end = end - 1
                    }
                    console.log('position match here: ', { start, end })
                    lineIndex = independentQueryMatches[start]
                    for (var j = start; j + 1 <= end; j++) {
                        if (
                            pos.column >
                            independentQueryMatches[j + 1].range.startColumn
                        ) {
                            lineIndex = independentQueryMatches[j + 1]
                        }
                    }
                    break
                } else if (
                    pos.lineNumber ===
                    independentQueryMatches[i + 1].range.endLineNumber
                ) {
                    console.log('position match 2nd line')
                    lineIndex = independentQueryMatches[i + 1]
                    // find all lines with starting point on this line
                    console.log('position match 2nd line: ', lineIndex)
                    var start = i + 2
                    var end = i + 2

                    while (end < independentQueryMatches.length) {
                        if (
                            pos.lineNumber ===
                            independentQueryMatches[end].range.startLineNumber
                        ) {
                            end++
                        } else {
                            end = end - 1
                            break
                        }
                    }
                    if (end === independentQueryMatches.length) {
                        end = end - 1
                    }
                    console.log('position match here: ', { start, end })

                    // lineIndex = independentQueryMatches[start]
                    for (var j = start; j <= end; j++) {
                        if (
                            pos.column >
                            independentQueryMatches[j].range.startColumn
                        ) {
                            lineIndex = independentQueryMatches[j]
                        }
                    }
                    console.log('position match 2nd line: ', lineIndex)
                    break
                } else {
                }
            }
            if (lineIndex == undefined) {
                lineIndex =
                    independentQueryMatches[independentQueryMatches.length - 1]
            }

            console.log('position match line: ', lineIndex)

            if (lineIndex) {
                let queryStartLine
                let queryEndLine
                let queryStartColumn
                let queryEndColumn

                let data = lineIndex.range
                queryStartLine = data.startLineNumber
                queryStartColumn = data.startColumn
                queryEndLine = data.endLineNumber
                queryEndColumn = data.endColumn

                // console.log('position query: ', {
                //     queryStartLine,
                //     queryEndLine,
                //     queryStartColumn,
                //     queryEndColumn
                // })

                // console.log('position query: ', queryPositions)
                // setSelection(toRaw(editorInstance), toRaw(monacoInstance), {
                //     startLineNumber: queryStartLine,
                //     startColumnNumber: queryStartColumn,
                //     endLineNumber: queryEndLine,
                //     endColumnNumber: queryEndColumn
                // })
                let monaco = toRaw(monacoInstance)
                decorations = toRaw(editorInstance).deltaDecorations(
                    decorations ?? [],
                    []
                )
                decorations = toRaw(editorInstance).deltaDecorations(
                    [],
                    [
                        {
                            range: new monaco.Range(
                                Number(queryStartLine),
                                1,
                                Number(queryEndLine),
                                1
                            ),
                            options: {
                                isWholeLine: true,
                                linesDecorationsClassName: 'myLineDecoration',
                            },
                        },
                    ]
                )
                return lineIndex
            }

            // 3. check position and find raw query
        }
        // const queryText = semicolonSeparateQuery(query)
        // const parseVariables: { [key: string]: string } = {}
        // variables.forEach((v) => {
        //     parseVariables[v.name] = v.value
        // })
        // return moustacheInterpolator(queryText, parseVariables)

        return ''
        // return semicolonSeparateQuery(query)
    }
    // const clearLineDecoration = (editorInstance: any) => {
    //     // older moustacheDecorations needed
    //     decorations = editorInstance?.deltaDecorations(decorations ?? [], [])
    // }

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
                editor?.deltaDecorations(
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
            console.log(
                'error deco: ',
                activeInlineTab.value.playground.resultsPane.result
                    .errorDecorations
            )
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
        getParsedQueryCursor,
    }
}
