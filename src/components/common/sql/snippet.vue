<template>
    <div
        class="p-4 overflow-x-hidden overflow-y-auto bg-gray-100 rounded"
        style="height: 220px"
    >
        <template v-for="(line, i) in renderedLines" :key="i">
            <div class="flex">
                <span class="mr-3" style="color: #a5a5a5">{{ i + 1 }}</span>
                <!-- :style="`color:${getTokenColor(kt)}`" -->
                <div
                    class="flex flex-wrap"
                    v-html="generateHTMLFromLine(i, line)"
                ></div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed, toRefs, Ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import { languageTokens } from '~/components/insights/playground/editor/monaco/sqlTokens'
    import { format } from 'sql-formatter'

    export default defineComponent({
        name: 'SQL Snippet',
        components: {},
        props: {
            text: {
                type: String,
                default: '',
            },
        },
        setup(props, { emit }) {
            const { text } = toRefs(props)
            const formattedText = computed(() =>
                format(text.value, {
                    language: 'sql', // Defaults to "sql" (see the above list of supported dialects)
                    indent: '    ', // Defaults to two spaces
                })
            )
            const renderedLines = computed(() =>
                formattedText.value.split('\n')
            )

            const getTokenColor = (token: string) => {
                /* Noram gray color */
                let color = '#3E4359'
                if (languageTokens.keywords.includes(token)) {
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
                const commentStack = []

                let html = ''
                t.forEach((token, i) => {
                    if (token.includes('/*')) {
                        commentStack.push(true)
                        html += `<div class="keep-spaces" style="color:#028103">${token}&nbsp;</div>`
                    } else if (token.includes('*/')) {
                        commentStack.pop()
                        html += `<div class="keep-spaces" style="color:#028103">${token}&nbsp;</div>`
                    } else if (token !== '') {
                        /* Comment detected */
                        if (commentStack.length > 0) {
                            html += `<div class="keep-spaces" style="color:#028103">${token}&nbsp;</div>`
                        } else {
                            const color = getTokenColor(token)
                            html += `<div class="keep-spaces" style="color:${color}">${token}&nbsp;</div>`
                        }
                    } else {
                        html += '&nbsp;'
                    }
                })
                return html
            }

            return { renderedLines, generateHTMLFromLine }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped>
    .keep-spaces {
        white-space: pre-wrap;
    }
</style>
