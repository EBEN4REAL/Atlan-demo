<template>
    <div class="relative h-full">
        <a-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            layout="vertical"
            class="mb-6"
        >
            <div class="pb-3 border-b border-gray-200 border-solid">
                <div class="flex justify-center">
                    <div class="relative flex items-center">
                        <Avatar
                            :avatar-name="`${selectedUser.firstName} ${selectedUser.lastName}`"
                            :allow-upload="true"
                            :avatar-shape="'circle'"
                            :image-url="avatarUrl"
                            :avatar-size="100"
                            @image-updated="handleImageUpdate"
                        />
                    </div>
                </div>
                <a-form-item label="First Name" prop="firstName">
                    <a-input
                        ref="firstNameRef"
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
                <a-form-item label="Skills" prop="skills">
                    <a-select
                        v-model:value="formData.skills"
                        placeholder="Please choose a skill or enter one"
                        :loading="isRequestLoading"
                        mode="tags"
                    >
                        <a-select-option
                            v-for="(skill, index) in formData.skills"
                            :key="index"
                            :value="skill"
                        >
                            {{ skill }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="pt-6">
                <p class="text-sm text-gray-500 uppercase">Contact Details</p>
                <div class="mt-2">
                    <SlackInput
                        v-model="formData.slack"
                        placeholder="Add your slack workspace's member ID"
                        pop-over-content="Go to your slack profile, after clicking on more menu you'll see the member ID. Make sure you're in right slack workspace."
                        warning-text="See if people can reach you"
                    />
                </div>
            </div>
        </a-form>
        <div class="absolute bottom-0 flex justify-end w-full py-2 bg-white">
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
    import Avatar from '@common/avatar/avatar.vue'
    import { message } from 'ant-design-vue'
    import { Users } from '~/services/service/users'
    import SlackInput from '@/admin/common/slackInput.vue'

    export default {
        name: 'EditUser',
        components: {
            Avatar,
            SlackInput,
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
        emits: [
            'updatedUser',
            'toggleEdit',
            'success',
            'changedLoading',
            'imageUpdated',
        ],
        setup(props, { emit }) {
            const isRequestLoading = ref(false)
            const updateError = ref('')
            const formRef = ref(null)
            const firstNameRef = ref(null)

            watch(isRequestLoading, (n) => {
                emit('changedLoading', n)
            })

            const { selectedUser } = toRefs(props)
            const userProfiles = computed(
                () => selectedUser.value?.attributes?.profiles
            )
            const slackProfile = computed(() => {
                if (userProfiles.value?.length > 0) {
                    const firstProfile = JSON.parse(userProfiles.value[0])
                    if (
                        firstProfile &&
                        firstProfile.length > 0 &&
                        firstProfile[0].hasOwnProperty('slack')
                    ) {
                        return firstProfile[0].slack
                    }
                }
                return ''
            })

            const slackEnabled = computed(() => slackProfile.value)
            const slackUrl = computed(() =>
                slackEnabled.value ? slackEnabled.value : ''
            )
            const formData = ref({
                firstName: selectedUser.value.firstName,
                lastName: selectedUser.value.lastName,
                designation:
                    selectedUser.value?.attributes?.designation?.length > 0
                        ? selectedUser.value?.attributes?.designation[0]
                        : '',
                slack: slackUrl.value,
                skills:
                    selectedUser.value.attributes?.skills?.length > 0
                        ? selectedUser.value.attributes.skills
                        : [],
            })

            const rules = {
                firstName: [
                    {
                        required: true,
                        message: 'Please enter a first name.',
                    },
                ],
                lastName: [
                    {
                        required: true,
                        message: 'Please enter a last name.',
                    },
                ],
                designation: [
                    {
                        message: 'Please enter a designation.',
                    },
                ],
                // slack: [
                //     {
                //         message: 'Please enter your Slack User ID.',
                //         pattern: /^.+(slack.com).+/g,
                //     },
                // ],
            }

            const updateSuccess = ref(false)
            const requestPayload = ref()
            const onSubmit = async () => {
                await formRef.value?.validate()
                const attributes = {
                    designation: [formData.value.designation],
                    skills: formData.value.skills,
                }
                attributes.profiles =
                    formData.value.slack.length > 0
                        ? [`[{"slack": "${formData.value.slack}"}]`]
                        : []
                requestPayload.value = {
                    firstName: formData.value.firstName,
                    lastName: formData.value.lastName,
                }
                if (Object.keys(attributes).length > 0) {
                    requestPayload.value = {
                        ...requestPayload.value,
                        attributes,
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
                            selectedUser.value.firstName =
                                formData.value.firstName
                            selectedUser.value.lastName =
                                formData.value.lastName
                            if (selectedUser.value.attributes) {
                                selectedUser.value.attributes.designation = [
                                    formData.value.designation,
                                ]
                                if (formData.value.slack.length > 0) {
                                    selectedUser.value.attributes.profiles = [
                                        `[{"slack": "${formData.value.slack}"}]`,
                                    ]
                                } else {
                                    selectedUser.value.attributes.profiles = []
                                }
                            } else {
                                selectedUser.value.attributes = {
                                    designation: formData?.value?.designation
                                        ? [formData?.value?.designation]
                                        : [],
                                    profiles:
                                        formData.value.slack &&
                                        formData.value.slack.length > 0
                                            ? [
                                                  `[{"slack": "${formData.value.slack}"}]`,
                                              ]
                                            : [],
                                }
                            }

                            message.success('The details have been updated')
                            emit('updatedUser')
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
            const handleImageUpdate = (updatedImageUrl) => {
                emit('imageUpdated', updatedImageUrl)
            }

            const avatarUrl = computed(
                () =>
                    `${window.location.origin}/api/service/avatars/${selectedUser.value.username}`
            )
            return {
                updateSuccess,
                onSubmit,
                onCancel,
                rules,
                formRef,
                formData,
                avatarUrl,
                isRequestLoading,
                updateError,
                handleImageUpdate,
                firstNameRef,
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.$refs.firstNameRef.focus()
            })
        },
    }
</script>
