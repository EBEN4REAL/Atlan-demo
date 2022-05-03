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
            <a-form ref="formRef" layout="vertical" class="" :model="formState">
                <div
                    v-for="(email, name) in formState"
                    :key="name"
                    class="relative items-center mb-4 group"
                >
                    <div class="relative">
                        <a-form-item
                            :name="[name, 'value']"
                            :rules="emailRule"
                            validate-first
                        >
                            <a-input
                                :id="`email-${name}`"
                                v-model:value="email.value"
                                class="inputHeight"
                                placeholder="Email"
                                @keyup.enter="onAddNewUser"
                                @change="triggerValidate"
                            >
                            </a-input>
                        </a-form-item>
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
                        v-if="Object.keys(formState).length > 1"
                        class="absolute bg-transparent border-0 opacity-0 cursor-pointer top-2 -right-5 group-hover:opacity-100"
                        @click="deleteUserInput(name)"
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
                            placeholder="Email"
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
            </a-form>
        </div>

        <div class="flex justify-end">
            <div>
                <a-button class="mr-3 border-0" @click="$emit('close')"
                    >Cancel
                </a-button>
                <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="disableSubmit"
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
                        >groups
                    </router-link>
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
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'InviteUsersModal',
        props: { tenantName: { type: String, required: false, default: '' } },
        emits: ['close', 'handleInviteSent'],
        setup(props, context) {
            const defaultRoleOnAdd = ref('member')
            const { roleList } = useRoles()

            const disableSubmit = ref(true)
            const formRef = ref()
            const formState = ref({
                [new Date().getTime()]: { ...allRoles.member },
            })
            const triggerValidate = async () => {
                try {
                    const validationStatus = await formRef.value.validate()
                    disableSubmit.value = false
                } catch (e) {
                    disableSubmit.value = true
                }
            }

            /** Validating if current email has already been added above */
            const validator = async (_rule, value: string) => {
                const valueArray: string[] = []
                const { field } = _rule
                const entries = Object.entries(formState.value)
                let x = 0
                for (x = 0; x < entries.length; x += 1) {
                    const [k, state] = entries[x]
                    if (field.includes(k)) break
                    else valueArray.push(state.value)
                }
                if (valueArray.includes(value))
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject('Duplicate email')
                return Promise.resolve()
            }

            const emailRule = ref([
                {
                    required: true,
                    message: 'Please enter a valid email',
                    type: 'email',
                    trigger: ['submit'],
                },
                {
                    required: true,
                    message: 'Duplicate email',
                    type: 'email',
                    validator,
                    trigger: ['submit'],
                },
            ])

            const loading = ref(false)
            const groupListAPIParams = reactive({
                limit: 5,
                offset: 0,
                filter: { attributes: { $elemMatch: { isDefault: ['true'] } } },
                // sort: '-created_at',
            })
            const { groupList, STATES, state } = useGroups(groupListAPIParams)
            onMounted(() => {
                const newInput = document.getElementById(
                    `email-${
                        Object.keys(formState.value)[
                            Object.keys(formState?.value).length - 1
                        ]
                    }`
                )
                if (newInput) newInput.focus()
            })

            const deleteUserInput = (id) => {
                delete formState.value[id]
                if (!Object.keys(formState.value).length) {
                    formState.value = {
                        [new Date().getTime()]: { ...allRoles.member },
                    }
                }
                nextTick(() => {
                    triggerValidate()
                })
            }

            const onAddNewUser = () => {
                formState.value[new Date().getTime()] = {
                    ...allRoles[defaultRoleOnAdd.value],
                }
            }

            watch(
                () => Object.keys(formState.value),
                () => {
                    nextTick(() => {
                        const newInput = document.getElementById(
                            `email-${
                                Object.keys(formState.value)[
                                    Object.keys(formState?.value).length - 1
                                ]
                            }`
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

            const handleSubmit = async (event) => {
                const requestPayload = ref({
                    users: Object.values(formState.value).map((email) => ({
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
                            useAddEvent('admin', 'user', 'added', {
                                count: Object.keys(formState.value).length,
                            })
                        } else if (error && error.value) {
                            // Since there might be errors associated with more
                            // than one email address, we display all of them.
                            const keys = Object.keys(
                                error.value.response.data ?? {}
                            )
                            for (let i = 0; i < keys.length; i += 1) {
                                message.error(
                                    `${keys[i]}: ${
                                        error.value.response.data[keys[i]]
                                    }`
                                )
                            }
                            context.emit('close')
                        }
                    },
                    { immediate: true }
                )
            }

            const capitalize = (string) =>
                string ? string.charAt(0).toUpperCase() + string.slice(1) : ''

            return {
                triggerValidate,
                formRef,
                emailRule,
                formState,
                capitalize,
                roleList,
                handleSubmit,
                onAddNewUser,
                deleteUserInput,
                disableSubmit,
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
