<template>
    <div class="mt-3 bg-white border border-gray-200 rounded">
        <AtlanReadme
            v-model="editorValue"
            :is-editing-allowed="true"
            :is-saving="loadingSave"
            :handle-save="handleSave"
            :handle-success="handleSuccess"
            :handle-failure="handleFailure"
            empty-text-if-editing-allowed="Add a README with an overview of your persona."
            empty-text-if-editing-disallowed="Add a README with an overview of your persona."
        />
    </div>
</template>

<script lang="ts">
    import { watch, ref, toRefs } from 'vue'
    import { message } from 'ant-design-vue'
    import {
        savePersona,
        updatedSelectedData,
    } from '../composables/useEditPersona'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default {
        name: 'PersonaReadme',
        props: {
            persona: {
                type: Object,
                required: true,
            },
        },
        emits: ['addReadme'],
        setup(props) {
            const { persona } = toRefs(props)
            const editorValue = ref(persona.value.readme)
            const editor = ref()
            const isEditMode = ref(false)
            const loadingSave = ref(false)
            const isLoading = ref(false)
            watch(persona, () => {
                editorValue.value = persona.value.readme
            })

            const handleSuccess = () => {
                updatedSelectedData({
                    id: persona.value.id,
                    readme: editorValue.value,
                })
                // updateSelectedPersona()
                useAddEvent('governance', 'persona', 'readme_updated', {})
                message.success('The Readme was successfully updated.')
            }

            const handleFailure = (error) => {
                message.error(
                    error?.response?.data?.message ||
                        'Some error occured...Please try again later.'
                )
            }

            const handleUpdatePersonaReadme = (dataEditor) => {
                const payload = { ...persona.value }
                delete payload.dataPolicies
                delete payload.metadataPolicies
                return savePersona({
                    ...payload,
                    readme: dataEditor,
                })
            }

            const handleSave = () => {
                loadingSave.value = true
                handleUpdatePersonaReadme(editorValue.value)
            }
            return {
                isLoading,
                isEditMode,
                editorValue,
                editor,
                loadingSave,
                handleSave,
                handleSuccess,
                handleFailure,
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
