<template>
    <div class>
        <div>
            <div class="flex flex-row items-center cursor-pointer group">
                <p class="mb-0 text-gray-500">
                    Last Name
                    <AtlanIcon
                        v-if="updateSuccess"
                        icon="Approve"
                        class="inline-block h-3 mb-1 ml-1 text-success"
                    />
                </p>
                <p
                    v-if="!isUpdate && allowUpdate"
                    class="mb-0 ml-2 text-xs leading-none transition duration-300 ease-in-out delay-100 opacity-0  text-primary group-hover:opacity-100"
                    @click="onUpdate"
                >
                    edit
                </p>
            </div>
            <div v-if="isUpdate" class="flex flex-col">
                <a-textarea
                    v-model:value="lastNameLocal"
                    placeholder="Last Name"
                    :disabled="updateLoading"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                />
                <div class="flex items-center justify-between max-w-full mt-1">
                    <div>
                        <a-button
                            type="primary"
                            size="small"
                            class="px-2 mr-1"
                            :disabled="updateLoading"
                            @click="handleUpdate"
                            >update</a-button
                        >
                        <a-button
                            type="link"
                            size="small"
                            class="p-0"
                            @click="onCancel"
                            >cancel</a-button
                        >
                    </div>
                    <div>
                        <a-spin v-if="updateLoading" size="small" />
                        <a-popover
                            v-else-if="updateErrorMessage || updateSuccess"
                            placement="bottom"
                        >
                            <template #content>{{
                                updateErrorMessage
                            }}</template>
                            <AtlanIcon
                                icon="ExclaimCircle"
                                class="cursor-pointer text-error"
                            ></AtlanIcon>
                        </a-popover>
                    </div>
                </div>
            </div>
            <div v-else class="text-gray">{{ selectedUser.lastName }}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import { Users } from '~/services/service/users/index'

    export default defineComponent({
        name: 'UpdateLastName',
        props: {
            selectedUser: {
                type: Object,
                default: {},
            },
            allowUpdate: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, context) {
            const isUpdate = ref(false)
            const lastNameLocal = ref(props.selectedUser.lastName)
            const updateErrorMessage = ref('')
            const updateSuccess = ref(false)
            const updateLoading = ref(false)
            const onUpdate = () => {
                lastNameLocal.value = props.selectedUser.lastName
                isUpdate.value = true
            }
            const onCancel = () => {
                lastNameLocal.value = ''
                updateErrorMessage.value = ''
                isUpdate.value = false
            }
            const requestPayload = ref()
            const handleUpdate = () => {
                requestPayload.value = {
                    lastName: lastNameLocal.value,
                }
                const { data, isReady, error, isLoading } = Users.UpdateUser(
                    props.selectedUser.id,
                    requestPayload
                )
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        updateLoading.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            updateSuccess.value = true
                            updateErrorMessage.value = ''
                            props.selectedUser.lastName = lastNameLocal.value
                            isUpdate.value = false
                            setTimeout(() => {
                                updateSuccess.value = false
                            }, 2000)
                        } else {
                            updateErrorMessage.value =
                                'Unable to update last name, please try again.'
                        }
                    },
                    { immediate: true }
                )
            }
            return {
                updateLoading,
                isUpdate,
                lastNameLocal,
                updateErrorMessage,
                updateSuccess,
                onUpdate,
                onCancel,
                handleUpdate,
            }
        },
    })
</script>

<style></style>
