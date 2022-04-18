<template>
    <node-view-wrapper>
        <a-popover
            v-model:visible="popoverVisible"
            placement="bottomLeft"
            trigger="click"
            @visible-change="handleVisibleChange"
            @click="
                () => {
                    popoverVisible = !popoverVisible
                }
            "
        >
            <template #content>
                <div class="p-3 w-64">
                    <a-input
                        ref="inputSpace"
                        v-model:value="equationInput"
                        type="text"
                        placeholder="E = mc ^ 2"
                        :disabled="!editor.isEditable"
                        @change="handleInputChange"
                        @keydown.esc.stop="deleteNode"
                        @keydown.enter="handleEnter"
                    />
                    <p v-if="error" class="text-red-600 mt-2 break-words">
                        {{ error }}
                    </p>
                </div>
            </template>
            <div
                ref="renderSpace"
                class="w-full px-3 py-3 text-center rounded"
                :class="{
                    'bg-blue-100':
                        editor?.isEditable && selected && error.length === 0,
                    'bg-red-100': error.length > 0,
                    'bg-gray-100': error.length === 0,
                }"
            />
        </a-popover>
    </node-view-wrapper>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, ref, toRefs } from 'vue'
    import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
    import katex from 'katex'

    export default defineComponent({
        components: {
            NodeViewWrapper,
        },
        props: { ...nodeViewProps },
        setup(props) {
            const {
                selected,
                deleteNode,
                extension,
                updateAttributes,
                node,
                editor,
            } = toRefs(props)

            const options = computed(() => extension.value?.options)
            const equationInput = ref<string>(
                node.value?.attrs['data-equation'] || ''
            )
            const renderSpace = ref(null)
            const inputSpace = ref(null)
            const error = ref('')
            const popoverVisible = ref(editor?.value?.isEditable)
            const renderEquation = () => {
                try {
                    if (equationInput.value.length === 0) {
                        renderSpace.value.innerHTML = `<p class='text-center text-gray-400'>Type in some math</p>`
                    } else {
                        katex.render(equationInput.value, renderSpace.value, {
                            throwOnError: true,
                        })
                    }
                    error.value = ''
                } catch (e) {
                    if (e instanceof katex.ParseError) {
                        error.value = `Error: ${e.message}`
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace('KaTeX parse error: ', '')
                    } else {
                        error.value = e.message
                    }
                    renderSpace.value.innerHTML = `<p class='text-center'>Invalid equation</p>`
                }
            }
            onMounted(() => {
                if (editor?.value?.isEditable)
                    setTimeout(() => {
                        inputSpace?.value?.focus()
                    }, 100)
                renderEquation()
            })

            const handleVisibleChange = (visible) => {
                if (visible && editor?.value?.isEditable)
                    setTimeout(inputSpace?.value?.focus, 100)
            }

            const handleInputChange = () => {
                updateAttributes?.value?.({
                    'data-equation': equationInput.value,
                })
                renderEquation()
            }

            const handleEnter = () => {
                popoverVisible.value = false
                editor?.value?.commands.focus('end')
            }

            return {
                equationInput,
                deleteNode,
                selected,
                options,
                updateAttributes,
                handleInputChange,
                renderSpace,
                renderEquation,
                editor,
                inputSpace,
                error,
                handleVisibleChange,
                popoverVisible,
                handleEnter,
            }
        },
    })
</script>
