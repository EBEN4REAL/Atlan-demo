<template>
    <!-- Error on running a query -->
    <div class="w-full h-full p-4">
        <div class="flex items-center mb-4 text-xs">
            <div
                class="flex items-center justify-end px-3 py-1  light_creme dark_orange rounded-3xl"
            >
                Invalid query
            </div>
            <span class="ml-2 text-gray-500">Error found</span>
        </div>
        <div class="flex items-center mb-2">
            <AtlanIcon icon="Issues" class="w-4 h-4 mr-2" />
            <span class="text-sm text-gray-700">{{
                queryErrorObj.errorMessage
            }}</span>
        </div>
        <div class="w-full p-2 mt-3 bg-gray-100 rounded error-lines-area">
            <template v-for="(item, i) in renderedLines.reverse()" :key="i">
                <div class="flex">
                    <span class="mr-2" style="color: #a5a5a5">{{
                        item.index
                    }}</span>
                    <!-- :style="`color:${getTokenColor(kt)}`" -->
                    <div
                        class="flex"
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
    import { defineComponent, computed, inject, Ref, toRaw } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { languageTokens } from '~/components/insights/playground/editor/monaco/sqlTokens'

    export default defineComponent({
        components: {},
        props: {},
        setup() {
            const lineRegex = /(?:line )([0-9]+)/gim
            const columnRegex = /(?:column )([0-9]+)/gi

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const editorInstance = inject('editorInstance') as Ref<any>
            const queryErrorObj = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .queryErrorObj
            )
            const editorText = toRaw(editorInstance.value).getValue()
            /* [["Line 3", "3"], ["line 3", "3"]] */
            const linesInfo = [
                ...queryErrorObj.value.errorMessage.matchAll(lineRegex),
            ]
            /* [["column 4", "4"], ["column 7", "7"]]*/
            const columnsInfo = [
                ...queryErrorObj.value.errorMessage.matchAll(columnRegex),
            ]
            let renderedLines: any[] = []
            const pos = {
                startLine: linesInfo[0][1],
                startColumn: columnsInfo[0][1],
                endLine: undefined,
                endColumn: undefined,
            }
            /* Check line counts length */
            if (linesInfo.length > 1) {
                pos.endLine = linesInfo[1][1]
                pos.endColumn = columnsInfo[1][1]
            }

            const e = editorText.split('\n')
            let validPos = pos.endLine ? pos.endLine : pos.startLine
            validPos = Number(validPos)
            /* Next line exist for showing */
            // console.log(validPos, e, 'validPos')

            if (validPos < e.length) {
                renderedLines.push({
                    index: validPos + 1,
                    description: e[validPos + 1 - 1],
                })
                renderedLines.push({
                    index: validPos,
                    description: e[validPos - 1],
                })
                if (validPos - 1 >= 0)
                    renderedLines.push({
                        index: validPos - 1,
                        description: e[validPos - 1 - 1],
                    })
            } else if (validPos == e.length) {
                /* Next line exist for showing */
                if (validPos - 1 >= 0) {
                    renderedLines.push({
                        index: validPos,
                        description: e[validPos - 1],
                    })
                }
                if (validPos - 2 >= 0) {
                    renderedLines.push({
                        index: validPos - 1,
                        description: e[validPos - 1 - 1],
                    })
                }
                if (validPos - 3 >= 0) {
                    renderedLines.push({
                        index: validPos - 1 - 1,
                        description: e[validPos - 1 - 1 - 1],
                    })
                }
            }

            // console.log(renderedLines, 'renderedLines')

            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning
            )
            const getTokenColor = (token: string) => {
                console.log(token)
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
                return color
            }

            const generateHTMLFromLine = (
                lineIndex: number,
                lineDesc: string
            ) => {
                const t = lineDesc.split(' ')
                let html = ''
                if (pos?.endLine) {
                    if (Number(lineIndex) === Number(pos.endLine)) {
                        let tokensTillNow = ''
                        t.forEach((token) => {
                            if (token !== '') {
                                const chars = token.split('')
                                chars.forEach((char, z) => {
                                    if (
                                        tokensTillNow.length + z + 1 >=
                                            Number(pos.startColumn) &&
                                        tokensTillNow.length + z + 1 <=
                                            Number(pos.endColumn)
                                    ) {
                                        if (char !== ' ') {
                                            html += `<span class="light_creme">${char}</span>`
                                        } else {
                                            html += `<span class="light_creme">&nbsp;</span>`
                                        }
                                    }
                                })
                                html += `<span>&nbsp;</span>`
                            } else {
                                if (
                                    tokensTillNow.length >=
                                        Number(pos.startColumn) &&
                                    tokensTillNow.length <=
                                        Number(pos.endColumn)
                                ) {
                                    html += `<span class="light_creme">&nbsp;</span>`
                                } else {
                                    html += `<span>&nbsp;</span>`
                                }
                                tokensTillNow += 1
                            }
                            tokensTillNow += token
                        })
                    } else {
                        console.log('else', pos?.endLine)
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
                    if (Number(lineIndex) === Number(pos.startLine)) {
                        let tokensTillNow = ''
                        t.forEach((token) => {
                            if (token !== '') {
                                const chars = token.split('')
                                chars.forEach((char, z) => {
                                    if (
                                        tokensTillNow.length + z + 1 >=
                                            Number(pos.startColumn) &&
                                        tokensTillNow.length + z + 1 <=
                                            tokensTillNow.length + token.length
                                    ) {
                                        if (char !== ' ') {
                                            html += `<span class="light_creme">${char}</span>`
                                        } else {
                                            html += `<span class="light_creme">&nbsp;</span>`
                                        }
                                    }
                                })
                                html += `<span>&nbsp;</span>`
                            } else {
                                html += `<span>&nbsp;</span>`
                                tokensTillNow += 1
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

            return {
                generateHTMLFromLine,
                getTokenColor,
                renderedLines,
                isQueryRunning,
                queryErrorObj,
            }
        },
    })
</script>
<style lang="less" scoped>
    .dark_orange {
        color: #e04f1a;
    }
    .error-lines-area {
        min-height: 96px;
    }
    .keep-spaces {
        white-space: pre-wrap;
    }
</style>
<style lang="less">
    .light_creme {
        background-color: #fceee8;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
