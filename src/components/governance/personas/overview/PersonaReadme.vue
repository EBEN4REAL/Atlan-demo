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
                    :loading="loadingSave || isLoading"
                    @click="isEditMode = true"
                >
                    <AtlanIcon
                        icon="Edit"
                        class="w-auto h-4 mr-1"
                        :class="{
                            'ml-2': loadingSave || isLoading,
                        }"
                    />
                    {{ readMeId ? 'Edit' : 'Add a readme' }}
                </a-button>
                <template v-else-if="isEditMode">
                    <a-button @click="handleCancelEdit">Cancel</a-button>
                    <a-button type="primary" class="ml-2" @click="handleSave"
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
        <div v-else class="h-12" />
    </div>
</template>

<script lang="ts">
    import { watch, ref, toRefs, onMounted, computed } from 'vue'
    import { message } from 'ant-design-vue'
    import Editor from '@/common/editor/index.vue'
    import { Files } from '~/services/service/files/index'
    import {
        savePersona,
        updateSelectedPersona,
    } from '../composables/useEditPersona'

    export default {
        name: 'PersonaReadme',
        components: {
            Editor,
        },
        props: {
            persona: {
                type: Object,
                required: true,
            },
        },
        emits: ['addReadme'],
        setup(props, { emit }) {
            const { persona } = toRefs(props)
            const readMeId = computed(() => persona.value.readme || '')
            const editor = ref()
            const isEditMode = ref(false)
            const loadingSave = ref(false)
            const editorValue = ref('')
            const { data, isLoading, mutate } = Files.GetFile({
                id: readMeId.value,
                // name: '7b0254b4-2a6b-4325-85aa-f55ac6db0f70.htm',
            })
            const fetchReadme = () => {
                if (readMeId.value) {
                    mutate()
                }
            }
            watch(persona, () => {
                editor.value.resetEditor(decodeURIComponent(''))
                editorValue.value = ''
                fetchReadme()
            })
            onMounted(() => {
                fetchReadme()
            })
            const resetEditor = () => {
                const editorValueDefault = readMeId.value
                    ? Object.keys(data.value).length
                        ? data.value
                        : ''
                    : ''
                editor.value.resetEditor(decodeURIComponent(editorValueDefault))
                editorValue.value = editorValueDefault
            }
            const handleCancelEdit = () => {
                isEditMode.value = false
                editor.value.resetEditor(decodeURIComponent(data.value || ''))
                editorValue.value = data.value || ''
            }
            watch(data, () => {
                editorValue.value = data.value
            })
            const handleUpdatePueposeReadme = async (id) => {
                try {
                    await savePersona({
                        ...persona.value,
                        readme: id,
                    })
                    updateSelectedPersona()
                } catch (error) {
                    message.error(
                        error?.response?.data?.message ||
                            'Some error occured...Please try again later.'
                    )
                }
            }
            const handleAddReadMe = () => {
                const { data: dataFile } = Files.CreateFile(editorValue.value)
                watch(dataFile, () => {
                    const idFile = dataFile.value.id
                    handleUpdatePueposeReadme(idFile)
                    loadingSave.value = false
                })
            }
            const handleUpdateReadme = () => {
                const {
                    data: dataFile,
                    isLoading: loadingUpdate,
                    error,
                } = Files.UpdateFile(editorValue.value, readMeId.value)
                watch(error, () => {
                    resetEditor()
                    loadingSave.value = false
                    message.error(
                        error?.response?.data?.message ||
                            'Some error occured...Please try again later.'
                    )
                })
                watch(dataFile, () => {
                    loadingSave.value = false
                })
            }
            const handleSave = () => {
                isEditMode.value = false
                loadingSave.value = true
                if (readMeId.value) {
                    handleUpdateReadme()
                } else {
                    handleAddReadMe()
                }
            }
            return {
                isLoading,
                handleAddReadMe,
                handleCancelEdit,
                isEditMode,
                editorValue,
                editor,
                loadingSave,
                readMeId,
                handleSave,
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
