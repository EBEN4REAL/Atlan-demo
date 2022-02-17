<template>
    <a-modal
        width="70vw"
        :visible="queryModalVisible"
        :closable="false"
        :body-style="{
            maxHeight: '70vh',
        }"
        ok-text="Done"
        @ok="handleFullScreen"
        @cancel="handleFullScreen"
    >
        <template #footer>
            <a-button type="primary" @click="handleFullScreen">Done</a-button>
        </template>
        <div class="relative px-4 pt-4">
            <div
                class="w-full px-4 py-2 overflow-x-auto overflow-y-auto rounded"
                :class="background === '' ? 'bg-gray-100' : background"
                style="max-height: 65vh"
            >
                <template v-for="(line, i) in renderedLines" :key="i">
                    <div class="flex">
                        <span class="mr-3" style="color: #a5a5a5">{{
                            i + 1
                        }}</span>
                        <!-- :style="`color:${getTokenColor(kt)}`" -->
                        <div
                            v-html="generateHTMLFromLine(i, line)"
                            class="flex flex-wrap"
                        ></div>
                    </div>
                </template>
            </div>
            <div class="absolute flex gap-1 top-5 right-5">
                <div
                    class="px-1 py-0.5 bg-white rounded shadow cursor-pointer"
                    @click="handleCopy"
                >
                    <AtlanIcon
                        icon="CopyOutlined"
                        class="w-4 h-4 text-gray-500"
                    />
                </div>
            </div>
        </div>
    </a-modal>
    <div class="relative">
        <div
            class="max-w-full p-4 overflow-x-auto overflow-y-auto rounded"
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
        </div>
        <div class="absolute flex gap-1 top-3 right-5">
            <div
                class="px-1 py-0.5 bg-white rounded shadow cursor-pointer"
                @click="handleCopy"
            >
                <AtlanIcon icon="CopyOutlined" class="w-4 h-4 text-gray-500" />
            </div>
            <div
                class="px-1 py-0.5 bg-white rounded shadow cursor-pointer"
                @click="handleFullScreen"
            >
                <AtlanIcon icon="FullScreen" class="w-4 h-4 text-gray-500" />
            </div>
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
        name: 'SQLSnippet',
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
            const formattedText = computed(() => {
                try {
                    return format(text.value, {
                        language: 'sql', // Defaults to "sql" (see the above list of supported dialects)
                        indent: '    ', // Defaults to two spaces
                    })
                } catch (error) {
                    return text.value
                }
            })
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

            const queryModalVisible = ref(false)

            const handleFullScreen = () => {
                queryModalVisible.value = !queryModalVisible.value
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
                queryModalVisible,
                handleFullScreen,
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
