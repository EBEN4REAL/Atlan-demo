<template>
    <div v-if="user" class="flex flex-col p-4 gap-y-1">
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
            <a-radio v-for="role in roles" :key="role.id" :value="role.id"
                ><span class="capitalize">{{ role.name }}</span>
            </a-radio>
        </a-radio-group>

        <div class="flex items-center justify-between mt-3 gap-x-3">
            <div class="flex-grow"></div>
            <AtlanButton
                color="minimal"
                size="sm"
                padding="compact"
                @click="$emit('close')"
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
<script lang="ts">
    import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'
    import { Users } from '~/services/service/users'
    import useRoles from '~/composables/roles/useRoles'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'ChangeRolePopover',
        components: { AtlanButton },
        props: {
            user: {
                type: Object,
                required: true,
            },
            roleList: {
                type: Array,
                default: () => [],
            },
        },
        emits: ['updateRole', 'errorUpdateRole', 'close'],
        setup(props, context) {
            const { user } = toRefs(props)

            const selectedRole = ref('')
            const updateLoading = ref(false)
            const roles = ref<any[]>([])
            if (!props.roleList || !props.roleList.length) {
                const { roleList } = useRoles()
                watch(roleList, () => {
                    if (roleList && roleList.value) roles.value = roleList.value
                })
            } else roles.value = props.roleList

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
                    },
                    { immediate: true }
                )
            }
            onMounted(() => {
                const roleName =
                    user.value?.role_object?.name.toLowerCase() || ''
                const roleID =
                    props.roleList.find((r) => r.name === roleName)?.id ?? ''
                selectedRole.value = roleID
            })
            return {
                roles,
                selectedRole,
                handleRoleChange,
                updateLoading,
            }
        },
    })
</script>
