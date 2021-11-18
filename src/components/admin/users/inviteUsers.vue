<template>
    <div
        id="invite-user-modal-content"
        class="relative flex flex-col mx-4 gap-y-5"
    >
        <h1 class="text-xl font-bold">
            Invite users {{ tenantName ? 'to ' + capitalize(tenantName) : '' }}
        </h1>
        <div class="flex items-center px-2 py-4 rounded bg-blue-50">
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
                    @mouseover="showDefaultGroups = true"
                    @mouseleave="showDefaultGroups = false"
                >
                    View default groups
                </span>
            </span>
        </div>
        <div>
            <div
                v-for="(email, index) in emails"
                :key="index"
                class="relative items-center mb-3 group"
            >
                <div class="relative w-100">
                    <a-input
                        :id="`email-${index}`"
                        v-model:value="email.value"
                        @keyup.enter="onAddNewUser"
                    >
                    </a-input>
                    <a-select
                        v-model:value="email.role"
                        tabindex="-1"
                        size="small"
                        class="absolute"
                        dropdown-class-name="border-0 outline-none"
                        style="width: 120px"
                    >
                        <a-select-option
                            v-for="role in roleList"
                            :key="role.id"
                            :value="role.name"
                            ><span class="capitalize">{{
                                role.name
                            }}</span></a-select-option
                        >
                    </a-select>
                </div>
                <div
                    v-if="emails.length > 1"
                    class="absolute bg-transparent border-0 opacity-0 cursor-pointer  top-1 -right-5 group-hover:opacity-100"
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
                    <a-input placeholder="Add email" @focus="onAddNewUser">
                    </a-input>
                    <a-select
                        v-model:value="defaultRoleOnAdd"
                        size="small"
                        class="absolute"
                        dropdown-class-name="border-0 outline-none"
                        style="width: 120px"
                    >
                        <a-select-option
                            v-for="role in roleList"
                            :key="role.id"
                            :value="role.name"
                            ><span class="capitalize">{{
                                role.name
                            }}</span></a-select-option
                        >
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
                    >Invite Users
                </a-button>
            </div>
        </div>
        <div
            v-if="showDefaultGroups"
            class="absolute w-56 bg-white rounded top-12"
            style="right: -17rem"
        >
            <div class="p-4">
                <h3 class="text-sm text-gray-500">Default groups</h3>
            </div>
            <ul class="px-4">
                <li
                    v-for="(item, index) in groupList"
                    :key="index"
                    class="mb-4"
                >
                    <p>{{ item.name }}</p>
                    <p class="text-sm truncate">
                        <span class="text-gray-500">@{{ item.alias }}</span> |
                        <span class="text-gray-500"
                            >{{ item.memberCount }} member{{
                                item.memberCount ? 's' : ''
                            }}</span
                        >
                    </p>
                </li>
            </ul>
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
        ComputedRef,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { Users } from '~/services/service/users/index'
    import useRoles from '~/composables/roles/useRoles'
    import useGroups from '~/composables/group/useGroups'
    import { useTenantStore } from '~/store/tenant'

    export default defineComponent({
        name: 'InviteUsersModal',
        emits: ['close', 'handleInviteSent'],
        setup(props, context) {
            const tenantStore = useTenantStore()
            const tenantName: ComputedRef<string> = computed(
                () => tenantStore.getTenant?.displayName ?? ''
            )
            const defaultRoleOnAdd = ref('member')
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
                tenantName,
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
            top: 4px;
            right: 4px;
        }
        .ant-select-selector {
            border: none !important;
            outline: none !important;
            background-color: unset;
        }
    }
</style>
