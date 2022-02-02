<template>
    <div ref="monacoRoot" class="relative monacoeditor"></div>
</template>

<script lang="ts">
    // https://github.com/vitejs/vite/discussions/1791
    // https://github.com/vitejs/vite/issues/1927#issuecomment-805803918

    import {
        defineComponent,
        ref,
        unref,
        onMounted,
        onUnmounted,
        inject,
        Ref,
        reactive,
        watch,
        PropType,
        toRefs,
        toRaw,
        computed,
        ComputedRef,
        nextTick,
    } from 'vue'

    import { languageTokens } from './sqlTokens'
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
    import fetchColumnList from '~/composables/columns/fetchColumnList'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import {
        useAutoSuggestions,
        suggestionKeywordInterface,
    } from '~/components/insights/playground/editor/common/composables/useAutoSuggestions'
    import { triggerCharacters } from '~/components/insights/playground/editor/monaco/triggerCharacters'
    import { autoclosePairsConfig } from '~/components/insights/playground/editor/monaco/autoclosePairs'
    import { loadThemes } from './themeLoader'
    import { useResultPane } from '~/components/insights/playground/resultsPane/common/composables/useResultPane'
    import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
    import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import Column from '~/assets/images/insights/autocomplete/Column.png'
    import Default from '~/assets/images/insights/autocomplete/default.png'
    import Table from '~/assets/images/insights/autocomplete/Table.png'
    import TableDeprecated from '~/assets/images/insights/autocomplete/TableDeprecated.png'
    import TableDraft from '~/assets/images/insights/autocomplete/TableDraft.png'
    import TableVerified from '~/assets/images/insights/autocomplete/TableVerified.png'
    import View from '~/assets/images/insights/autocomplete/View.png'
    import ViewDeprecated from '~/assets/images/insights/autocomplete/ViewDeprecated.png'
    import ViewDraft from '~/assets/images/insights/autocomplete/ViewDraft.png'
    import ViewVerified from '~/assets/images/insights/autocomplete/ViewVerified.png'

    // @ts-ignore
    self.MonacoEnvironment = {
        getWorker(_, label) {
            return new editorWorker()
        },
    }

    export default defineComponent({
        emits: ['editorInstance'],
        props: {},

        setup(props, { emit }) {
            const editorStates = new Map()
            const cancelTokenSource = ref()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<String>

            const toggleCMDK: Function = inject('togglecmdK')

            const editorConfig = inject(
                'editorConfig'
            ) as Ref<editorConfigInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>

            watch(
                tabs,
                () => {
                    tabs.value.forEach((tab) => {
                        editorStates.set(tab.key, {
                            model: undefined,
                            viewState: undefined,
                        })
                    })
                },
                { immediate: true }
            )

            const editorFocused = inject('editorFocused') as Ref<boolean>
            const editorContentSelectionState = inject(
                'editorContentSelectionState'
            ) as Ref<boolean>

            const toggleRun = inject('toggleRun') as Function
            const runQuery = inject('runQuery') as Function
            const saveOrUpdate = inject('saveOrUpdate') as Function
            const editorPos = inject('editorPos') as Ref<{
                column: number
                lineNumber: number
            }>
            const monacoRoot = ref<HTMLElement>()
            const disposable: Ref<monaco.IDisposable | undefined> = ref()
            const currentPosition: Ref<any> = ref({})
            let editor: monaco.editor.IStandaloneCodeEditor | undefined
            const outputPaneSize = inject('outputPaneSize') as Ref<number>

            const isQueryCreatedByCurrentUser = inject(
                'isQueryCreatedByCurrentUser'
            )
            const hasQueryReadPermission = inject('hasQueryReadPermission')
            const hasQueryWritePermission = inject('hasQueryWritePermission')

            // console.log('editor permisisons: ', {
            //     isQueryCreatedByCurrentUser,
            //     hasQueryReadPermission,
            //     hasQueryWritePermission,
            // })

            const {
                saveEditorModelURI,
                saveEditorViewState,
                clearMoustacheTemplateColor,
                setErrorDecorations,
                saveEditorState,
                resetErrorDecorations,
                toggleGhostCursor,
                onEditorContentChange,
                formatter,
                setEditorPos,
                setEditorFocusedState,
                findCustomVariableMatches,
                setMoustacheTemplateColor,
            } = useEditor(tabs, activeInlineTab)
            const { isLineError } = useResultPane(tabs)

            // save custom variable cases

            const editorInstanceRef = inject(
                'editorInstance'
            ) as Ref<monaco.editor.IStandaloneCodeEditor>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>
            // const editorInstance1 = toRaw(editorInstanceRef.value)
            // const monacoInstance1 = toRaw(monacoInstanceRef.value)

            // console.log('editor: ', {
            //     editorInstanceRef,
            //     monacoInstanceRef,
            //     editorInstance1,
            //     monacoInstance1,
            // })

            const { saveVariable, addVariableFromEditor, deleteVariable } =
                useCustomVariable(editorInstanceRef, monacoInstanceRef)

            // const activeInlineTabKey = inject(
            //     'activeInlineTabKey'
            // ) as ComputedRef<activeInlineTabInterface>

            // let sqlVariables: Ref<CustomVaribaleInterface[]> = ref([
            //     ...activeInlineTab.value.playground.editor.variables,
            // ])

            // watch(activeInlineTab, () => {
            //     console.log('active inline tab: ', activeInlineTab.value)
            //     sqlVariables.value =
            //         activeInlineTab.value.playground.editor.variables
            // })

            let timeout = null

            function createDebounce() {
                return function (fnc, delayMs) {
                    clearTimeout(timeout)
                    timeout = setTimeout(() => {
                        fnc()
                    }, delayMs || 500)
                }
            }

            const findAndChangeCustomVariablesColor = (
                onlySetColor: boolean
            ) => {
                if (activeInlineTab.value) {
                    const matches =
                        findCustomVariableMatches(
                            editor,
                            activeInlineTab.value.playground.editor.text
                        ) ?? []

                    // console.log('active inline tab: ', activeInlineTab.value)

                    if (onlySetColor) {
                        setMoustacheTemplateColor(editor, monaco, matches)
                        return
                    }
                    /* FIXME: THIS LOGIC SHOULD MOVE IN SEPRATE FXN */
                    if (matches && matches?.length >= 0) {
                        createDebounce()(() => {
                            const resultsLeft = matches.filter(
                                (match) =>
                                    !activeInlineTab.value.playground.editor.variables.some(
                                        (variable) =>
                                            match.token.slice(2, -2) ===
                                            variable.name
                                    )
                            )

                            const intersection =
                                activeInlineTab.value.playground.editor.variables.filter(
                                    (variable) =>
                                        matches.some(
                                            (match) =>
                                                variable.name ===
                                                match.token.slice(2, -2)
                                        )
                                )

                            addVariableFromEditor(
                                activeInlineTab,
                                tabs,
                                intersection,
                                resultsLeft
                            )
                        }, 500)
                        /* --------------------------------------------------- */
                        // console.log('variables: ', matches)
                        setMoustacheTemplateColor(editor, monaco, matches)
                    } else {
                        clearMoustacheTemplateColor(editor)
                    }
                }
            }

            monaco.languages.register({ id: 'atlansql' })

            monaco.languages.setMonarchTokensProvider(
                'atlansql',
                languageTokens
            )

            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                title,
                certificateStatus,
            } = useAssetInfo()

            const triggerAutoCompletion = (
                promise: Promise<{
                    suggestions: suggestionKeywordInterface[]
                    incomplete: boolean
                }>
            ) => {
                // clearing previous popover register data
                if (disposable) disposable.value?.dispose()
                disposable.value =
                    monaco.languages.registerCompletionItemProvider(
                        'atlansql',
                        {
                            triggerCharacters: triggerCharacters,
                            provideCompletionItems() {
                                // For object properties https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitem.html
                                return promise
                            },
                        }
                    )
                // editor.trigger('', 'showSuggestWidget', suggestions)

                // editor autosuggestion icons

                setTimeout(() => {
                    promise.then((item) => {
                        let items = item.suggestions

                        let data1 = document.getElementsByClassName(
                            'suggest-icon codicon codicon-symbol-field'
                        )

                        let data2 = document.getElementsByClassName(
                            'suggest-icon codicon codicon-symbol-keyword'
                        )

                        // console.log('suggestions: ', {
                        //     data1: data1,
                        //     data2: data2,
                        // })
                        for (var i = 0; i < items.length; i++) {
                            let item = items[i].documentation?.entity

                            if (
                                (item && assetType(item) === 'Table') ||
                                assetType(item) === 'View'
                            ) {
                                let component =
                                    assetType(item) === 'Table'
                                        ? getEntityStatusIcon(
                                              assetType(item),
                                              certificateStatus(item)
                                          ) === 'Table'
                                            ? Table
                                            : getEntityStatusIcon(
                                                  assetType(item),
                                                  certificateStatus(item)
                                              ) === 'TableVerified'
                                            ? TableVerified
                                            : getEntityStatusIcon(
                                                  assetType(item),
                                                  certificateStatus(item)
                                              ) === 'TableDraft'
                                            ? TableDraft
                                            : TableDeprecated
                                        : getEntityStatusIcon(
                                              assetType(item),
                                              certificateStatus(item)
                                          ) === 'View'
                                        ? View
                                        : getEntityStatusIcon(
                                              assetType(item),
                                              certificateStatus(item)
                                          ) === 'ViewVerified'
                                        ? ViewVerified
                                        : getEntityStatusIcon(
                                              assetType(item),
                                              certificateStatus(item)
                                          ) === 'ViewDraft'
                                        ? ViewDraft
                                        : ViewDeprecated

                                if (data1[i] && data1[i]?.style) {
                                    data1[
                                        i
                                    ].style.backgroundImage = `url(${component})`
                                }
                            } else if (item && assetType(item) === 'Column') {
                                if (data1[i] && data1[i]?.style) {
                                    data1[
                                        i
                                    ].style.backgroundImage = `url(${Column})`
                                }
                            } else {
                                if (data2[i] && data2[i].style) {
                                    data2[
                                        i
                                    ].style.backgroundImage = `url(${Default})`
                                }
                            }
                        }
                    })
                }, 150)
            }

            /* ---------------- Autoclosing pairs ------------------*/
            monaco.languages.setLanguageConfiguration(
                'atlansql',
                autoclosePairsConfig
            )

            function createMonacoInstance() {
                return monaco.editor.create(monacoRoot.value as HTMLElement, {
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 8,
                    lineNumbersMinChars: 2,
                    language: 'atlansql',
                    value: activeInlineTab.value.playground.editor.text,
                    theme: editorConfig.value.theme,
                    fontSize: 14,
                    cursorStyle: 'line',
                    cursorWidth: 2,
                    letterSpacing: 0.1,
                    minimap: {
                        enabled: false,
                    },
                    automaticLayout: true,
                    // scrollbar: {
                    //     horizontal: 'hidden',
                    // },

                    wordWrap: 'on',
                    quickSuggestions: {
                        other: true,
                        comments: false,
                        strings: true,
                    },
                    scrollbar: {
                        useShadows: false,
                        verticalHasArrows: true,
                        vertical: 'visible',
                        verticalScrollbarSize: 8,
                    },
                    model: null,
                })
            }

            /* ----------------------------------------------------- */

            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning
            )
            let suggestionsList = ref(null)

            onMounted(() => {
                loadThemes(monaco)
                editor = createMonacoInstance()
                const model = monaco.editor.createModel(
                    String(activeInlineTab.value.playground.editor.text),
                    'atlansql'
                )
                editor.setModel(model)
                editorStates.set(activeInlineTab.value.key, {
                    model: model,
                    viewState: {},
                })

                editor.onDidChangeCursorSelection((e) => {
                    if (
                        e.selection.startLineNumber ===
                            e.selection.endLineNumber &&
                        e.selection.startColumn === e.selection.endColumn
                    ) {
                        editorContentSelectionState.value = false
                        // console.log('selection false')
                    } else {
                        // console.log('selection true')
                        editorContentSelectionState.value = true
                    }
                })
                // monaco.editor.remeasureFonts()
                // monaco.editor.EditorLayoutInfo
                emit('editorInstance', editor, monaco)

                const lastLineLength = editor?.getModel()?.getLineMaxColumn(1)
                /* As this is mounting time you have to manually set the color for custom variables */
                const matches =
                    findCustomVariableMatches(
                        editor,
                        activeInlineTab.value.playground.editor.text
                    ) ?? []

                if (matches && matches?.length > 0)
                    setMoustacheTemplateColor(editor, monaco, matches)
                /* ----------------------------------- */
                // console.log(lastLineLength)

                const modifyLine = (lineCode) => {
                    let startCount = 0
                    let endCount = 0

                    // console.log('line code: ', lineCode)

                    while (lineCode.startsWith('\n')) {
                        lineCode = lineCode.slice(1)
                        startCount++
                    }
                    while (lineCode.endsWith('\n')) {
                        lineCode = lineCode.slice(0, lineCode.length - 1)
                        endCount++
                    }

                    let testVal = /--+.*/

                    if (testVal.test(lineCode)) {
                        lineCode = lineCode.slice(2)
                    } else {
                        lineCode = `--${lineCode}`
                    }

                    // console.log('line code update: ', lineCode)

                    for (var i = 0; i < startCount; i++) {
                        lineCode = '\n' + lineCode
                    }

                    for (var i = 0; i < endCount; i++) {
                        lineCode = lineCode + '\n'
                    }
                    return lineCode
                }

                const singleLineComment = () => {
                    let lineCode = editor
                        .getModel()
                        .getLineContent(editor.getPosition().lineNumber)

                    let copyLineCode = lineCode
                    lineCode = modifyLine(lineCode)

                    var line = editor.getPosition()
                    var op = {
                        range: {
                            startLineNumber: line?.lineNumber,
                            endLineNumber: line?.lineNumber,
                            startColumn: 1,
                            endColumn: copyLineCode.length + 1,
                        },
                        text: lineCode,
                        forceMoveMarkers: true,
                    }
                    editor.executeEdits('my-source', [op])
                }

                const multiLineComment = () => {
                    let selection = toRaw(editor)?.getSelection()

                    // let selectedText = toRaw(editor)
                    //     ?.getModel()
                    //     ?.getValueInRange(selection)

                    // selectedText = modifyLine(selectedText)

                    let lineCount = 0
                    for (
                        var i = selection?.startLineNumber;
                        i <= selection?.endLineNumber;
                        i++
                    ) {
                        let testVal = /--+.*/

                        let selectedText = toRaw(editor)
                            ?.getModel()
                            ?.getLineContent(i)

                        if (testVal.test(selectedText)) {
                            lineCount++
                        }
                    }

                    let check =
                        lineCount ===
                        selection?.endLineNumber -
                            selection?.startLineNumber +
                            1

                    for (
                        var i = selection?.startLineNumber;
                        i <= selection?.endLineNumber;
                        i++
                    ) {
                        let selectedText = toRaw(editor)
                            ?.getModel()
                            ?.getLineContent(i)

                        let copyLineCode = selectedText
                        let testVal = /--+.*/

                        if (testVal.test(selectedText) && check) {
                            selectedText = selectedText.slice(2)
                        } else {
                            selectedText = `--${selectedText}`
                        }
                        var op = {
                            range: {
                                startLineNumber: i,
                                endLineNumber: i,
                                startColumn: 1,
                                endColumn: copyLineCode?.length + 1,
                            },
                            text: selectedText,
                            forceMoveMarkers: true,
                        }
                        editor.executeEdits('my-source', [op])
                    }
                }

                const commentCode = () => {
                    let selection = toRaw(editor)?.getSelection()

                    if (
                        selection?.startLineNumber ===
                            selection?.endLineNumber &&
                        selection?.startColumn === selection?.endColumn
                    ) {
                        singleLineComment()
                    } else {
                        multiLineComment()
                    }
                }

                // emit('editorInstance', editor)
                /* IMP for cmd+enter/ ctrl+enter to run query when editor is focused */
                editor?.addCommand(
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                    function () {
                        if (
                            isQueryRunning.value == '' ||
                            isQueryRunning.value == 'success' ||
                            isQueryRunning.value == 'error'
                        ) {
                            // toggleRun()
                            runQuery()
                        }
                    }
                )

                editor?.addCommand(monaco.KeyMod.CtrlCmd | 85, function () {
                    commentCode()
                })

                editor?.addCommand(
                    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | 46,
                    function () {
                        editor?.trigger(
                            'editor',
                            'editor.action.quickCommand',
                            undefined
                        )
                    }
                )

                editor?.addCommand(monaco.KeyMod.CtrlCmd | 49, function () {
                    saveOrUpdate()
                })

                editor?.addCommand(monaco.KeyMod.CtrlCmd | 41, function () {
                    // console.log('cmd+k: ', 'presses')
                    toggleCMDK()
                })

                /* -------------------------------------------- */
                editor?.getModel().onDidChangeContent((event) => {
                    if (isLineError(activeInlineTab)) {
                        resetErrorDecorations(activeInlineTab, editor)
                    }
                    const text = editor?.getValue()
                    onEditorContentChange(event, text, editor)
                    /* ------------- custom variable color change */
                    findAndChangeCustomVariablesColor(false)
                    /* ------------------------------------------ */
                    const changes = event?.changes[0]
                    // const lastTypedCharacter = event?.changes[0]?.text
                    // console.log(changes, 'changes')
                    /* Preventing network request when pasting name of table */
                    const suggestions = useAutoSuggestions(
                        changes,
                        editor,
                        activeInlineTab,
                        cancelTokenSource
                    ) as Promise<{
                        suggestions: suggestionKeywordInterface[]
                        incomplete: boolean
                    }>
                    suggestionsList.value = suggestions
                    triggerAutoCompletion(suggestions)
                })
                // editor?.onDidChangeCursorPosition(() => {
                //     // setEditorPos(editor, editorPos)
                //     // setEditorFocusedState(true, editorFocused)
                // })
                // editor?.onDidBlurEditorWidget(() => {
                //     // setEditorFocusedState(false, editorFocused)
                //     toggleGhostCursor(true, editor, monaco, editorPos)
                // })
                // editor?.onDidFocusEditorWidget(() => {
                //     toggleGhostCursor(false, editor, monaco, editorPos)
                // })
                // setEditorFocusedState(true, editorFocused)
                // editor?.focus()
                // on mounting
            })

            monaco.languages.registerDocumentRangeFormattingEditProvider(
                'atlansql',
                {
                    provideDocumentRangeFormattingEdits(model) {
                        let formatted = formatter(model.getValue(), {
                            language: 'mysql',
                            linesBetweenQueries: 2,
                        })
                        return [
                            {
                                range: model.getFullModelRange(),
                                text: formatted,
                            },
                        ]
                    },
                }
            )

            onUnmounted(() => {
                editor?.dispose()
            })

            /*Watcher for changing the content of the editor on activeInlineTab Change*/

            // watch(
            //     hasQueryWritePermission,
            //     () => {
            //         console.log(
            //             'hasQueryWritePermission: ',
            //             hasQueryWritePermission
            //         )
            //         editor?.updateOptions({
            //             readOnly: hasQueryWritePermission ? false : true,
            //         })
            //     }
            //     // { immediate: true }
            // )

            // let s1 = computed(() =>
            //     document.getElementsByClassName(
            //         'suggest-icon codicon codicon-symbol-field'
            //     )
            // )
            // let s2 = computed(() =>
            //     document.getElementsByClassName(
            //         'suggest-icon codicon codicon-symbol-field'
            //     )
            // )

            // watch(
            //     [s1, s2],
            //     () => {
            //         console.log('reset auto')
            //         if (suggestionsList.value) {
            //             triggerAutoCompletion(suggestionsList.value)
            //         }
            //     },
            //     { immediate: true }
            // )
            monaco.editor.onWillDisposeModel((model) => {
                console.log(
                    model.getValue(),
                    'getValue',
                    activeInlineTab.value.label
                )
            })

            watch(activeInlineTabKey, (newKey, prevKey) => {
                editor?.focus()
                // saveEditorState(prevViewState, prevModel, _index, tabs)

                // old
                const _index = tabs.value.findIndex(
                    (tab) => tab.key === prevKey
                )

                const prevViewState = editor?.saveViewState()
                editorStates.set(tabs.value[_index].key, {
                    model: editorStates.get(tabs.value[_index].key).model,
                    viewState: prevViewState,
                })

                //new
                const index = tabs.value.findIndex((tab) => tab.key === newKey)
                // debugger
                if (!editorStates.get(tabs.value[index].key)?.model) {
                    const newModel = monaco.editor.createModel(
                        String(toRaw(tabs.value)[index].playground.editor.text),
                        'atlansql'
                    )
                    // saveEditorModelURI(newModel.uri, index, tabs)
                    editorStates.set(tabs.value[index].key, {
                        model: newModel,
                        viewState: {},
                    })
                    editor?.setModel(null)
                    editor?.setModel(newModel)
                } else {
                    editor?.setModel(
                        editorStates.get(tabs.value[index].key).model
                    )

                    // debugger
                    const newViewState = editorStates.get(
                        tabs.value[index].key
                    ).viewState
                    editor?.restoreViewState(newViewState)
                }
            })

            const _index = computed(() =>
                tabs.value.findIndex(
                    (tab) => tab.key === activeInlineTabKey.value
                )
            )

            watch(
                () => tabs.value[_index.value].playground.editor,
                () => {
                    if (activeInlineTab.value) {
                        // if (
                        //     Object.keys(
                        //         activeInlineTab.value.playground.editor.editorState
                        //             .model
                        //     )?.length == 0
                        // ) {
                        // const model = monaco.editor.createModel(
                        //     String(
                        //         activeInlineTab.value.playground.editor.text
                        //     ),
                        //     'atlansql'
                        // )
                        // editor?.setModel(model)
                        // } else {
                        // if (editor) {
                        //     editor.setModel(
                        //         activeInlineTab.value.playground.editor.editorState
                        //             .model as any
                        //     )
                        //     editor.restoreViewState(
                        //         activeInlineTab.value.playground.editor.editorState
                        //             .viewState as any
                        //     )
                        // }
                        // }

                        /* ------------- custom variable color change */
                        findAndChangeCustomVariablesColor(true)
                        /* ------------------------------------------ */
                        /* ------------- set error decorations */
                        if (isLineError(activeInlineTab)) {
                            setErrorDecorations(activeInlineTab, editor, monaco)
                        }
                        // console.log('editor active inline tab change')
                        /* ------------------------------------------ */
                        editor
                            ?.getModel()
                            ?.onDidChangeContent(async (event) => {
                                // console.log('editor content change')
                                if (isLineError(activeInlineTab)) {
                                    resetErrorDecorations(
                                        activeInlineTab,
                                        editor
                                    )
                                }
                                // setErrorDecorations(activeInlineTab, editor)
                                const text = editor?.getValue()
                                onEditorContentChange(event, text, editor)
                                const changes = event?.changes[0]
                                /* ------------- custom variable color change */
                                findAndChangeCustomVariablesColor(false)
                                /* ------------------------------------------ */
                                const suggestions = useAutoSuggestions(
                                    changes,
                                    editor,
                                    activeInlineTab,
                                    cancelTokenSource
                                ) as Promise<{
                                    suggestions: suggestionKeywordInterface[]
                                    incomplete: boolean
                                }>
                                suggestionsList.value = suggestions
                                triggerAutoCompletion(suggestions)
                            })
                        // const range = editor?.getModel().getFullModelRange()
                        // const position = {
                        //     column: range?.endColumn,
                        //     lineNumber: range?.endLineNumber,
                        // }
                        // if (position?.column && position?.lineNumber)
                        //     editor?.setPosition(position)
                        // editor?.onDidChangeCursorPosition(() => {
                        //     setEditorPos(editor, editorPos)
                        // })
                        // editor?.onDidChangeCursorPosition(() => {
                        //     setEditorPos(editor, editorPos)
                        //     setEditorFocusedState(true, editorFocused)
                        // })
                        // editor?.focus()
                        // editor?.onDidBlurEditorWidget(() => {
                        //     setEditorFocusedState(false, editorFocused)
                        //     toggleGhostCursor(true, editor, monaco, editorPos)
                        // })
                        // editor?.onDidFocusEditorWidget(() => {
                        //     toggleGhostCursor(false, editor, monaco, editorPos)
                        // })
                        // emit('editorInstance', editor, monaco)
                    }
                }
            )
            watch(outputPaneSize, () => {
                if (monacoRoot.value) {
                    monacoRoot.value.style.height = `${
                        100 - outputPaneSize.value
                    }%`
                }
            })

            return {
                editorStates,
                outputPaneSize,
                monacoRoot,
            }
        },
    })
    // document.fonts.ready.then(function (fontFaceSetEvent) {
    //     alert('All fonts in use by visible text have loaded.')
    //     console.log('Hack loaded? ' + Object.keys(fontFaceSetEvent)) // true
    // })

    // document.fonts.onloadingdone = function (fontFaceSetEvent) {
    //     alert(
    //         'onloadingdone we have ' +
    //             fontFaceSetEvent.fontfaces.length +
    //             ' font faces loaded'
    //     )
    // }
</script>

<style lang="less" scoped>
    .monacoeditor {
        min-height: 90%;
    }
    .editor_wrapper {
        overflow: hidden;
        // overflow: scroll;
    }
    .c {
        font-family: 'Courier New', Courier, monospace;
    }

    // @font-face {
    //     font-family: 'Hack';
    //     src: url('~/assets/fonts/hack/Hack-BoldItalic.ttf');
    //     font-weight: bold;
    //     font-style: italic;
    // }
    // @font-face {
    //     font-family: 'Hack';
    //     src: url('~/assets/fonts/hack/Hack-Italic.ttf');
    //     font-style: italic;
    //     font-weight: normal;
    // }
    // @font-face {
    //     font-family: 'Hack';
    //     src: url('~/assets/fonts/hack/Hack-Bold.ttf');
    //     font-weight: bold;
    //     font-style: normal;
    // }
    // @font-face {
    //     font-family: 'Hack';
    //     src: url('~/assets/fonts/hack/Hack-Regular.ttf');
    //     font-style: normal;
    //     font-weight: normal;
    // }
    // html,
    // body {
    //     font-family: 'Hack', sans-serif;
    // }
</style>
<style lang="less">
    .moustacheDecoration {
        // @apply font-semibold;
        color: #d77252 !important;
        background-color: #faf1ef !important;
    }
    .myLineDecoration {
        @apply bg-primary;
        // background: bg-primary;
        width: 2px !important;
        margin-left: 0px;
    }
    .ghostCursor {
        position: relative;
    }

    .ghostCursor::after {
        position: absolute;
        content: '';
        width: 2px !important;
        @apply bg-gray-400;
        top: -10%;
        height: 120%;
    }
</style>

<style lang="less" module>
    // .monaco-global {
    :global(.line-numbers) {
        margin-left: 5px !important;
        margin-right: 10px !important;
    }
    :global(.monaco-scrollable-element.editor-scrollable) {
        left: 63px !important;
        width: calc(100% - 63px) !important;
    }
    :global(.margin) {
        width: 63px !important;
    }
    :global(.line-numbers) {
        width: 47px !important;
        // padding-left: 8px !important;
        padding-right: 12px !important;
        // margin-left: 16px !important;
        text-align: right !important;
    }
    :global(.monaco-editor) {
        padding-top: 8px !important;
    }

    :global(.inputarea.monaco-mouse-cursor-text) {
        background-color: transparent !important;
        &::selection {
            background: transparent !important;
        }
    }
    :global(.cldr.codicon.codicon-folding-expanded) {
        left: 35px !important;
    }
    :global(.cldr.codicon.codicon-folding-collapsed) {
        left: 35px !important;
    }

    :global(.editor-widget.suggest-widget.visible) {
        // top: 28px;
        // left: 207px;
        margin-top: 12px !important;
        margin-left: 10px !important;
        border-radius: 4px;
        background-color: #ffffff;
        @apply text-gray-700 !important;

        box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12) !important;
        border: none;
        // padding-left: 4px !important;
        // padding-right: 4px !important;
    }
    :global(.suggest-icon.codicon.codicon-symbol-field) {
        // background-image: url('~/assets/images/source/python.png') !important;
        width: 15px !important;
        height: 15px !important;
        background-size: 15px 15px;
        margin-top: 3px !important;
    }
    :global(.suggest-icon.codicon.codicon-symbol-keyword) {
        width: 15px !important;
        height: 15px !important;
        background-size: 15px 15px;
        margin-top: 3px !important;
    }
    :global(.suggest-icon.codicon.codicon-symbol-keyword)::before {
        visibility: hidden !important;
    }
    :global(.suggest-icon.codicon.codicon-symbol-field)::before {
        visibility: hidden !important;
    }
    :global(.suggest-icon.codicon.codicon-symbol-text)::before {
        visibility: hidden !important;
    }
    :global(.suggest-icon.codicon.codicon-symbol-text) {
        background-image: url('~/assets/images/insights/autocomplete/default.png') !important;
        width: 15px !important;
        height: 15px !important;
        background-size: 15px 15px;
        margin-top: 3px !important;
    }

    :global(.monaco-list-row.show-file-icons.string-label.focused) {
        @apply bg-gray-light !important;
        @apply text-gray-700 !important;
        border-radius: 3px !important;
    }
    :global(.main) {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }
    :global(.monaco-editor
            .suggest-widget
            .monaco-list
            .monaco-list-row.focused
            .monaco-highlighted-label
            .highlight) {
        @apply text-primary !important;
    }
    :global(.monaco-editor
            .suggest-widget
            .monaco-list
            .monaco-list-row
            .monaco-highlighted-label
            .highlight) {
        @apply text-primary !important;
    }
    :global(.monaco-list-row.show-file-icons.string-label) {
        @apply text-xs !important;
    }
    :global(.monaco-list-row .show-file-icons .string-label .focused) {
        @apply text-xs !important;
    }
    :global(.monaco-editor .suggest-details) {
        margin-top: 0px !important;
        margin-left: 10px !important;
        margin-right: 10px !important;
        border-radius: 4px;
        background-color: #ffffff;
        @apply text-gray-700 !important;

        box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12) !important;
        border: none;
    }
    :global(.monaco-scrollable-element .mac) {
        border-radius: 4px !important;
    }
    :global(.action-item) {
        height: 32px !important;
        display: flex;
        justify-content: center;
    }
    :global(.quick-input-widget.show-file-icons) {
        margin-top: 50px !important;
        border-radius: 4px !important;
        width: 500px !important;
        // background: white !important;
    }

    :global(.monaco-list.mouse-support .monaco-list-row) {
        background: #fff !important;
    }
    :global(.monaco-list.list_id_2 .monaco-list-row.focused) {
        background: #5277d7 !important;
        color: #ffffff !important;
    }
    :global(.monaco-progress-container) {
        background: #fff !important;
    }
</style>
