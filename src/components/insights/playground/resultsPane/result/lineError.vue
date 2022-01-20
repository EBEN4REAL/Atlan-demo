<template>
    <!-- Error on running a query -->
    <div class="w-full p-4 errorPanel">
        <div class="flex items-center mb-4 text-xs">
            <div
                class="flex items-center justify-end px-3 py-1 light_creme dark_orange rounded-3xl"
            >
                Invalid query
            </div>
            <span class="ml-2 text-gray-500">Error found</span>
        </div>
        <div class="flex items-center w-full mb-2">
            <AtlanIcon icon="IssuesFilled" class="w-4 h-4" />
            <span class="flex flex-wrap w-11/12 ml-2 text-sm text-gray-700">{{
                queryErrorObj.errorMessage
            }}</span>
        </div>
        <div class="w-full p-2 mt-3 bg-gray-100 rounded error-lines-area">
            <template v-for="(item, i) in renderedLines" :key="i">
                <div class="flex">
                    <span
                        v-if="item?.index === queryErrorObj?.details?.line"
                        class="w-1.5 h-1.5 rounded-full mt-1.5"
                        style="background-color: #cf592e"
                    ></span>
                    <span
                        v-if="item.index !== queryErrorObj?.details?.line"
                        class="w-1.5 h-1.5 rounded-full mt-1.5"
                        style="background: transparent"
                    ></span>
                    <span class="ml-1 mr-2" style="color: #a5a5a5">{{
                        item.index
                    }}</span>
                    <!-- :style="`color:${getTokenColor(kt)}`" -->
                    <div
                        class="flex flex-wrap w-full"
                        v-html="
                            generateHTMLFromLine(item.index, item.description)
                        "
                    ></div>
                </div>
            </template>
        </div>
    </div>
    <!-- ---------------------- -->
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        inject,
        Ref,
        toRaw,
        watch,
        ref,
        PropType,
        toRefs,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { languageTokens } from '~/components/insights/playground/editor/monaco/sqlTokens'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            /* Regex for extracting the line number & column number */
            const lineRegex = /(?:line )([0-9]+)/gim
            const columnRegex = /(?:column )([0-9]+)/gim

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const editorInstance = inject('editorInstance') as Ref<any>
            const monacoInstance = inject('monacoInstance') as Ref<any>
            const pos: Ref<any> = ref({})
            const renderedLines: Ref<any[]> = ref([])

            const errorDecorations = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .errorDecorations
            )

            const queryErrorObj = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .queryErrorObj
            )
            watch(
                activeInlineTabKey,
                () => {
                    if (
                        activeInlineTab.value &&
                        activeInlineTab.value.playground.resultsPane.result
                            .queryErrorObj.errorMessage &&
                        activeInlineTab.value.playground.resultsPane.result
                            .queryErrorObj.errorMessage !== ''
                    ) {
                        renderedLines.value = []
                        const editorText =
                            activeInlineTab.value.playground.editor.text
                        /* [["Line 3", "3"], ["line 3", "3"]] */
                        const linesInfo = [
                            ...queryErrorObj.value.errorMessage?.matchAll(
                                lineRegex
                            ),
                        ]
                        console.log(linesInfo, 'linesInfo')
                        // debugger
                        /* [["column 4", "4"], ["column 7", "7"]]*/
                        const columnsInfo = [
                            ...queryErrorObj.value.errorMessage.matchAll(
                                columnRegex
                            ),
                        ]
                        pos.value = {
                            startLine: linesInfo[0][1],
                            startColumn: columnsInfo[0][1],
                            endLine: undefined,
                            endColumn: undefined,
                        }

                        if (linesInfo.length > 1) {
                            pos.value.endLine = linesInfo[1][1]
                            pos.value.endColumn = columnsInfo[1][1]
                        }

                        const e = editorText.split('\n')

                        let validPos = pos.value.endLine
                            ? pos.value.endLine
                            : pos.value.startLine
                        validPos = Number(validPos)
                        /* Next line exist for showing */
                        console.log(validPos, e, 'validPos')

                        if (validPos < e.length) {
                            if (validPos >= 0)
                                renderedLines.value.push({
                                    index: validPos + 1,
                                    description: e[validPos + 1 - 1],
                                })
                            if (validPos - 1 >= 0)
                                renderedLines.value.push({
                                    index: validPos,
                                    description: e[validPos - 1],
                                })
                            if (validPos - 2 >= 0)
                                renderedLines.value.push({
                                    index: validPos - 1,
                                    description: e[validPos - 1 - 1],
                                })
                        } else if (validPos == e.length) {
                            /* Next line exist for showing */
                            if (validPos - 1 >= 0) {
                                renderedLines.value.push({
                                    index: validPos,
                                    description: e[validPos - 1],
                                })
                            }
                            if (validPos - 2 >= 0) {
                                renderedLines.value.push({
                                    index: validPos - 1,
                                    description: e[validPos - 1 - 1],
                                })
                            }
                            if (validPos - 3 >= 0) {
                                renderedLines.value.push({
                                    index: validPos - 1 - 1,
                                    description: e[validPos - 1 - 1 - 1],
                                })
                            }
                        }
                    }
                },
                { immediate: true }
            )

            // /* IMP FOR FIRST TIME RENDER */
            renderedLines.value.reverse()

            const getTokenColor = (token: string) => {
                /* Noram gray color */
                let color = '#3E4359'
                if (languageTokens.keywords.includes(token)) {
                    console.log()
                    color = '#5277D7'
                } else if (languageTokens.operators.includes(token)) {
                    color = '#5277D7'
                } else if (languageTokens.builtinFunctions.includes(token)) {
                    color = '#5277D7'
                } else if (languageTokens.keywords.includes(token)) {
                    /* Is a number */
                    if (!isNaN(parseInt(token))) {
                        color = '#5277D7'
                    }
                }
                console.log(token, color)
                return color
            }

            const generateHTMLFromLine = (
                lineIndex: number,
                lineDesc: string
            ) => {
                const t = lineDesc.split(' ')

                let html = ''

                if (pos.value?.endLine) {
                    if (Number(lineIndex) === Number(pos.value.endLine)) {
                        let tokensTillNow = ''
                        t.forEach((token) => {
                            if (token !== '') {
                                const color = getTokenColor(token)
                                html += `<div style="color:${color}">`
                                const chars = token.split('')
                                chars.forEach((char, z) => {
                                    if (
                                        tokensTillNow.length + z + 1 >=
                                            Number(pos.value.startColumn) &&
                                        tokensTillNow.length + z + 1 <=
                                            Number(pos.value.endColumn)
                                    ) {
                                        if (char !== ' ') {
                                            html += `<span class="light_creme">${char}</span>`
                                        } else {
                                            html += `<span class="light_creme">&nbsp;</span>`
                                        }
                                    } else {
                                        if (char !== ' ') {
                                            html += `<span >${char}</span>`
                                        } else {
                                            html += `<span >&nbsp;</span>`
                                        }
                                    }
                                })
                                html += `<span>&nbsp;</span>`
                                html += `</div>`
                                tokensTillNow += ' '
                            } else {
                                if (
                                    tokensTillNow.length >=
                                        Number(pos.value.startColumn) &&
                                    tokensTillNow.length <=
                                        Number(pos.value.endColumn)
                                ) {
                                    html += `<span class="light_creme">&nbsp;</span>`
                                } else {
                                    html += `<span>&nbsp;</span>`
                                }
                                tokensTillNow += ' '
                            }
                            tokensTillNow += token
                        })
                    } else {
                        console.log('else', pos.value?.endLine)
                        t.forEach((token, i) => {
                            if (token !== '') {
                                const color = getTokenColor(token)
                                html += `<div class="keep-spaces" style="color:${color}">${token}&nbsp;</div>`
                            } else {
                                html += '&nbsp;'
                            }
                        })
                    }
                } else {
                    const t = lineDesc.split(' ')
                    if (Number(lineIndex) === Number(pos.value.startLine)) {
                        let tokensTillNow = ''
                        t.forEach((token) => {
                            console.log(t, 'tokens', tokensTillNow)
                            if (token !== '') {
                                const chars = token.split('')
                                chars.forEach((char, z) => {
                                    if (
                                        tokensTillNow.length + z + 1 >=
                                            Number(pos.value.startColumn) &&
                                        tokensTillNow.length + z + 1 <=
                                            tokensTillNow.length + token.length
                                    ) {
                                        if (char !== ' ') {
                                            html += `<span class="light_creme">${char}</span>`
                                        } else {
                                            html += `<span class="light_creme">&nbsp;</span>`
                                        }
                                    } else {
                                        if (char !== ' ') {
                                            html += `<span >${char}</span>`
                                        } else {
                                            html += `<span >&nbsp;</span>`
                                        }
                                    }
                                })
                                html += `<span>&nbsp;</span>`
                                tokensTillNow += ' '
                            } else {
                                html += `<span>&nbsp;</span>`
                                tokensTillNow += ' '
                            }
                            tokensTillNow += token
                        })
                    } else {
                        t.forEach((token, i) => {
                            if (token !== '') {
                                const color = getTokenColor(token)
                                html += `<div class="keep-spaces" style="color:${color}">${token}&nbsp;</div>`
                            } else {
                                html += '&nbsp;'
                            }
                        })
                    }
                }
                return html
            }

            const monacoI = toRaw(monacoInstance.value)
            const editorI = toRaw(editorInstance.value)
            if (activeInlineTab.value) {
                activeInlineTab.value.playground.resultsPane.result.errorDecorations =
                    editorI?.deltaDecorations(errorDecorations.value, [
                        {
                            range: new monacoI.Range(
                                Number(pos.value.startLine),
                                1,
                                Number(pos.value.startLine),
                                1
                            ),
                            options: {
                                linesDecorationsClassName:
                                    'edtiorErrorDotDecoration',
                            },
                        },
                    ])
            }

            return {
                generateHTMLFromLine,
                renderedLines,
                queryErrorObj,
            }
        },
    })
</script>
<style lang="less" scoped>
    .dark_orange {
        color: #e04f1a;
    }

    .keep-spaces {
        white-space: pre-wrap;
    }

    .errorPanel {
        // height: calc(100% - 4.5rem);
        overflow-y: auto;
    }
</style>
<style lang="less">
    .light_creme {
        background-color: #fceee8;
    }
    .edtiorErrorDotDecoration {
        background: #cf592e;
        position: absolute !important;
        top: 50%;
        left: 9px !important;
        transform: translate(0%, -50%);
        width: 6px !important;
        height: 6px !important;
        border-radius: 100%;
        // margin-left: 3px;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
