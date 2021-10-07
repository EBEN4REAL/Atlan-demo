<template>
    <div ref="monacoRoot" class="monacoeditor"></div>
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

    import savedQuery from './savedQuery'
    import sqlKeywords from './sqlKeywords'
    import columnSuggestion from './columnSuggestion'

    import { languageTokens } from './sqlTokens'
    import TurndownService from 'turndown'
    import * as monaco from 'monaco-editor'
    import fetchColumnList from '~/composables/columns/fetchColumnList'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useEditor } from '~/components/insights/common/composables/useEditor'

    const turndownService = new TurndownService({})

    // @ts-ignore
    self.MonacoEnvironment = {
        getWorker(_: string, label: string) {
            return new Worker('./monaco-editor/esm/vs/projects/editor.worker', {
                type: 'module',
            })
            // return new EditorWorker();
        },
    }

    export default defineComponent({
        emits: ['editorInstance'],
        props: {},

        setup(props, { emit }) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
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
                onEditorContentChange,
                formatter,
                setEditorPos,
                setEditorFocusedState,
            } = useEditor(tabs, activeInlineTab)

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

            const now = ref(true)
            const { list } = fetchColumnList('', now, entityFilters, [
                'Column.dataType.keyword',
            ])
            console.log(list)

            monaco.languages.register({ id: 'atlansql' })

            monaco.languages.setMonarchTokensProvider(
                'atlansql',
                languageTokens
            )
            const setCurrentPosition = (position: any) => {
                currentPosition.value = position
            }
            const getCurrentPosition = () => {
                return currentPosition.value
            }
            function randStr(len = 7) {
                let s = ''
                while (s.length < len)
                    s += Math.random()
                        .toString(36)
                        .substr(2, len - s.length)
                return s
            }
            const generateKeywordSuggestions = (lastTypedCharacter) => {
                const randomKeywords = []
                Array(8)
                    .fill('')
                    .forEach(() => {
                        const randomString = randStr()
                        const keyword = {
                            label: lastTypedCharacter + randomString,
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: lastTypedCharacter + randomString,
                        }
                        randomKeywords.push(keyword)
                    })
                return randomKeywords
            }
            const triggerAutoCompletion = (lastTypedCharacter) => {
                let randomKeywords = []
                if (lastTypedCharacter !== '')
                    randomKeywords =
                        generateKeywordSuggestions(lastTypedCharacter)
                // clearing previous popover register data
                if (disposable) disposable.value?.dispose()
                console.log(randomKeywords)
                disposable.value =
                    monaco.languages.registerCompletionItemProvider(
                        'atlansql',
                        {
                            provideCompletionItems() {
                                // For object properties https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitem.html
                                return {
                                    suggestions: [
                                        ...randomKeywords,
                                        ...savedQuery(),
                                        ...sqlKeywords(),
                                        ...columnSuggestion(unref(list.value)),
                                    ],
                                }
                            },
                        }
                    )
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

            onMounted(() => {
                editor = monaco.editor.create(monacoRoot.value as HTMLElement, {
                    language: 'atlansql',
                    value: activeInlineTab.value.playground.editor.text,
                    renderLineHighlight: 'none',
                    theme: 'vs',
                    minimap: {
                        enabled: false,
                    },
                    automaticLayout: true,
                    quickSuggestions: {
                        other: true,
                        comments: false,
                        strings: false,
                    },
                })
                emit('editorInstance', editor, monaco)

                const lastLineLength = editor?.getModel()?.getLineMaxColumn(1)
                console.log(lastLineLength)
                // emit('editorInstance', editor)
                editor?.getModel().onDidChangeContent((event) => {
                    const text = editor?.getValue()
                    console.log(event)
                    onEditorContentChange(event, text)
                    const lastTypedCharacter = event?.changes[0]?.text
                    triggerAutoCompletion(lastTypedCharacter)
                })
                editor?.onDidChangeCursorPosition(() => {
                    setEditorPos(editor, editorPos)
                    setEditorFocusedState(true, editorFocused)
                })
                editor?.onDidBlurEditorText(() => {
                    setEditorFocusedState(false, editorFocused)
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
                    editor.getModel().onDidChangeContent((event) => {
                        const text = editor.getValue()
                        onEditorContentChange(event, text)
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
                    editor?.focus()
                    editor?.onDidBlurEditorText(() => {
                        setEditorFocusedState(false, editorFocused)
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

<style scoped>
    .monacoeditor {
        min-height: 90%;
    }
    .editor_wrapper {
        overflow: hidden;
    }
</style>
