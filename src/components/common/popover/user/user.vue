<template>
    <a-popover @visibleChange="handleVisibleChange" placement="left">
        <template #content>
            <div class="user-popover">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3 mt-2">
                        <a-avatar
                            class="text-primary bg-primary-light"
                            size="large"
                            >{{ item[0].toUpperCase() }}</a-avatar
                        >
                        <div>
                            <div class="text-sm font-semibold capitalize">
                                {{ selectedUser.name }}
                            </div>
                            <div class="text-xs text-gray-500">
                                {{ selectedUser.username }}
                            </div>
                        </div>
                    </div>
                    <div
                        class="flex px-2 py-1 tracking-wide text-gray-500 bg-gray-100 border rounded"
                    >
                        {{ selectedUser.workspaceRole }}
                    </div>
                </div>

                <!--  <div v-if="groupList.length > 0" class="mt-3">
                    <div class="text-xs text-gray-500">Groups</div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span
                            v-for="group in groupList"
                            :key="group.id"
                            class="px-2 py-0.5 text-xs border border-gray-300 border-solid rounded-xl capitalize"
                        >
                            {{ group.name }}
                        </span>
                    </div>
                </div>-->

                <div v-if="selectedUser.personaList?.length > 0" class="mt-3">
                    <div class="text-xs text-gray-500">Personas</div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span
                            v-for="persona in selectedUser.personaList"
                            :key="persona"
                            class="flex px-2 py-1 tracking-wide text-gray-500 bg-gray-100 border rounded"
                            >{{ persona }}</span
                        >
                    </div>
                </div>
                <a-button class="mt-3" block @click="handleClickViewUser">
                    View Profile
                    <AtlanIcon icon="Enter" class="ml-1 mb-0.5" />
                </a-button>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { toRefs, computed, watch, ref } from 'vue'
    import getUserGroups from '~/composables/user/getUserGroups'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useUsers } from '~/composables/user/useUsers'
    import usePersonaList from '../persona/usePersonaList'
    import AtlanIcon from '../../icon/atlanIcon.vue'
    import useUserPopover from './composables/useUserPopover'

    export default {
        name: 'PopoverUser',
        components: { AtlanIcon },
        props: {
            item: {
                type: String,
                required: false,
                default: '',
            },
            visible: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: [],
        setup(props) {
            const { item } = toRefs(props)

            const { setUserUniqueAttribute, showUserPreview } = useUserPreview()
            const params = {
                limit: 1,
                offset: 0,
                filter: {
                    $and: [{ username: item.value }],
                },
            }
            const { userList, isLoading, getUserList } = useUsers(params, '')
            const selectedUser = computed(() =>
                userList && userList.value && userList.value.length
                    ? userList.value[0]
                    : {}
            )

            const handleClickViewUser = () => {
                setUserUniqueAttribute(item.value, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }

            const handleVisibleChange = (state) => {
                if (state) {
                    getUserList()
                }
            }

            return {
                selectedUser,
                isLoading,
                handleClickViewUser,
                handleVisibleChange,
                getUserList,
            }
        },
    }
</script>
<style lang="less" scoped>
    .user-popover {
        width: 370px;
        padding: 16px;
    }
</style>
