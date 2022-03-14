<template>
    <div class="mt-3 bg-white border border-gray-200 rounded">
        <div class="flex items-center justify-between p-4 border-b">
            <div>
                <AtlanIcon icon="Readme" class="w-auto h-4 mr-3 icon-scale-2" />
                <span class="text-base font-bold text-gray"> Readme </span>
            </div>
            <div>
                <a-button
                    v-if="!isEditMode"
                    class="flex items-center h-3 p-0 border-none text-primary"
                    :loading="loadingSave || isLoading"
                    @click="handleClickModeEdit"
                >
                    <AtlanIcon
                        :icon="readMe ? 'Edit' : 'Add'"
                        class="w-auto h-4 mr-2"
                        :class="{
                            'ml-2': loadingSave || isLoading,
                        }"
                    />
                    {{ readMe ? 'Edit' : 'Add' }}
                </a-button>
                <template v-else-if="isEditMode">
                    <a-button v-if="!loadingSave" @click="handleCancelEdit"
                        >Cancel</a-button
                    >
                    <a-button
                        :loading="loadingSave || isLoading"
                        type="primary"
                        class="ml-2"
                        @click="handleSave"
                    >
                        <AtlanIcon
                            v-if="!loadingSave && !isLoading"
                            icon="Edit"
                            class="w-auto h-4 mr-1"
                            :class="{
                                'ml-2': loadingSave || isLoading,
                            }"
                        />
                        {{
                            loadingSave || isLoading ? 'Saving' : 'Save'
                        }}</a-button
                    >
                </template>
            </div>
        </div>
        <!-- <div v-if="!isLoading" class="mt-2"> -->
        <div class="relative p-4">
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
        updatedSelectedData,
    } from '../composables/useEditPersona'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

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
                    delete payload.glossaryPolicies
                    await savePersona({
                        ...payload,
                        readme: dataEditor,
                    })
                    updatedSelectedData({
                        id: payload.id,
                        readme: dataEditor,
                    })
                    // updateSelectedPersona()
                    loadingSave.value = false
                    isEditMode.value = false
                    useAddEvent('governance', 'persona', 'readme_updated', {})
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
            }

            const handleUpdateReadme = () => {
                handleUpdatePueposeReadme(editorValue.value)
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

<style lang="less">
    .icon-scale-2 {
        transform: scale(2);
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_USERS]
    redirect: false
</route>
