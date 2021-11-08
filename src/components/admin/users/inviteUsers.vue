<template>
    <div
        v-for="(email, index) in emails"
        :key="index"
        class="flex items-center mb-3"
    >
        <a-input
            :id="`email-${index}`"
            v-model:value="email.value"
            @keyup.enter="focusNewInput"
        >
            <template #addonAfter>
                <a-select v-model:value="email.role" style="width: 150px">
                    <a-select-option
                        v-for="role in roleList"
                        :key="role.id"
                        :value="role.name"
                    >
                        <span class="capitalize">{{ role.name }}</span>
                    </a-select-option>
                </a-select>
            </template>
        </a-input>
        <a-button
            v-if="emails.length > 1"
            class="ml-3"
            @click="deleteUserInput(index)"
        >
            <fa icon="fal times"></fa>
        </a-button>
    </div>
    <a-button type="link" class="px-0" @click="onAddNewUser">
        <div class="flex items-center">
            <AtlanIcon icon="Add" class="mr-1.5" />
            <div class="mt-0.5">Add user</div>
        </div>
    </a-button>
    <div class="flex justify-end mt-3">
        <div>
            <a-button
                type="primary"
                html-type="submit"
                :disabled="isSubmitInvites"
                :loading="loading"
                @click="handleSubmit"
                >Invite Users</a-button
            >
        </div>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
        computed,
        watch,
        onMounted,
        nextTick,
    } from 'vue'
    import { message } from 'ant-design-vue'

    import { Users } from '~/services/service/users'
    import useRoles from '~/composables/roles/useRoles'

    export default defineComponent({
        name: 'InviteUsersModal',
        emits: ['handleInviteSent', 'close'],
        setup(props, context) {
            const { roleList } = useRoles()
            const emails = ref([
                {
                    value: '',
                    role: 'member',
                    label: 'Member',
                },
            ])
            const loading = ref(false)
            const isSubmitInvites = computed(() => {
                const reqIndex = emails.value.findIndex((email) => !email.value)
                return reqIndex !== -1
            })
            onMounted(() => {
                const newInput = document.getElementById(
                    `email-${emails?.value?.length - 1}`
                )
                if (newInput) newInput.focus()
            })
            const deleteUserInput = (index) => {
                emails.value.splice(index, 1)
                if (!emails.value.length) {
                    emails.value = [
                        {
                            value: '',
                            role: 'member',
                            label: 'Member',
                        },
                    ]
                }
            }
            const onAddNewUser = () => {
                emails.value = [
                    ...emails.value,
                    {
                        value: '',
                        role: 'member',
                        label: 'Member',
                    },
                ]
            }

            const focusNewInput = () => {
                onAddNewUser()
                nextTick(() => {
                    const newInput = document.getElementById(
                        `email-${emails?.value?.length - 1}`
                    )
                    if (newInput) newInput.focus()
                })
            }

            const getRoleId = (email) => {
                const roleObj =
                    roleList.value && roleList.value.length
                        ? roleList.value.find(
                              (role) => role.name === email.role
                          )
                        : {}

                return roleObj.id || ''
            }
            const handleSubmit = async (event) => {
                event.preventDefault()
                const requestPayload = ref({
                    users: emails.value.map((email) => ({
                        email: email.value,
                        roleName: `$${email.role}`,
                        roleId: getRoleId(email),
                    })),
                })
                const { data, isReady, error, isLoading } =
                    Users.InviteUsers(requestPayload)
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        loading.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            context.emit('handleInviteSent')
                            message.success('Invites sent')
                        } else if (error && error.value) {
                            message.error('Failed to send invites, try again')
                            context.emit('close')
                        }
                    },
                    { immediate: true }
                )
            }
            return {
                roleList,
                focusNewInput,
                emails,
                handleSubmit,
                onAddNewUser,
                deleteUserInput,
                isSubmitInvites,
                loading,
            }
        },
    })
</script>
