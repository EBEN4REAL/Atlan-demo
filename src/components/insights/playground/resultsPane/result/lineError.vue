<template>
    <!-- Error on running a query -->
    <div class="w-full h-full p-4 errorPanel bg-new-gray-100">
        <div
            class="flex items-center mb-4 text-base font-bold text-new-gray-700"
        >
            <AtlanIcon icon="queryInvalid" class="w-5 h-5" />
            <span class="ml-2"> Invalid Query :( </span>
        </div>
        <div class="flex items-center w-full mb-2">
            <span class="flex flex-wrap w-11/12 text-sm text-new-gray-700">{{
                queryErrorObj.errorMessage
            }}</span>
        </div>
        <div class="w-full p-2 mt-3 bg-white rounded-lg error-lines-area">
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
                    <span class="ml-1 mr-2 noselect" style="color: #a5a5a5">{{
                        item.index
                    }}</span>
                    <!-- :style="`color:${getTokenColor(kt)}`" -->
                    <div
                        class="w-full text-new-gray-700"
                        v-html="
                            generateHTMLFromLine(item.index, item.description)
                        "
                    ></div>
                </div>
            </template>
        </div>
        <div class="flex items-center mt-3 mb-4 text-sm text-new-gray-700">
            <span>Please check your query. </span>
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
        props: {
            queryErrorObj: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { queryErrorObj } = toRefs(props)
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
                        if (linesInfo?.length < 1 || linesInfo[0]?.length < 1)
                            return
                        console.log(linesInfo, 'linesInfo')
                        // debugger
                        /* [["column 4", "4"], ["column 7", "7"]]*/
                        const columnsInfo = [
                            ...queryErrorObj.value.errorMessage.matchAll(
                                columnRegex
                            ),
                        ]
                        // console.log('error: ', queryErrorObj)
                        if (linesInfo.length > 0) {
                            pos.value = {
                                startLine: linesInfo[0][1],
                                startColumn: columnsInfo[0][1],
                                endLine: undefined,
                                endColumn: undefined,
                            }
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
                                html += `<div style="color:${color}" class="text_">`
                                const chars = token.split('')
                                let i = 0
                                
                                for(i; tokensTillNow.length + i + 1<Number(pos.value.startColumn) && i<chars.length; i +=1){
                                    const char = chars[i];
                                    
                                    if (char !== ' ') {
                                        html += char
                                    } else {
                                        html += '&nbsp;'
                                    }
                                }

                                html += '<div class=" squiggly-text text_">'

                                for(i; tokensTillNow.length + i + 1<Number(pos.value.endColumn) && i<chars.length; i +=1){
                                    const char = chars[i];

                                    if (char !== ' ') {
                                        html += char
                                    } else {
                                        html += '&nbsp;'
                                    }
                                }

                                html += '</div>'

                                for(i; i<chars.length; i +=1){
                                    const char = chars[i];

                                    if (char !== ' ') {
                                        html += char
                                    } else {
                                        html += '&nbsp;'
                                    }
                                }

                                // chars.forEach((char, z) => {
                                    
                                //     if (
                                //         tokensTillNow.length + z + 1 >=
                                //             Number(pos.value.startColumn) &&
                                //         tokensTillNow.length + z + 1 <=
                                //             Number(pos.value.endColumn)
                                //     ) {
                                //         if (char !== ' ') {
                                //             html += `<div class="light_creme squiggly-text text_">${char}</div>`
                                //         } else {
                                //             html += `<div style="" class="text_">&nbsp;</div>`
                                //         }
                                //     } else {
                                //         if (char !== ' ') {
                                //             html += `<div style=""  class="text_">${char}</div>`
                                //         } else {
                                //             html += `<div style="" class="text_">&nbsp;</div>`
                                //         }
                                //     }
                                // })

                                html += `<div style="" class="text_">&nbsp;</div>`
                                html += `</div>`
                                tokensTillNow += ' '
                            } else {
                                if (
                                    tokensTillNow.length >=
                                        Number(pos.value.startColumn) &&
                                    tokensTillNow.length <=
                                        Number(pos.value.endColumn)
                                ) {
                                    html += `<div style="" class="squiggly-text text_">&nbsp;</div>`
                                } else {
                                    html += `<div style="" class="text_">&nbsp;</div>`
                                }
                                tokensTillNow += ' '
                            }
                            tokensTillNow += token
                        })
                    } else {

                        t.forEach((token) => {
                            if (token !== '') {
                                const color = getTokenColor(token)
                                html += `<div class="keep-spaces text_" style="color:${color}">${token}&nbsp;</div>`
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

                            if (token !== '') {
                                const chars = token.split('')
                                let i = 0
                                
                                for(i; tokensTillNow.length + i + 1<Number(pos.value.startColumn) && i<chars.length; i +=1){
                                    const char = chars[i];
                                    
                                    if (char !== ' ') {
                                        html += char
                                    } else {
                                        html += '&nbsp;'
                                    }
                                }

                                html += '<div class="light_creme squiggly-text text_">'

                                for(i; tokensTillNow.length + i + 1>=Number(pos.value.startColumn) && i<chars.length; i +=1){
                                    const char = chars[i];

                                    if (char !== ' ') {
                                        html += char
                                    } else {
                                        html += '&nbsp;'
                                    }
                                }

                                html += '</div>'

                                for(i; i<chars.length; i +=1){
                                    const char = chars[i];

                                    if (char !== ' ') {
                                        html += char
                                    } else {
                                        html += '&nbsp;'
                                    }
                                }

                                // chars.forEach((char, z) => {
                                //     if (
                                //         tokensTillNow.length + z + 1 >=
                                //             Number(pos.value.startColumn) &&
                                //         tokensTillNow.length + z + 1 <=
                                //             tokensTillNow.length + token.length
                                //     ) {
                                //         if (char !== ' ') {
                                //             html += `<div style="" class="text_ squiggly-text">${char}</div>`
                                //         } else {
                                //             html += `<div style="" class="text_ squiggly-text">&nbsp;</div>`
                                //         }
                                //     } else {
                                //         if (char !== ' ') {
                                //             html += `<div class="text_" style="" >${char}</div>`
                                //         } else {
                                //             html += `<div class="text_" style="" >&nbsp;</div>`
                                //         }
                                //     }
                                // })
                                
                                html += `<div style="" class="text_">&nbsp;</div>`
                                tokensTillNow += ' '
                            } else {
                                html += `<div style="" class="text_">&nbsp;</div>`
                                tokensTillNow += ' '
                            }
                            tokensTillNow += token
                        })
                    } else {
                        t.forEach((token, i) => {
                            if (token !== '') {
                                const color = getTokenColor(token)
                                html += `<div  class="keep-spaces text_" style="color:${color}">${token}&nbsp;</div>`
                            } else {
                                html += '&nbsp;'
                            }
                        })
                    }
                }
                return html
            }

            const processErrorMessage = () => {

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
                processErrorMessage
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
    .text_ {
        display: inline-block;
    }
    .squiggly-text {
        text-decoration: red wavy underline;
    }
    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
