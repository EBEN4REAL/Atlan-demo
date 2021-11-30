<template>
    <div
        id="invite-user-modal-content"
        class="relative flex flex-col py-8 px-9"
    >
        <h1 class="mb-4 text-xl font-bold">
            Invite users {{ tenantName ? 'to ' + capitalize(tenantName) : '' }}
        </h1>
        <div
            v-if="groupList?.length"
            class="flex items-center px-2 py-4 rounded bg-blue-50 mb-7"
        >
            <AtlanIcon icon="Info" class="mr-2 text-xs text-gray-500" />
            <span>
                Invited users will be added to default groups.

                <AtlanIcon
                    v-if="[STATES.PENDING].includes(state)"
                    icon="CircleLoader"
                    class="h-3 ml-2 animate-spin"
                />
                <span
                    v-else-if="groupList?.length"
                    class="text-blue-500 underline cursor-pointer"
                    @click="showDefaultGroups = true"
                >
                    View default groups
                </span>
            </span>
        </div>
        <div class="mb-7">
            <div
                v-for="(email, index) in emails"
                :key="index"
                class="relative items-center mb-4 group"
            >
                <div class="relative">
                    <a-input
                        :id="`email-${index}`"
                        v-model:value="email.value"
                        class="inputHeight"
                        placeholder="email"
                        @keyup.enter="onAddNewUser"
                    >
                    </a-input>
                    <a-select
                        v-model:value="email.role"
                        tabindex="-1"
                        class="absolute"
                        dropdown-class-name="border-0 transparent outline-none"
                    >
                        <template #suffixIcon>
                            <AtlanIcon icon="CaretDown" />
                        </template>
                        <a-select-option
                            v-for="role in roleList"
                            :key="role.id"
                            :value="role.name"
                        >
                            <span class="capitalize">{{ role.name }}</span>
                        </a-select-option>
                    </a-select>
                </div>
                <div
                    v-if="emails.length > 1"
                    class="absolute bg-transparent border-0 opacity-0 cursor-pointer top-1 -right-5 group-hover:opacity-100"
                    @click="deleteUserInput(index)"
                >
                    <AtlanIcon
                        icon="Cross"
                        class="text-lg text-gray-400 hover:text-blue-500"
                    />
                </div>
            </div>
            <div id="add-email-button" class="relative items-center group">
                <div class="relative w-100">
                    <a-input
                        class="inputHeight"
                        placeholder="Add email"
                        @focus="onAddNewUser"
                    >
                    </a-input>
                    <a-select
                        v-model:value="defaultRoleOnAdd"
                        class="absolute"
                        dropdown-class-name="border-0 outline-none"
                    >
                        <template #suffixIcon>
                            <AtlanIcon icon="CaretDown" />
                        </template>
                        <a-select-option
                            v-for="role in roleList"
                            :key="role.id"
                            :value="role.name"
                        >
                            <span class="capitalize">{{ role.name }}</span>
                        </a-select-option>
                    </a-select>
                </div>
            </div>
        </div>

        <div class="flex justify-end">
            <div>
                <a-button class="mr-3 border-0" @click="$emit('close')"
                    >Cancel
                </a-button>
                <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="isSubmitInvites"
                    :loading="loading"
                    @click="handleSubmit"
                >
                    Send Invite
                </a-button>
            </div>
        </div>
        <div
            v-if="showDefaultGroups"
            class="absolute w-56 bg-white rounded top-12"
            style="right: -14.5rem"
        >
            <AtlanIcon
                icon="Cross"
                class="absolute h-3.5 cursor-pointer top-1.5 right-1.5"
                @click="showDefaultGroups = false"
            />
            <template v-if="groupList.length">
                <div class="p-4">
                    <h3 class="text-xs text-gray-500">Default groups</h3>
                </div>
                <ul class="px-4">
                    <li
                        v-for="(item, index) in groupList"
                        :key="index"
                        class="mb-4 text-sm"
                    >
                        <p>{{ item.name }}</p>
                        <p class="text-xs truncate">
                            <span class="text-gray-500">@{{ item.alias }}</span>
                            |
                            <span class="text-gray-500"
                                >{{ item.memberCount }} member{{
                                    item.memberCount ? 's' : ''
                                }}</span
                            >
                        </p>
                    </li>
                </ul>
            </template>
            <div v-else class="flex flex-col px-2 py-3 gap-y-1">
                <h2 class="text-sm text-gray-700">
                    No default groups available!
                </h2>
                <div class="text-xs">
                    Visit the
                    <router-link to="/admin/groups" class="text-blue-500"
                        >groups</router-link
                    >
                    page, to mark a group as default.
                </div>
            </div>
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
        reactive,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { Users } from '~/services/service/users/index'
    import useRoles from '~/composables/roles/useRoles'
    import useGroups from '~/composables/group/useGroups'
    import { allRoles } from '~/constant/users'

    export default defineComponent({
        name: 'InviteUsersModal',
        props: { tenantName: { type: String, required: false, default: '' } },
        emits: ['close', 'handleInviteSent'],
        setup(props, context) {
            const defaultRoleOnAdd = ref('member')
            const { roleList } = useRoles()

            const emails = ref([{ ...allRoles.member }])
            const loading = ref(false)
            const isSubmitInvites = computed(() => {
                const reqIndex = emails.value.findIndex((email) => !email.value)
                return reqIndex !== -1
            })
            const groupListAPIParams = reactive({
                limit: 5,
                offset: 0,
                filter: { attributes: { $elemMatch: { isDefault: ['true'] } } },
                // sort: '-created_at',
            })
            const {
                groupList,
                totalGroupsCount,
                filteredGroupsCount,
                STATES,
                state,
            } = useGroups(groupListAPIParams)
            onMounted(() => {
                const newInput = document.getElementById(
                    `email-${emails?.value?.length - 1}`
                )
                if (newInput) newInput.focus()
            })
            const deleteUserInput = (index) => {
                emails.value.splice(index, 1)
                if (!emails.value.length) {
                    emails.value = [{ ...allRoles.member }]
                }
            }
            const onAddNewUser = () => {
                emails.value = [
                    ...emails.value,
                    { ...allRoles[defaultRoleOnAdd.value] },
                ]
            }
            watch(
                emails,
                (newVal, oldVal) => {
                    console.log(newVal.length, oldVal.length)
                    if (newVal.length !== oldVal.length)
                        nextTick(() => {
                            const newInput = document.getElementById(
                                `email-${emails?.value?.length - 1}`
                            )
                            if (newInput) newInput.focus()
                        })
                },
                { deep: true }
            )
            const getRoleId = (email) => {
                console.log(email)
                const roleObj =
                    roleList.value && roleList.value.length
                        ? roleList.value.find(
                              (role) => role.name === email.role
                          )
                        : {}
                return roleObj.id || ''
            }
            const validateEmail = (email) => {
                const re =
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return re.test(String(email).toLowerCase())
            }
            const highLightAsError = (index) => {
                const input = document.getElementById(`email-${index}`)
                if (input) {
                    input.classList.add('border-red-500')
                    input.classList.add('text-red-500')
                    setTimeout(() => {
                        input.classList.remove('border-red-500')
                        input.classList.remove('text-red-500')
                    }, 1000)
                }
            }
            const validateEmails = () => {
                const invalidFields = emails.value.filter(
                    (x) => !validateEmail(x.value)
                )
                emails.value.forEach((x, index) => {
                    const isEmail = validateEmail(x.value)
                    if (!isEmail) {
                        highLightAsError(index)
                    }
                })
                if (invalidFields?.length)
                    message.error(
                        `${invalidFields?.length} invalid email input field${
                            invalidFields?.length ? 's' : ''
                        }`
                    )
                return !invalidFields.length
            }
            const handleSubmit = async (event) => {
                // event.preventDefault() // no need to handle not in a form or lin
                const allValidEmails = validateEmails()
                if (!allValidEmails) return
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
            const capitalize = (string) =>
                string ? string.charAt(0).toUpperCase() + string.slice(1) : ''
            return {
                capitalize,
                roleList,
                emails,
                handleSubmit,
                onAddNewUser,
                deleteUserInput,
                isSubmitInvites,
                loading,
                defaultRoleOnAdd,
                // for fetching groups
                STATES,
                state,
                groupList,
            }
        },
        data() {
            return {
                showDefaultGroups: false,
            }
        },
    })
</script>

<style lang="less">
    #invite-user-modal-content {
        .ant-select {
            top: 3px;
            right: 4px;
        }
        .ant-select-arrow {
            top: 43% !important;
        }
        .ant-select-selector {
            border: none !important;
            outline: none !important;
            background-color: unset;
            box-shadow: none;
        }
    }

    .inputHeight {
        height: 38px;
    }
</style>
