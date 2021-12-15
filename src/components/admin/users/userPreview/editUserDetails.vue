<template>
    <div class="flex content-center items-center mb-4">
        <p class="text-lg font-bold text-gray-500">Edit user info</p>
    </div>
    <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
    >
        <div class="pb-6 border-solid border-b border-gray-200">
            <div class="flex justify-center">
                <Avatar
                    :avatar-name="`${selectedUser.firstName} ${selectedUser.lastName}`"
                    :allow-upload="true"
                    :avatar-shape="'circle'"
                    :image-url="avatarUrl"
                    :avatar-size="100"
                />
            </div>
                <a-form-item label="First Name" prop="firstName">
                    <a-input
                        v-model:value="formData.firstName"
                        placeholder="Please enter a first name"
                        :loading="isRequestLoading"
                    />
                </a-form-item>
                <a-form-item label="Last Name" prop="lastName">
                    <a-input
                        v-model:value="formData.lastName"
                        placeholder="Please enter a last name"
                        :loading="isRequestLoading"
                    />
                </a-form-item>
                <a-form-item label="Designation" prop="designation">
                    <a-input
                        v-model:value="formData.designation"
                        placeholder="Please enter a designation"
                        :loading="isRequestLoading"
                    />
                </a-form-item>
                <UpdateSkills :user="selectedUser" :allow-update="isCurrentUser" />
        </div>
        <div class="pt-6">
            <p class="uppercase text-gray-500 text-sm">Contact Details</p>
            <div class="mt-4">
                <a-form-item
                    prop="slack"
                >
                    <template #label>
                        Slack
                        <a-popover>
                            <template #content>
                                <div class="p-3 text-gray-500">
                                    <PopOverContent
                                        content="Open a direct message with yourself on Slack in your browser and copy the url. It will look something like this: myorg.slack.com/client/id"
                                    />
                                </div>
                            </template>
                            <AtlanIcon icon="Info" class="h-3 w-3 ml-1" />
                        </a-popover>
                    </template>
                    <a-input
                        v-model:value="formData.slack"
                        class="mt-2"
                        :loading="isRequestLoading"
                        placeholder="https://app.slack.com/client/[workspace]/[client]"
                    >
                        <template #prefix>
                            <span class="border-solid border-gray-300 pr-2 border-r">
                                <AtlanIcon icon="Slack" />
                            </span>
                        </template>
                    </a-input>
                </a-form-item>
            </div>
    <!--        <div class="mt-6">-->
    <!--            <div class="text-gray-500 text-sm">Teams</div>-->
    <!--            <a-input-->
    <!--                v-model:value="formData.teams"-->
    <!--                class="mt-2"-->
    <!--                :loading="isRequestLoading"-->
    <!--            >-->
    <!--                <template #prefix>-->
    <!--                    <span class="border-solid border-gray-300 pr-2 border-r">-->
    <!--                        <AtlanIcon icon="Teams" />-->
    <!--                    </span>-->
    <!--                </template>-->
    <!--            </a-input>-->
    <!--        </div>-->
        </div>
        <div class="w-full sticky bottom-0 pb-6">
            <a-button-group class="w-full">
                <a-button block type="minimal" :disabled="isRequestLoading" @click="onCancel">
                    Cancel
                </a-button>
                <a-button block type="primary" :loading="isRequestLoading" @click="onSubmit">
                    Done
                </a-button>
            </a-button-group>
        </div>
    </a-form>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import UpdateSkills from '~/components/admin/users/userPreview/about/updateSkills.vue'
    import { Users } from '~/services/service/users'
    import Avatar from '@common/avatar/avatar.vue'
    import { message } from 'ant-design-vue'
    import PopOverContent from '~/components/common/formGenerator/popOverContent.vue'

    export default {
        name: 'EditUser',
        components: {
            Avatar,
            UpdateSkills,
            PopOverContent
        },
        props: {
            selectedUser: {
                type: Object,
                default: () => {},
            },
            isCurrentUser: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['updatedUser', 'toggleEdit', 'success', 'changedLoading'],
        setup(props, { emit }) {
            const isRequestLoading = ref(false)
            const updateError = ref("")
            const formRef = ref(null)

            watch(isRequestLoading, (n) => {
                emit('changedLoading', n)
            })
            
            const { selectedUser } = toRefs(props)
            const formData = ref({
                firstName: selectedUser.value.firstName,
                lastName: selectedUser.value.lastName,
                designation: selectedUser.value?.attributes?.designation?.length > 0 ? selectedUser.value?.attributes?.designation[0] : "",
                slack: ""
            })

            const rules = {
                firstName: [{
                    required: true,
                    message: "Please enter a first name."
                }],
                lastName: [{
                    required: true,
                    message: "Please enter a last name."
                }],
                designation: [{
                    message: "Please enter a designation."
                }],
                slack: [{
                    message: "Please enter your Slack User ID.",
                    pattern: /^.+(slack.com).+/g
                }]
            }

            const updateSuccess = ref(false)
            const requestPayload = ref()
            const onSubmit = async () => {
                await formRef.value?.validate()
                const attributes = {}
                if (formData.value.designation.length > 0) {
                    attributes.designation = [formData.value.designation]
                }
                if (formData.value.slack.length > 0) {
                    attributes.profiles = [`[{"slack": "${formData.value.slack}"}]`]
                }
                requestPayload.value = {
                    firstName: formData.value.firstName,
                    lastName: formData.value.lastName,
                }
                if (Object.keys(attributes).length > 0) {
                    requestPayload.value = {
                        ...requestPayload.value,
                        attributes
                    }
                }
                const { data, isReady, error, isLoading } = Users.UpdateUser(
                    selectedUser.value.id,
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
                            message.success('The details have been updated')
                            emit('success')
                            emit('toggleEdit')
                        } else if (error && error.value) {
                            updateError.value =
                                'Unable to update user details. Please try again.'
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

            const avatarUrl = computed(() => `${window.location.origin}/api/service/avatars/${selectedUser.value.username}`)
            return {
                updateSuccess,
                onSubmit,
                onCancel,
                rules,
                formRef,
                formData,
                avatarUrl,
                isRequestLoading,
                updateError
            }
        }
    }
</script>