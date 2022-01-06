<template>
    <a-popover
        v-model:visible="visible"
        :align="{ offset: [-60, 100] }"
        placement="right"
        trigger="click"
        :destroy-tooltip-on-hide="true"
    >
        <template #content>
            <div class="flex flex-col p-4 gap-y-1">
                <h3 class="text-lg font-bold">Change Role</h3>
                <p class="mb-1">
                    {{
                        `Assign a new role for ${
                            user.name || user.username || user.email
                        }`
                    }}
                </p>

                <a-radio-group
                    v-model:value="selectedRole"
                    class="flex flex-col min-w-full mt-1 gap-y-2"
                >
                    <a-radio
                        v-for="role in roles"
                        :key="role.id"
                        :value="role.id"
                        ><span class="capitalize">{{ role.name }}</span>
                    </a-radio>
                </a-radio-group>

                <div class="flex items-center justify-between mt-3 gap-x-3">
                    <div class="flex-grow"></div>
                    <AtlanButton
                        color="minimal"
                        size="sm"
                        padding="compact"
                        @click="handleClickCancel"
                        >Cancel
                    </AtlanButton>
                    <a-button
                        type="primary"
                        :loading="updateLoading"
                        :disabled="!selectedRole"
                        @click="handleRoleChange"
                    >
                        Change
                    </a-button>
                </div>
            </div>
        </template>
        <div
            v-if="user.enabled"
            v-auth="map.UPDATE_USERS"
            class="flex items-center h-8 mr-auto text-center cursor-pointer"
        >
            {{ user.role_object.name }}
            <AtlanIcon
                :icon="visible ? 'ChevronIp' : 'ChevronDown'"
                class="self-center h-3 ml-1 caret-role"
            />
        </div>
    </a-popover>
</template>
<script lang="ts">
    import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'
    import { Users } from '~/services/service/users'
    import useRoles from '~/composables/roles/useRoles'
    import AtlanButton from '@/UI/button.vue'
    import map from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'ChangeRolePopover',
        components: { AtlanButton },
        props: {
            selectedUser: {
                type: Object,
                required: true,
            },
            user: {
                type: Object,
                required: true,
            },
            roleList: {
                type: Array,
                default: () => [],
            },
        },
        emits: ['updateRole', 'errorUpdateRole', 'close', 'handleChangeRole'],
        setup(props, context) {
            const visible = ref(false)
            const { user } = toRefs(props)
            const selectedRole = ref('')
            const updateLoading = ref(false)
            const roles = ref<any[]>([])
            watch(visible, () => {
                if (visible.value) {
                    if (!props.roleList || !props.roleList.length) {
                        const { roleList } = useRoles()
                        watch(roleList, () => {
                            if (roleList && roleList.value) {
                                roles.value = roleList.value
                                const roleName =
                                    user.value?.role_object?.name.toLowerCase() ||
                                    ''
                                const roleID =
                                    props.roleList.find(
                                        (r) => r.name === roleName
                                    )?.id ?? ''
                                selectedRole.value = roleID
                            }
                        })
                    } else {
                        roles.value = props.roleList
                        const roleName =
                            user.value?.role_object?.name.toLowerCase() || ''
                        const roleID =
                            props.roleList.find((r) => r.name === roleName)
                                ?.id ?? ''
                        selectedRole.value = roleID
                    }
                }
            })

            const handleRoleChange = () => {
                const requestPayload = ref({
                    roleId: selectedRole.value,
                })
                const { data, isReady, error, isLoading } =
                    Users.UpdateUserRole(props.user.id, requestPayload)
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        updateLoading.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            context.emit('updateRole')
                        } else if (error && error.value) {
                            context.emit('errorUpdateRole')
                        }
                        visible.value = false
                    },
                    { immediate: true }
                )
            }
            const handleClickCancel = () => {
                visible.value = false
            }
            return {
                roles,
                selectedRole,
                handleRoleChange,
                updateLoading,
                map,
                visible,
                handleClickCancel,
            }
        },
    })
</script>
