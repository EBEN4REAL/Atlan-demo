<template>
    <div class="relative h-full">
        <a-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            layout="vertical"
            class="mb-6"
        >
            <div class="pb-3">
                <a-form-item label="Name" prop="name">
                    <a-input
                        ref="nameRef"
                        v-model:value="formData.name"
                        placeholder="Please enter a name"
                        :loading="isRequestLoading"
                    />
                </a-form-item>
                <a-form-item label="Alias" prop="alias">
                    <a-input
                        v-model:value="formData.alias"
                        placeholder="Please enter an alias"
                        :loading="isRequestLoading"
                    />
                </a-form-item>
                <a-form-item label="Description" prop="description">
                    <a-input
                        v-model:value="formData.description"
                        placeholder="Please enter a description"
                        :loading="isRequestLoading"
                    />
                </a-form-item>
            </div>
        </a-form>
        <div class="absolute bottom-0 flex justify-end w-full py-4 bg-white">
            <a-button
                class="mr-2 border-0 shadow-none"
                type="minimal"
                :disabled="isRequestLoading"
                @click="onCancel"
            >
                Cancel
            </a-button>
            <a-button
                block
                class="w-1/3"
                type="primary"
                :loading="isRequestLoading"
                @click="onSubmit"
            >
                Save
            </a-button>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import { useVModels } from '@vueuse/core'
    import { Groups } from '~/services/service/groups'

    export default {
        name: 'EditGroup',
        components: {},
        props: {
            selectedGroup: {
                type: Object,
                default: () => {},
            },
            isCurrentUser: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['updatedGroup', 'toggleEdit', 'success'],
        setup(props, { emit }) {
            const isRequestLoading = ref(false)
            const updateError = ref('')
            const formRef = ref(null)
            const nameRef = ref(null)

            // const { selectedGroup } = toRefs(props)
            const { selectedGroup } = useVModels(props, emit)
            const formData = ref({
                name: selectedGroup.value.name,
                alias: selectedGroup.value.alias,
                description: selectedGroup.value.description || '',
            })
            const rules = {
                alias: [
                    {
                        required: true,
                        message: 'Please enter a first name.',
                    },
                ],
                name: [
                    {
                        required: true,
                        message: 'Please enter a last name.',
                    },
                ],
            }

            const updateSuccess = ref(false)
            const requestPayload = ref()
            const onSubmit = async () => {
                await formRef.value?.validate()
                const attributes = {
                    description: [formData.value.description],
                    alias: [formData.value.name],
                }
                requestPayload.value = {
                    name: formData.value.alias,
                }
                if (Object.keys(attributes).length > 0) {
                    requestPayload.value = {
                        ...requestPayload.value,
                        attributes,
                    }
                }
                const { data, isReady, error, isLoading } = Groups.UpdateGroup(
                    selectedGroup.value.id,
                    requestPayload
                )

                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        isRequestLoading.value = isLoading.value
                        updateError.value = error.value
                        if (isReady && !error.value && !isLoading.value) {
                            updateSuccess.value = true
                            updateError.value = ''
                            setTimeout(() => {
                                updateSuccess.value = false
                            }, 2000)
                            selectedGroup.value.name = formData.value.name
                            selectedGroup.value.alias = formData.value.alias
                            if (selectedGroup.value.attributes) {
                                selectedGroup.value.attributes.description = [
                                    formData.value.description,
                                ]
                            } else {
                                selectedGroup.value.attributes = {
                                    designation: formData?.value?.description
                                        ? [formData?.value?.description]
                                        : [],
                                }
                            }

                            message.success('The details have been updated')
                            emit('updatedGroup')
                            emit('toggleEdit')
                        } else if (error && error.value) {
                            updateError.value =
                                'Unable to update group details. Please try again.'
                            message.error('Failed to update details.')
                            formRef.value.resetFields()
                        }
                    },
                    { immediate: true }
                )
                updateError.value = ''
            }
            const onCancel = () => {
                formRef.value.resetFields()
                emit('toggleEdit')
            }

            return {
                updateSuccess,
                onSubmit,
                onCancel,
                rules,
                formRef,
                formData,
                isRequestLoading,
                updateError,
                nameRef,
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.$refs.nameRef.focus()
            })
        },
    }
</script>