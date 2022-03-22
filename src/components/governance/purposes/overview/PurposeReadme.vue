<template>
    <div class="mt-3 bg-white border border-gray-200 rounded">
        <AtlanReadme
            v-model="editorValue"
            :is-editing-allowed="true"
            empty-text-if-editing-allowed="Add a README with an overview of your persona."
            empty-text-if-editing-disallowed="Add a README with an overview of your persona."
            :handle-save="handleSave"
            :handle-success="handleSuccess"
            :handle-failure="handleFailure"
        />
    </div>
</template>

<script lang="ts">
    import { watch, ref, toRefs } from 'vue'
    import { message } from 'ant-design-vue'
    // import { Files } from '~/services/service/files/index'
    import {
        savePersona,
        updatedSelectedData,
    } from '../composables/useEditPurpose'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default {
        name: 'PurposeReadme',
        props: {
            purpose: {
                type: Object,
                required: true,
            },
        },
        emits: ['addReadme'],
        setup(props) {
            const { purpose } = toRefs(props)
            const editorValue = ref(purpose.value.readme || '')
            const editor = ref()
            const isLoading = ref(false)
            watch(purpose, () => {
                editorValue.value = purpose.value.readme || ''
            })

            const handleUpdatePurposeReadme = (dataEditor) => {
                const payload = { ...purpose.value }
                return savePersona({
                    ...payload,
                    readme: dataEditor,
                })
            }

            const handleSuccess = () => {
                updatedSelectedData({
                    id: purpose.value.id,
                    readme: editorValue.value,
                })
                // updateSelectedPersona()
                useAddEvent('governance', 'purpose', 'readme_updated', {})
                message.success('The Readme was successfully updated.')
            }

            const handleFailure = (error) => {
                message.error(
                    error?.response?.data?.message ||
                        'Some error occured...Please try again later.'
                )
            }
            const handleSave = () => {
                handleUpdatePurposeReadme(editorValue.value)
            }
            return {
                isLoading,
                editorValue,
                editor,
                handleSave,
                handleSuccess,
                handleFailure,
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
