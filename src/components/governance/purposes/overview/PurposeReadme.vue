<template>
    <div class="p-4 mt-5 bg-white border border-gray-200 rounded">
        <div class="flex items-center justify-between">
            <div>
                <AtlanIcon icon="Readme" class="w-auto h-8 mr-3" />
                <span class="text-base font-bold text-gray"> Readme </span>
            </div>
            <div>
                <a-button
                    v-if="!isEditMode"
                    class="flex items-center"
                    type="primary"
                    :loading="loadingSave"
                    @click="isEditMode = true"
                >
                    <AtlanIcon
                        icon="Edit"
                        class="w-auto h-4 mr-1"
                        :class="{
                            'ml-2': loadingSave,
                        }"
                    />
                    {{ editorValue ? 'Edit' : 'Add a readme' }}
                </a-button>
                <template v-else-if="isEditMode">
                    <a-button @click="handleCancelEdit">Cancel</a-button>
                    <a-button
                        type="primary"
                        class="ml-2"
                        @click="handleAddReadMe"
                        >Save</a-button
                    >
                </template>
            </div>
        </div>
        <div v-if="!isLoading" class="mt-2">
            <Editor
                ref="editor"
                v-model="editorValue"
                placeholder="Type '/' for commands"
                :is-edit-mode="isEditMode"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { watch, ref } from 'vue'
    import Editor from '@/common/editor/index.vue'
    import { Files } from '~/services/service/files/index'

    export default {
        name: 'PurposeReadme',
        components: {
            Editor,
        },
        setup() {
            const editor = ref()
            const isEditMode = ref(false)
            const loadingSave = ref(false)
            const { data, isLoading, mutate } = Files.GetFile({
                id: 'ead02e7b-9277-4efa-b1e0-7458a77663ec',
                name: '7b0254b4-2a6b-4325-85aa-f55ac6db0f70.htm',
            })
            const editorValue = ref('')

            const handleCancelEdit = () => {
                if (editor.value) {
                    editor.value.resetEditor(
                        decodeURIComponent(data.value || '')
                    )
                }
                isEditMode.value = false
                editorValue.value = data.value
            }
            watch(data, () => {
                editorValue.value = data.value
            })
            const handleAddReadMe = () => {
                isEditMode.value = false
                loadingSave.value = true
                const payload = new FormData()
                payload.append('name', 'name')
                payload.append('prefix', 'purpose_readme')
                payload.append('force', false)
                payload.append('excludePrefix', false)
                const htmlRaw = decodeURIComponent(editorValue.value)
                const fileHtml = new Blob([htmlRaw], { type: 'text/html' })
                payload.append('file', fileHtml)
                const { data: dataFile, isLoading } = Files.CreateFile(payload)
                watch(dataFile, () => {
                    loadingSave.value = false
                })
            }
            return {
                isLoading,
                handleAddReadMe,
                handleCancelEdit,
                isEditMode,
                editorValue,
                editor,
                loadingSave,
            }
        },
    }
</script>

<style></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_USERS]
    redirect: false
</route>
