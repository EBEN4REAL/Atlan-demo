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
                    @click="handleClickModeEdit"
                >
                    <AtlanIcon
                        icon="Edit"
                        class="w-auto h-4 mr-1"
                        :class="{
                            'ml-2': loadingSave || isLoading,
                        }"
                    />
                    {{ readMe ? 'Edit' : 'Add a readme' }}
                </a-button>
                <template v-else-if="isEditMode">
                    <a-button @click="handleCancelEdit">Cancel</a-button>
                    <a-button
                        :loading="loadingSave || isLoading"
                        type="primary"
                        class="ml-2"
                        @click="handleSave"
                    >
                        <AtlanIcon
                            icon="Edit"
                            class="w-auto h-4 mr-1"
                            :class="{
                                'ml-2': loadingSave || isLoading,
                            }"
                        />
                        Save</a-button
                    >
                </template>
            </div>
        </div>
        <!-- <div v-if="!isLoading" class="mt-2"> -->
        <div class="relative">
            <div
                v-if="!editorValue && !isEditMode"
                class="absolute top-0 z-10 my-2 text-sm text-gray-500"
            >
                <!-- {{
                    isEditMode
                        ? 'Add a README with an overview of your asset.'
                        : `Readme hasn't been added for this asset.`
                }} -->
                Add a README with an overview of your persona.
            </div>
            <Editor
                ref="editor"
                v-model="editorValue"
                placeholder="Type '/' for commands"
                :is-edit-mode="isEditMode"
                class="py-2"
            />
        </div>
        <!-- </div> -->
        <!-- <div v-else class="h-12" /> -->
    </div>
</template>

<script lang="ts">
    import { watch, ref, toRefs, onMounted, computed } from 'vue'
    import { message } from 'ant-design-vue'
    import Editor from '@/common/editor/index.vue'
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
            const readMe = computed(() => {
                if (decodeURIComponent(persona.value.readme) === '<p></p>') {
                    return ''
                }
                return persona.value.readme || ''
            })
            const editor = ref()
            const isEditMode = ref(false)
            const loadingSave = ref(false)
            const editorValue = ref('')
            const isLoading = ref(false)
            // const defaultValueEditor = ref({})
            // const resetEditor = () => {
            //     const editorValueDefault = readMe.value
            //         ? Object.keys(defaultValueEditor.value).length
            //             ? defaultValueEditor.value
            //             : ''
            //         : ''
            //     editor.value.resetEditor(decodeURIComponent(editorValueDefault))
            //     editorValue.value = editorValueDefault
            // }
            // const mutateReadme = () => {
            //     isLoading.value = true
            //     const {
            //         data,
            //         isLoading: loadingMutate,
            //         mutate,
            //     } = Files.GetFile({
            //         id: readMe.value,
            //         // name: '7b0254b4-2a6b-4325-85aa-f55ac6db0f70.htm',
            //     })
            //     mutate()
            //     watch(loadingMutate, () => {
            //         isLoading.value = loadingMutate.value
            //     })
            //     watch(data, () => {
            //         editorValue.value = data.value
            //         defaultValueEditor.value = data.value
            //         resetEditor()
            //         isLoading.value = false
            //     })
            // }
            // const fetchReadme = () => {
            //     loadingSave.value = false
            //     isLoading.value = false
            //     if (readMe.value) {
            //         mutateReadme()
            //     }
            // }
            const handleSetValueEditor = () => {
                editor.value.resetEditor(decodeURIComponent(readMe.value || ''))
                editorValue.value = decodeURIComponent(readMe.value || '')
            }
            watch(persona, () => {
                handleSetValueEditor()
                // fetchReadme()
            })
            onMounted(() => {
                handleSetValueEditor()
                // fetchReadme()
            })
            const handleCancelEdit = () => {
                isEditMode.value = false
                editor.value.resetEditor(decodeURIComponent(readMe.value || ''))
                editorValue.value = decodeURIComponent(readMe.value || '')
                // editor.value.resetEditor(decodeURIComponent(data.value || ''))
                // editorValue.value = data.value || ''
            }

            const handleUpdatePueposeReadme = async (dataEditor) => {
                try {
                    const payload = { ...persona.value }
                    delete payload.dataPolicies
                    delete payload.metadataPolicies
                    await savePersona({
                        ...payload,
                        readme: dataEditor,
                    })
                    updateSelectedPersona()
                    loadingSave.value = false
                    isEditMode.value = false
                } catch (error) {
                    loadingSave.value = false
                    isEditMode.value = false
                    message.error(
                        error?.response?.data?.message ||
                            'Some error occured...Please try again later.'
                    )
                }
            }
            const handleAddReadMe = () => {
                handleUpdatePueposeReadme(editorValue.value)
                // const { data: dataFile } = Files.CreateFile(editorValue.value)
                // watch(dataFile, () => {
                //     const idFile = dataFile.value.id
                //     handleUpdatePueposeReadme(idFile)
                //     loadingSave.value = false
                // })
            }
            const handleUpdateReadme = () => {
                handleUpdatePueposeReadme(editorValue.value)
                // const {
                //     data: dataFile,
                //     isLoading: loadingUpdate,
                //     error,
                // } = Files.UpdateFile(editorValue.value, readMe.value)
                // watch(error, () => {
                //     resetEditor()
                //     loadingSave.value = false
                //     message.error(
                //         error?.response?.data?.message ||
                //             'Some error occured...Please try again later.'
                //     )
                // })
                // watch(dataFile, () => {
                //     loadingSave.value = false
                // })
            }
            const handleSave = () => {
                loadingSave.value = true
                if (readMe.value) {
                    handleUpdateReadme()
                } else {
                    handleAddReadMe()
                }
            }
            const handleClickModeEdit = () => {
                isEditMode.value = true
            }
            return {
                isLoading,
                handleAddReadMe,
                handleCancelEdit,
                isEditMode,
                editorValue,
                editor,
                loadingSave,
                readMe,
                handleSave,
                handleClickModeEdit,
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
