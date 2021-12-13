<template>
    <div class="flex content-center items-center mb-4">
        <p class="text-lg font-bold text-gray-500">Edit user info</p>
        <div class="ml-auto flex">
            <a-button class="border-0 shadow-none" :disabled="isRequestLoading" @click="onCancel">
                Cancel
            </a-button>
            <a-button type="primary" :loading="isRequestLoading" @click="onSubmit">
                Done
            </a-button>
        </div>
    </div>
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
        <a-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            layout="vertical"
        >
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
            <a-form-item label="Role" prop="role">
                <a-select
                    v-model:value="formData.role"
                    :loading="isRequestLoading"
                >
                    <a-select-option
                        v-for="role in roles"
                        :key="role.id"
                        :value="role.id"
                    >
                        <span class="capitalize">
                            {{ role.name }}
                        </span>
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="Designation" prop="designation">
                <a-input
                    v-model:value="formData.designation"
                    placeholder="Please enter a designation"
                    :loading="isRequestLoading"
                />
            </a-form-item>
            <UpdateSkills :user="selectedUser" :allow-update="isCurrentUser" />
        </a-form>
    </div>
    <div class="py-6">
        <p class="uppercase text-gray-500 text-sm">Contact Details</p>
        <div class="mt-4">
            <div class="text-gray-500 text-sm">Slack</div>
            <a-input
                v-model:value="formData.slack"
                class="mt-2"
                :loading="isRequestLoading"
            >
                <template #prefix>
                    <span class="border-solid border-gray-300 pr-2 border-r">
                        <AtlanIcon icon="Slack" />
                    </span>
                </template>
            </a-input>
        </div>
        <div class="mt-6">
            <div class="text-gray-500 text-sm">Teams</div>
            <a-input
                v-model:value="formData.slack"
                class="mt-2"
                :loading="isRequestLoading"
            >
                <template #prefix>
                    <span class="border-solid border-gray-300 pr-2 border-r">
                        <AtlanIcon icon="Teams" />
                    </span>
                </template>
            </a-input>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, DefineComponent, defineComponent, onMounted, ref, toRefs, watch } from 'vue'
    import UpdateSkills from '~/components/admin/users/userPreview/about/updateSkills.vue'
    import { Users } from '~/services/service/users'
    import useRoles from '~/composables/roles/useRoles'
    import Avatar from '@common/avatar/avatar.vue'

    export default defineComponent({
        name: 'EditUser',
        components: {
            Avatar,
            UpdateSkills,
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
            
            const { selectedUser } = toRefs(props)
            const { roleList } = useRoles()

            const formData = ref({
                firstName: selectedUser.value.firstName,
                lastName: selectedUser.value.lastName,
                role: selectedUser.value.role_object.name,
                designation: selectedUser.value?.attributes?.designation[0] ?? "",
                slack: "",
                teams: ""
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
                role: [{
                    required: true,
                    message: "Please select a role."
                }],
                designation: [{
                    message: "Please enter a designation."
                }],
                slack: [{
                    message: "Please enter your Slack User ID."
                }],
                teams: [{
                    message: "Please enter your Teams user ID."
                }]
            }

            const updateSuccess = ref(false)
            const requestPayload = ref()
            const onSubmit = async () => {
                await formRef.value?.validate()
                const attributes = {
                    designation: [formData.value.designation],
                }
                // if (formData.value.slack.length > 0) {
                //     attributes.slack = "{}"
                // }
                requestPayload.value = {
                    firstName: formData.value.firstName,
                    lastName: formData.value.lastName,
                    roleId: formData.value.role,
                    attributes: {
                        designation: [formData.value.designation],
                    },
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
                        } else if (error && error.value) {
                            updateError.value =
                                'Unable to update user details. Please try again.'
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

            const avatarUrl = computed(() => `${window.location.origin}/api/services/avatar/${selectedUser.value.username}`)
            return {
                updateSuccess,
                onSubmit,
                onCancel,
                rules,
                formRef,
                formData,
                roles: roleList,
                avatarUrl,
                isRequestLoading,
                updateError
            }
        }
    })
</script>

<style scoped>

</style>