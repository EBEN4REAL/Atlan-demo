<template>
    <div
        class="relative max-w-full p-4 overflow-x-auto overflow-y-auto rounded"
        :class="background === '' ? 'bg-gray-100' : background"
        style="max-height: 220px"
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
        <div
            class="absolute cursor-pointer top-3 right-3"
            v-if="true"
            @click="handleCopy"
        >
            <AtlanIcon icon="CopyOutlined" class="w-4 h-4 text-gray-500" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed, toRefs, Ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import { format } from 'sql-formatter'
    import { languageTokens } from '~/components/insights/playground/editor/monaco/sqlTokens'
    import { copyToClipboard } from '~/utils/clipboard'

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
            const handleCopy = () => {
                copyToClipboard(formattedText.value)
                message.success('Query Copied!')
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

            return {
                renderedLines,
                enableCopy,
                generateHTMLFromLine,
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
