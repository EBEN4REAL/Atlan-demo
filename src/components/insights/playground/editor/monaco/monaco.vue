<template>
    <div ref="monacoRoot" class="relative px-3 monacoeditor"></div>
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
    } from 'vue'

    import { languageTokens } from './sqlTokens'
    import TurndownService from 'turndown'
    import * as monaco from 'monaco-editor'
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
    import { createAtlanTheme } from './customTheme'
    import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'

    const turndownService = new TurndownService({})

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
            const cancelTokenSource = ref()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const sqlVariables = inject('sqlVariables') as Ref<
                CustomVaribaleInterface[]
            >
            const editorFocused = inject('editorFocused') as Ref<boolean>
            const editorPos = inject('editorPos') as Ref<{
                column: number
                lineNumber: number
            }>
            const monacoRoot = ref<HTMLElement>()
            const disposable: Ref<monaco.IDisposable | undefined> = ref()
            const currentPosition: Ref<any> = ref({})
            let editor: monaco.editor.IStandaloneCodeEditor | undefined
            const outputPaneSize = inject('outputPaneSize') as Ref<number>
            const {
                toggleGhostCursor,
                onEditorContentChange,
                formatter,
                setEditorPos,
                setEditorFocusedState,
                findCustomVariableMatches,
                changeMoustacheTemplateColor,
            } = useEditor(tabs, activeInlineTab, sqlVariables)

            const entityFilters = {
                condition: 'OR',
                criterion: [
                    {
                        attributeName: 'viewQualifiedName',
                        operator: 'eq',
                        attributeValue:
                            'default/snowflake/shpllkz7g/SNOWFLAKE/ORGANIZATION_USAGE/RATE_SHEET_DAILY',
                    },
                    {
                        attributeName: 'tableQualifiedName',
                        operator: 'eq',
                        attributeValue:
                            'default/snowflake/shpllkz7g/SNOWFLAKE/ORGANIZATION_USAGE/RATE_SHEET_DAILY',
                    },
                ],
            }

            const isSelectedWordIsTableName = (word: string): boolean => {
                switch (word) {
                    case 'superstore_sales_data_2016-present': {
                        return true
                    }
                    case 'superstore_sales_data_2016': {
                        return true
                    }
                    default: {
                        return false
                    }
                }
            }
            const findAndChangeCustomVariablesColor = () => {
                if (activeInlineTab.value) {
                    const matches = findCustomVariableMatches(
                        editor,
                        activeInlineTab.value.playground.editor.text
                    )
                    if (matches?.length > 0)
                        changeMoustacheTemplateColor(editor, monaco, matches)
                }
            }

            monaco.languages.register({ id: 'atlansql' })

            monaco.languages.setMonarchTokensProvider(
                'atlansql',
                languageTokens
            )
            const resetErrorDecorations = (
                activeInlineTab: Ref<activeInlineTabInterface>,
                editor: any
            ) => {
                if (
                    activeInlineTab.value?.playground?.resultsPane?.result
                        ?.errorDecorations?.length > 0
                ) {
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
                editor: any
            ) => {
                if (
                    activeInlineTab.value &&
                    activeInlineTab.value.playground.resultsPane.result
                        .errorDecorations?.length > 0
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
                                activeInlineTab.value.playground.resultsPane
                                    .result.errorDecorations,
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
            }

            try {
                monaco.languages.registerHoverProvider('atlansql', {
                    provideHover(model, position, token) {
                        const hoveredWord =
                            model.getWordAtPosition(position).word
                        // ignore whitespace
                        if (
                            model.getLineContent(position.lineNumber).trim() !==
                                '' &&
                            isSelectedWordIsTableName(hoveredWord)
                        ) {
                            console.log(model.getWordAtPosition(position).word)
                            return {
                                contents: [
                                    { value: 'Source: Snowflake' },
                                    {
                                        value: 'Rows: ~51,291, Columns: 24',
                                    },
                                    {
                                        Value: 'Classifications: Master Data, Private, Verified Assets',
                                    },
                                    {
                                        value: turndownService.turndown(
                                            decodeURIComponent(
                                                '%3Ch2%3EGlobal%20Retail%20Sales%3C%2Fh2%3E%3Chr%3E%3Ch3%3E%3Cstrong%3EContext%3C%2Fstrong%3E%3C%2Fh3%3E%3Cp%3EGlobal%20Superstore%20is%20a%20global%20online%20retailer%20based%20in%20New%20York%2C%20boasting%20a%20broad%20product%20catalogue%20and%20aiming%20to%20be%20a%20one-stop-shop%20for%20its%20customers.%20Global%20Superstore%E2%80%99s%20clientele%2C%20hailing%20from%20147%20different%20countries%2C%20can%20browse%20through%20an%20endless%20offering%20with%20more%20than%2010%2C000%20products.%20Superstore%20is%20a%20big%20retail%20chain%20that%20manufactures%20and%20sells%20all%20retail%20products%20across%20the%20globe.%3C%2Fp%3E%3Cp%3EThis%20dataset%20named%3A%26nbsp%3B%3Cstrong%3Esuperstore_sales_data_2016-present%3C%2Fstrong%3E%26nbsp%3Bis%20one%20of%20the%20base%20datasets%20which%20is%20cleaned%2C%20curated%20and%20made%20available%20for%20ingesting%20in%20analytics%20pipelines.%3C%2Fp%3E%3Cp%3E%3C%2Fp%3E%3Cp%3E%3C%2Fp%3E%3Ch3%3E%3Cstrong%3EPurpose%3C%2Fstrong%3E%3C%2Fh3%3E%3Cp%3EThis%20table%20contains%20information%20about%20the%20following%20metrics%20at%20customer%20level%20%3A%3C%2Fp%3E%3Cul%3E%3Cli%3E%3Cp%3E%23sales%3C%2Fp%3E%3C%2Fli%3E%3Cli%3E%3Cp%3E%23quantity%3C%2Fp%3E%3C%2Fli%3E%3Cli%3E%3Cp%3E%23instant%20discounts%3C%2Fp%3E%3C%2Fli%3E%3Cli%3E%3Cp%3E%23shipping%20cost%3C%2Fp%3E%3C%2Fli%3E%3C%2Ful%3E%3Cp%3EYou%20can%20also%20slice%20and%20dice%20these%20metrics%20from%20a%20number%20of%20customer%20dimensions%20like%20%3A%3C%2Fp%3E%3Cul%3E%3Cli%3E%3Cp%3EState%3C%2Fp%3E%3C%2Fli%3E%3Cli%3E%3Cp%3ECity%3C%2Fp%3E%3C%2Fli%3E%3Cli%3E%3Cp%3ESales%20market%3C%2Fp%3E%3C%2Fli%3E%3Cli%3E%3Cp%3EProduct%20Category%3C%2Fp%3E%3C%2Fli%3E%3Cli%3E%3Cp%3EOrder%20Priority%3C%2Fp%3E%3Cp%3E%3C%2Fp%3E%3C%2Fli%3E%3C%2Ful%3E%3Ch3%3E%3Cstrong%3ETime%20Period%20%26amp%3B%20Geography%3C%2Fstrong%3E%3C%2Fh3%3E%3Cul%3E%3Cli%3E%3Cp%3EYears%20covered%3A%202016%20to%20Present%3C%2Fp%3E%3C%2Fli%3E%3Cli%3E%3Cp%3ERegions%20-%20APAC%2C%20EU%20and%20North%20America%3C%2Fp%3E%3C%2Fli%3E%3Cli%3E%3Cp%3ECollated%20data%20asset%20from%20product%20%2B%20Customer%3C%2Fp%3E%3C%2Fli%3E%3C%2Ful%3E%3Cp%3E%3C%2Fp%3E%3Cp%3EWiki%20Link%3A%26nbsp%3B%3Ca%20target%3D%22_blank%22%20href%3D%22https%3A%2F%2Fwiki.atlan.com%22%20rel%3D%22noopener%20noreferrer%20nofollow%22%3Ehttps%3A%2F%2Fwiki.atlan.com%3C%2Fa%3E%3C%2Fp%3E%3Cp%3E%3C%2Fp%3E'
                                            )
                                        ),
                                    },
                                ],
                            }
                        }
                    },
                })
            } catch (e) {
                console.error(e)
            }
            /* ---------------- Autoclosing pairs ------------------*/
            monaco.languages.setLanguageConfiguration(
                'atlansql',
                autoclosePairsConfig
            )
            /* ----------------------------------------------------- */
            onMounted(() => {
                createAtlanTheme(monaco)
                // atlanThemeLight
                editor = monaco.editor.create(monacoRoot.value as HTMLElement, {
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 8,
                    lineNumbersMinChars: 2,
                    language: 'atlansql',
                    value: activeInlineTab.value.playground.editor.text,
                    renderLineHighlight: 'none',
                    theme: 'atlan-light',
                    fontSize: 12,
                    minimap: {
                        enabled: false,
                    },
                    automaticLayout: true,
                    overviewRulerLanes: 0,
                    scrollbar: {
                        horizontal: 'hidden',
                    },
                    wordWrap: 'on',
                    quickSuggestions: {
                        other: true,
                        comments: false,
                        strings: true,
                    },
                })
                emit('editorInstance', editor, monaco)

                const lastLineLength = editor?.getModel()?.getLineMaxColumn(1)
                const matches =
                    findCustomVariableMatches(
                        editor,
                        activeInlineTab.value.playground.editor.text
                    ) ?? []
                changeMoustacheTemplateColor(editor, monaco, matches)

                console.log(lastLineLength)
                // emit('editorInstance', editor)
                editor?.getModel().onDidChangeContent((event) => {
                    resetErrorDecorations(activeInlineTab, editor)
                    // setErrorDecorations(activeInlineTab, editor)
                    const text = editor?.getValue()
                    onEditorContentChange(event, text, editor)
                    /* ------------- custom variable color change */
                    findAndChangeCustomVariablesColor()
                    /* ------------------------------------------ */
                    const changes = event?.changes[0]
                    const lastTypedCharacter = event?.changes[0]?.text
                    console.log(changes, 'changes')
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
                    triggerAutoCompletion(suggestions)
                })
                editor?.onDidChangeCursorPosition(() => {
                    setEditorPos(editor, editorPos)
                    setEditorFocusedState(true, editorFocused)
                })
                editor?.onDidBlurEditorWidget(() => {
                    setEditorFocusedState(false, editorFocused)
                    toggleGhostCursor(true, editor, monaco, editorPos)
                })
                editor?.onDidFocusEditorWidget(() => {
                    toggleGhostCursor(false, editor, monaco, editorPos)
                })
                setEditorFocusedState(true, editorFocused)
                editor?.focus()
                // on mounting
            })

            monaco.languages.registerDocumentRangeFormattingEditProvider(
                'atlansql',
                {
                    provideDocumentRangeFormattingEdits(model) {
                        let formatted = formatter(model.getValue())
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
            watch(activeInlineTab, () => {
                if (activeInlineTab.value) {
                    editor?.setModel(null)
                    const model = monaco.editor.createModel(
                        String(activeInlineTab.value.playground.editor.text),
                        'atlansql'
                    )

                    editor?.setModel(model)
                    /* ------------- custom variable color change */
                    findAndChangeCustomVariablesColor()
                    /* ------------------------------------------ */
                    /* ------------- set error decorations */
                    setErrorDecorations(activeInlineTab, editor)
                    /* ------------------------------------------ */
                    editor?.getModel()?.onDidChangeContent(async (event) => {
                        resetErrorDecorations(activeInlineTab, editor)
                        // setErrorDecorations(activeInlineTab, editor)
                        const text = editor?.getValue()
                        onEditorContentChange(event, text, editor)
                        const changes = event?.changes[0]
                        /* ------------- custom variable color change */
                        findAndChangeCustomVariablesColor()
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
                        triggerAutoCompletion(suggestions)
                    })
                    const range = editor?.getModel().getFullModelRange()
                    const position = {
                        column: range.endColumn,
                        lineNumber: range.endLineNumber,
                    }
                    editor?.setPosition(position)
                    editor?.onDidChangeCursorPosition(() => {
                        setEditorPos(editor, editorPos)
                    })
                    editor?.onDidChangeCursorPosition(() => {
                        setEditorPos(editor, editorPos)
                        setEditorFocusedState(true, editorFocused)
                    })
                    editor?.focus()
                    editor?.onDidBlurEditorWidget(() => {
                        setEditorFocusedState(false, editorFocused)
                        toggleGhostCursor(true, editor, monaco, editorPos)
                    })
                    editor?.onDidFocusEditorWidget(() => {
                        toggleGhostCursor(false, editor, monaco, editorPos)
                    })
                    emit('editorInstance', editor, monaco)
                }
            })
            watch(outputPaneSize, () => {
                if (monacoRoot.value) {
                    monacoRoot.value.style.height = `${
                        100 - outputPaneSize.value
                    }%`
                }
            })

            return {
                outputPaneSize,
                monacoRoot,
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
    }
    .c {
        font-family: 'Courier New', Courier, monospace;
    }
</style>
<style lang="less">
    .moustacheDecoration {
        // @apply font-semibold;
        color: #d77252 !important;
        background-color: #faf1ef !important;
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
