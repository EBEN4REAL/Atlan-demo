<template>
    <div ref="monacoRoot" class="relative monacoeditor"></div>
    <div
        id="auto-suggestions"
        class="absolute max-w-md py-2 overflow-auto bg-gray-100 shadow max-h-64"
    >
        <div
            tabindex="-1"
            v-for="(listItem, index) in list"
            :key="index"
            class="hover:bg-gray-300"
            :class="selectedSuggestionIndex === index ? 'bg-gray-300' : ''"
            :id="`sugg-${index}`"
        >
            <div
                @click.stop="handleApplySuggestion(listItem)"
                class="px-2"
            >
                <AtlanIcon
                    :icon="
                        getAssetIconWithCertification(
                            listItem?.documentation?.entity
                        )
                    "
                    class="mr-1"
                ></AtlanIcon
                >{{ listItem.label }}
            </div>
        </div>
    </div>
    <!-- <SuggestionList
        id="auto-suggestions"
        @applySuggestions="handleApplySuggestion"
        :suggestions="list"
        :isAutoComplete="isAutoComplete"
        :editor="editor"
    /> -->
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
    import { useMagicKeys, whenever } from '@vueuse/core'
    import { languageTokens } from './sqlTokens'
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
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
    import {
        editorStates,
        updateEditorModelOnTabOpen,
        updateEditorModel,
    } from '~/components/insights/playground/editor/monaco/useModel'
    import { capitalizeFirstLetter } from '~/utils/string'
    import SuggestionList from '~/components/insights/playground/editor/monaco/suggestionList.vue'

    // @ts-ignore
    self.MonacoEnvironment = {
        getWorker(_, label) {
            return new editorWorker()
        },
    }

    export default defineComponent({
        emits: ['editorInstance'],
        props: {},
        components: { SuggestionList },

        setup(props, { emit }) {
            const list = ref([])
            const selectedSuggestionIndex = ref(0)

            const { ArrowUp, ArrowDown, x } = useMagicKeys()

            const traverseUp = () => {
                selectedSuggestionIndex.value =
                    (selectedSuggestionIndex.value - 1) % list.value.length
            }
            const traverseDown = () => {
                // debugger
                console.log('HUHUHUHUHUHU')
                selectedSuggestionIndex.value =
                    (selectedSuggestionIndex.value + 1) % list.value.length
                console.log(selectedSuggestionIndex.value)
                const el = document.getElementById(
                    `sugg-${selectedSuggestionIndex.value}`
                )
                if (el)
                    el.scrollIntoView({
                        behavior: 'smooth',
                        // block: 'end',
                        block: 'end',
                        inline: 'nearest',
                    })
            }
            // document.addEventListener('keydown', (e) => {
            //     console.log('HAI', e, e.key)
            // })
            whenever(ArrowUp, traverseUp)
            whenever(ArrowDown, traverseDown)

            // watch(ArrowDown, (v) => {
            //     traverseDown()
            //     if (v) console.log('space has been pressed')
            // })
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

            const editorFocused = inject('editorFocused') as Ref<boolean>
            const editorContentSelectionState = inject(
                'editorContentSelectionState'
            ) as Ref<boolean>
            const runQuery = inject('runQuery') as Function
            const saveOrUpdate = inject('saveOrUpdate') as Function
            const editorPos = inject('editorPos') as Ref<{
                column: number
                lineNumber: number
            }>
            const monacoRoot = ref<HTMLElement>()
            const disposable: Ref<monaco.IDisposable | undefined> = ref()
            let editor: monaco.editor.IStandaloneCodeEditor | undefined
            const outputPaneSize = inject('outputPaneSize') as Ref<number>
            // const keyDownEv = editor?.onKeyDown((e) => {
            //     console.log('YAYAYAYAYA', e)
            // })

            const {
                clearMoustacheTemplateColor,
                toggleGhostCursor,
                onEditorContentChange,
                formatter,
                setEditorPos,
                setEditorFocusedState,
                findCustomVariableMatches,
                setMoustacheTemplateColor,
            } = useEditor(tabs, activeInlineTab)

            // save custom variable cases

            const editorInstanceRef = inject(
                'editorInstance'
            ) as Ref<monaco.editor.IStandaloneCodeEditor>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>

            const { addVariableFromEditor } = useCustomVariable(
                editorInstanceRef,
                monacoInstanceRef
            )

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

            const { assetType, certificateStatus } = useAssetInfo()
            const getAssetIconWithCertification = (asset) => {
                // debugger
                if (!asset) return ''
                const type =
                    capitalizeFirstLetter(
                        assetType(asset)?.toLowerCase() ||
                            asset.typeName.toLowerCase() ||
                            ''
                    ) || ''
                const certification =
                    capitalizeFirstLetter(
                        certificateStatus(asset)?.toLowerCase() || ''
                    ) || ''

                if (type && certification) return `${type}${certification}`
                if (type) return `${type}`
                return ''
            }
            const isAutoComplete = ref(false)
            const hideAutoCompletion = () => {
                const el = document.getElementById('auto-suggestions')
                el?.classList.add('hidden')
                isAutoComplete.value = false
            }
            const showAutoCompletion = () => {
                const el = document.getElementById('auto-suggestions')
                el?.classList.remove('hidden')
                isAutoComplete.value = true
                selectedSuggestionIndex.value = 0
                // document.activeElement.blur()
                // setEditorFocusedState(false, editorFocused)
            }

            watch(
                list,
                () => {
                    if (list.value.length) showAutoCompletion()
                    else hideAutoCompletion()
                },
                { deep: true }
            )
            const setDropdown = () => {
                const cursor = document.querySelector(
                    '.cursor.monaco-mouse-cursor-text'
                )
                const parentEl = document.getElementsByClassName(
                    'view-lines monaco-mouse-cursor-text'
                )[0]

                const cursorRect = cursor.getBoundingClientRect()
                const parentRect = parentEl.getBoundingClientRect()
                console.log('BOOO', cursor.offsetLeft, cursor.offsetTop)
                const divA = document.getElementById('auto-suggestions')
                console.log(divA)
                divA.style.top = `${cursor.offsetTop + 27}px`
                divA.style.left = `${cursor.offsetLeft + 65}px`
            }
            const triggerAutoCompletion = (
                promise: Promise<{
                    suggestions: suggestionKeywordInterface[]
                    incomplete: boolean
                }>
            ) => {
                setDropdown()
                // clearing previous popover register data
                // if (disposable) disposable.value?.dispose()
                promise.then((value) => {
                    // debugger
                    list.value = value.suggestions
                    console.log('HELOOOOOOOOOO', value)
                })
                // disposable.value =
                //     monaco.languages.registerCompletionItemProvider(
                //         'atlansql',
                //         {
                //             triggerCharacters: triggerCharacters,
                //             provideCompletionItems() {
                //                 // For object properties https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitem.html
                //                 return promise
                //             },
                //         }
                //     )

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

            const handleApplySuggestion = (suggestion) => {
                // debugger
                // get current cursor position
                const editorPosition = editor?.getPosition() as monaco.IPosition
                // use current cursor position to get position of the word to be replaced
                const wordPosition = editor
                    ?.getModel()
                    ?.getWordAtPosition(editorPosition)
                // debugger
                if (
                    wordPosition?.endColumn &&
                    wordPosition?.startColumn &&
                    editorPosition?.lineNumber
                ) {
                    // edit the word at the position calculated above
                    editor?.getModel()?.pushEditOperations(
                        [],
                        [
                            {
                                range: {
                                    endColumn: wordPosition.endColumn,
                                    startColumn: wordPosition.startColumn,
                                    startLineNumber: editorPosition.lineNumber,
                                    endLineNumber: editorPosition.lineNumber,
                                },
                                text: suggestion.label,
                            },
                        ],
                        () => null
                    )
                    // calling the above method selects the text that gets appended - we need to reset the selection to remove the selection
                    // getting position of the completed word
                    const completedWordPosition = editor
                        ?.getModel()
                        ?.getWordAtPosition(
                            editor?.getPosition() as monaco.IPosition
                        )
                    const endColumn = completedWordPosition?.endColumn
                    const endLine = editor?.getPosition()?.lineNumber
                    // provide completed word's line number and end column number to reset selection (we do this by creating a new selection with same end and start position which is the end of the completed word - so the cursor gets set at the end of the completed word and no text is selected/highlighted)
                    if (endColumn && endLine)
                        editor?.setSelection(
                            new monaco.Selection(
                                endLine,
                                endColumn,
                                endLine,
                                endColumn
                            )
                        )
                    // restore focus on the editor (gets hidden after we insert the suggestion)
                    editor?.focus()
                }
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
                    wordBasedSuggestions: false,
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
                        strings: false,
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
                updateEditorModel(editorStates, activeInlineTab.value.key, {
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
                    } else {
                        editorContentSelectionState.value = true
                    }
                })
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

                const modifyLine = (lineCode) => {
                    let startCount = 0
                    let endCount = 0

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
                // editor?.addCommand(18, function () {
                //     traverseDown()
                // })
                // editor?.addCommand(16, function () {
                //     traverseUp()
                // })
                const keyDownEv = editor?.onKeyDown((e) => {
                    if (e.keyCode === 18 && isAutoComplete.value) {
                        // debugger
                        traverseDown()
                        e.preventDefault()
                        e.stopPropagation()
                    }
                    if (e.keyCode === 16 && isAutoComplete.value) {
                        e.preventDefault()
                        e.stopPropagation()
                        traverseUp()
                    }
                    if (e.keyCode === 3 && isAutoComplete.value) {
                        // document.activeElement.blur()
                        e.preventDefault()
                        e.stopPropagation()
                        handleApplySuggestion(
                            list.value[selectedSuggestionIndex.value]
                        )
                    }
                    // console.log('YAYAYAYAYA', e.keyCode)
                })
                // editor.addAction({
                //     id: 'test',
                //     label: 'test',
                //     // An optional array of keybindings for the action.
                //     keybindings: [3],

                //     // A precondition for this action.
                //     precondition: !!isAutoComplete.value,

                //     // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
                //     keybindingContext: !!isAutoComplete.value,

                //     // Method that will be executed when the action is triggered.
                //     // @param editor The editor instance is passed in as a convenience
                //     run: function (ed) {
                //         handleApplySuggestion(
                //             list.value[selectedSuggestionIndex.value]
                //         )
                //     },
                // })
                // editor?.addCommand(3, function () {
                //     if (isAutoComplete.value)
                //         handleApplySuggestion(
                //             list.value[selectedSuggestionIndex.value]
                //         )
                //     else return
                // })
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
                    toggleCMDK()
                })

                /* -------------------------------------------- */
                editor?.getModel().onDidChangeContent((event) => {
                    // debugger
                    const text = editor?.getValue()
                    onEditorContentChange(event, text, editor)
                    findAndChangeCustomVariablesColor(false)
                    const changes = event?.changes[0]
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
                // editor?.cursorPositionChangedEvent(()=>{

                // })

                editor?.onDidChangeCursorPosition((pos) => {
                    // console.log('POSTION', pos)

                    setEditorPos(pos.position, editorPos)
                    hideAutoCompletion()
                    // setTimeout(setDropdown, 300)
                })

                editor?.onDidBlurEditorWidget(() => {
                    toggleGhostCursor(
                        true,
                        editor,
                        monaco,
                        editor?.getPosition()
                    )
                    // hideAutoCompletion()
                })
                editor?.onDidFocusEditorWidget(() => {
                    toggleGhostCursor(false, editor, monaco, editorPos)
                    setEditorFocusedState(true, editorFocused)
                })
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

            watch(activeInlineTabKey, (newKey, prevKey) => {
                // updateEditorModelOnTabOpen(editorStates, newKey as string)

                // if (!editorStates.get(newKey).viewState) {
                //     editor?.setSelection(new monaco.Selection(0, 0, 0, 0))
                // } else if (
                //     editorStates.get(newKey).viewState &&
                //     !editorStates.get(newKey).viewState?.cursorState[0]
                //         ?.inSelectionMode
                // ) {
                //     editor?.setSelection(new monaco.Selection(0, 0, 0, 0))
                // }

                if (tabs.value[newKey]?.playground?.isVQB) {
                    return
                } else {
                    editor?.focus()

                    if (!editorStates.get(newKey).viewState) {
                        setEditorFocusedState(false, editorFocused)
                        setEditorPos(editor?.getPosition(), editorPos)
                    }
                    const viewState = editor?.saveViewState()
                    if (!viewState?.cursorState?.length) {
                        setEditorFocusedState(false, editorFocused)
                    }
                    editor?.onDidChangeCursorPosition((pos) => {
                        setEditorPos(pos.position, editorPos)
                    })
                    editor?.onDidFocusEditorWidget(() => {
                        toggleGhostCursor(false, editor, monaco, editorPos)
                        setEditorPos(editor?.getPosition(), editorPos)
                        setEditorFocusedState(true, editorFocused)
                    })
                    editor?.onDidBlurEditorWidget(() => {
                        // setEditorFocusedState(false, editorFocused)
                        toggleGhostCursor(
                            true,
                            editor,
                            monaco,
                            editor?.getPosition()
                        )
                    })

                    // old
                    const _index = tabs.value.findIndex(
                        (tab) => tab.key === prevKey
                    )

                    if (_index > -1) {
                        const prevViewState = editor?.saveViewState()

                        updateEditorModel(
                            editorStates,
                            tabs.value[_index].key,
                            {
                                model: editorStates.get(tabs.value[_index].key)
                                    .model,
                                viewState: prevViewState,
                            }
                        )
                    }
                    //new
                    const index = tabs.value.findIndex(
                        (tab) => tab.key === newKey
                    )
                    if (!editorStates.get(tabs.value[index].key)?.model) {
                        const newModel = monaco.editor.createModel(
                            String(
                                toRaw(tabs.value)[index].playground.editor.text
                            ),
                            'atlansql'
                        )

                        updateEditorModel(editorStates, tabs.value[index].key, {
                            model: newModel,
                            viewState: {},
                        })

                        editor?.setModel(null)
                        editor?.setModel(newModel)
                        setEditorPos(editor?.getPosition(), editorPos)
                    } else {
                        editor?.setModel(
                            editorStates.get(tabs.value[index].key).model
                        )

                        const newViewState = editorStates.get(
                            tabs.value[index].key
                        ).viewState
                        if (newViewState) editor?.restoreViewState(newViewState)
                        setEditorPos(editor?.getPosition(), editorPos)
                    }

                    editor?.getModel()?.onDidChangeContent(async (event) => {
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
                        if (tabs.value[_index.value]?.playground?.isVQB) return
                        findAndChangeCustomVariablesColor(true)
                        // debugger
                        const parentElement =
                            document.getElementsByClassName('monacoeditor')[0]
                        const el = document.getElementById('auto-suggestions')
                        parentElement.appendChild(el)
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

            onMounted(() => {
                const parentElement =
                    document.getElementsByClassName('monacoeditor')[0]
                const el = document.getElementById('auto-suggestions')
                parentElement.appendChild(el)
                tabs.value.forEach((tab) => {
                    const newModel = monaco.editor.createModel(
                        tab.playground.editor.text,
                        'atlansql'
                    )
                    // current active already restted
                    // first it runs monaco on mount then this onMounted lifeycle hook
                    if (activeInlineTabKey.value !== tab.key) {
                        updateEditorModel(
                            editorStates,
                            tab.key,
                            {
                                model: newModel,
                                viewState: undefined,
                            },
                            tabs
                        )
                    }
                })
            })

            return {
                editor,
                isAutoComplete,
                editorStates,
                outputPaneSize,
                monacoRoot,
                list,
                handleApplySuggestion,
                selectedSuggestionIndex,
                getAssetIconWithCertification,
            }
        },
    })
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
    .monaco-list-row.show-file-icons.string-label.focused {
        // @apply bg-gray-light !important;
        background: #f3f3f3 !important;

        @apply text-gray-700 !important;
        border-radius: 3px !important;
    }
    .monaco-list-row.focused {
        // @apply bg-gray-light !important;
        background: #f3f3f3 !important;

        @apply text-gray-700 !important;
        border-radius: 3px !important;
    }
</style>
<style lang="less">
    .monaco-list-row.show-file-icons.string-label.focused {
        // @apply bg-gray-light !important;
        background: '#F3F3F3' !important;

        @apply text-gray-700 !important;
        border-radius: 3px !important;
    }
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

    .suggest-icon.codicon.codicon-symbol-keyword::before {
        visibility: hidden !important;
        width: 15px !important;
        height: 15px !important;
    }
    .suggest-icon.codicon.codicon-symbol-field::before {
        visibility: hidden !important;
        width: 15px !important;
        height: 15px !important;
    }
    .suggest-icon.codicon.codicon-symbol-text::before {
        visibility: hidden !important;
        width: 15px !important;
        height: 15px !important;
    }
    .suggest-icon.codicon.codicon-symbol-text {
        background-image: url('~/assets/images/insights/autocomplete/default.png') !important;
        width: 15px !important;
        height: 15px !important;
        background-size: 15px 15px;
        margin-top: 3px !important;
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
