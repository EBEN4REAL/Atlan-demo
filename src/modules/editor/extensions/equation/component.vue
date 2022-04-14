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
                        @keydown.esc="deleteNode"
                        @keydown.enter="handleEnter"
                    />
                    <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
                </div>
            </template>
            <div
                v-if="equationInput && !error"
                ref="renderSpace"
                class="w-full px-3 py-3 text-center rounded"
                :class="selected ? 'bg-blue-100' : 'bg-gray-100'"
            />
            <div
                v-else-if="error"
                ref="renderSpace"
                class="w-full px-3 py-3 text-center rounded bg-red-100"
            >
                <p class="text-center">{{ $t('readme.invalid-equation') }}</p>
            </div>
            <div
                v-else
                ref="renderSpace"
                class="w-full px-3 py-3 text-center rounded bg-gray-100"
            >
                <p class="text-center text-gray-400">
                    {{ $t('readme.equation-placeholder') }}
                </p>
            </div>
        </a-popover>
    </node-view-wrapper>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        nextTick,
        onMounted,
        ref,
        toRefs,
        watch,
    } from 'vue'
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
                node.value?.attrs['data-equation']
            )
            const renderSpace = ref(null)
            const inputSpace = ref(null)
            const error = ref('')
            const popoverVisible = ref(true)
            const renderEquation = () => {
                try {
                    katex.render(equationInput.value, renderSpace.value, {
                        throwOnError: true,
                    })
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
                }
            }
            onMounted(() => {
                setTimeout(inputSpace?.value.focus, 100)
            })
            const handleVisibleChange = (visible) => {
                if (visible) setTimeout(inputSpace?.value.focus, 100)
            }

            const handleInputChange = () => {
                updateAttributes?.value?.({
                    'data-equation': equationInput.value,
                })
                renderEquation()
            }

            const handleEnter = () => {
                popoverVisible.value = false
                editor?.value.commands.focus('end')
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
