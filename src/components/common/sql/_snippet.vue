<template>
    <div class="relative">
        <div
            class="max-w-full p-4 overflow-x-auto overflow-y-auto rounded"
            :class="background === '' ? 'bg-gray-100' : background"
            style="max-height: 220px"
        >
            <div data-lang="sql" id="sql-preview"></div>
        </div>
        <div
            class="absolute px-1 py-0.5 bg-white rounded shadow cursor-pointer top-3 right-3"
            v-if="true"
            @click="handleCopy"
        >
            <AtlanIcon icon="CopyOutlined" class="w-4 h-4 text-gray-500" />
        </div>
        <span ref="monacoRoot"></span>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        onMounted,
        computed,
        toRefs,
        Ref,
        onUnmounted,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import { format, FormatOptions } from 'sql-formatter'
    import { languageTokens } from '~/components/insights/playground/editor/monaco/sqlTokens'
    import { copyToClipboard } from '~/utils/clipboard'
    import * as monaco from 'monaco-editor'
    import * as MonacoEditorApi from 'monaco-editor/esm/vs/editor/editor.api'
    import { StaticServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices'
    import { StandaloneThemeServiceImpl } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneThemeServiceImpl'
    import atlanLight from '~/components/insights/playground/editor/monaco/_themes/atlanLight.json'

    export default defineComponent({
        name: 'SQL Snippet',
        components: {},
        props: {
            text: {
                type: String,
                default: '',
            },
            background: {
                type: String,
                default: '',
            },
            enableCopy: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props, { emit }) {
            const { text, enableCopy } = toRefs(props)
            const viewerRef = ref()
            let editor = undefined
            const monacoRoot = ref<HTMLElement>()

            function removeMoustacheSpaces(text) {
                let t = text.replaceAll('{ { ', '{{')
                t = t.replaceAll(' } }', '}}')
                return t
            }
            function formatter(text: string, options?: FormatOptions) {
                /* It formats and changes {{abc}}-> { {abc} } */
                const t = format(text, options)
                return removeMoustacheSpaces(t)
            }
            const formattedText = computed(() => {
                return formatter(text.value, {
                    language: 'sql', // Defaults to "sql" (see the above list of supported dialects)
                    indent: '    ', // Defaults to two spaces
                })
            })

            const renderedLines = computed(() =>
                formattedText.value.split('\n')
            )

            const handleCopy = () => {
                copyToClipboard(formattedText.value)
                message.success('Query Copied!')
            }
            monaco.languages.register({ id: 'atlansql' })
            monaco.languages.setMonarchTokensProvider(
                'atlansql',
                languageTokens
            )
            onMounted(() => {
                editor = monaco.editor.create(monacoRoot.value as HTMLElement, {
                    language: 'atlansql',
                    value: '',
                    theme: atlanLight,
                })
            })

            monaco.editor
                .colorize(
                    formatter(text.value, {
                        language: 'sql', // Defaults to "sql" (see the above list of supported dialects)
                        indent: '    ', // Defaults to two spaces
                    }),
                    'atlansql'
                )
                .then(
                    (html) =>
                        (document.getElementById('sql-preview').innerHTML =
                            html)
                )
                .then(() => {
                    editor?.dispose()
                })

            // watch(formattedText, () => {
            //     debugger
            //     console.log(formattedText.value, 'formattedText')
            //     if (formattedText.value !== '') {
            //         monaco.editor
            //             .colorize(formattedText.value, 'atlansql')
            //             .then(
            //                 (html) =>
            //                     (document.getElementById(
            //                         'sql-preview'
            //                     ).innerHTML = html)
            //             )
            //     }
            // })

            // watch(viewerRef, () => {
            //     if (viewerRef.value) {
            //         const themeService: typeof StandaloneThemeServiceImpl =
            //             StaticServices.standaloneThemeService.get()
            //         themeService.registerEditorContainer(viewerRef.value)

            //                     monacoInstance.editor
            //     .colorize(code, 'atlansql')
            //     .then(
            //         (html) => (document.getElementById('sql').innerHTML = html)
            //     )

            //     }
            // })

            //.defineTheme('AtlanLight', atlanLight)
            // MonacoEditorApi.editor
            //     .colorize(code, { theme: atlanLight })
            //     .then(
            //         (html) => (document.getElementById('sql').innerHTML = html)
            //     )
            // onUnmounted(() => {
            //     editor?.dispose()
            // })

            return {
                monacoRoot,
                viewerRef,
                renderedLines,
                enableCopy,
                handleCopy,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped>
    .keep-spaces {
        white-space: pre-wrap;
    }
</style>
