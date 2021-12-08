<template>
    <a-popover>
        <template #content>
            <div class="user-popover">
                <div class="flex justify-between">
                    <div class="flex items-center">
                        <AtlanIcon icon="User" class="mr-1 mb-0.5" />
                        <span class="uppercase">user</span>
                    </div>
                    <div
                        v-if="admin"
                        class="
                            flex
                            items-center
                            px-1.5
                            text-gray-500
                            bg-gray-100
                            border border-gray-300 border-solid
                            rounded
                        "
                    >
                        {{ admin }}
                    </div>
                </div>
                <div class="flex items-center gap-3 mt-2">
                    <a-avatar class="text-primary bg-primary-light" size="large">{{ item[0].toUpperCase() }}</a-avatar>
                    <div>
                        <div class="text-sm font-semibold capitalize">
                            {{ item }}
                        </div>
                        <div class="text-xs text-gray-500">
                            {{ selectedUser.email }}
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Ownership</div>
                    <div v-if="assetCount || bussinesCount" class="flex gap-5 mt-1">
                        <div>
                            <strong>{{ assetCount }}</strong> Assets
                        </div>
                        <div>
                            <strong>{{ bussinesCount }}</strong> Business Terms
                        </div>
                    </div>
                    <div v-else>
                        You have no asset added
                    </div>
                </div>
                <div v-if="groupList.length > 0"  class="mt-3">
                    <div class="text-xs text-gray-500">Groups</div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span
                            v-for="group in groupList"
                            :key="group.id"
                            class="
                                px-2
                                py-0.5
                                text-xs
                                border border-gray-300 border-solid
                                rounded-xl
                                capitalize
                            "
                        >
                            {{ group.name }}
                        </span>
                    </div>
                </div>
                <div v-if="listOfPersona.length > 0" class="mt-3">
                    <div class="text-xs text-gray-500">Personas</div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span
                            v-for="persona in listOfPersona"
                            :key="persona.id"
                            class="
                                px-2
                                py-0.5
                                text-xs
                                bg-gray-200
                                border border-gray-300 border-solid
                                rounded-xl
                                capitalize
                            "
                            >{{ persona?.displayName }}</span
                        >
                    </div>
                </div>
                <a-button class="mt-3" block @click="handleClickViewUser">
                    <strong> View user profile </strong>
                    <AtlanIcon icon="Enter" class="mr-1 mb-0.5" />
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
        },
        emits: [],
        setup(props) {
            const { item } = toRefs(props)
            const { setUserUniqueAttribute, showUserPreview } = useUserPreview()
            const params = {
                limit: 1,
                offset: 0,
                filter: {
                    $and: [{ emailVerified: true }, { username: item.value }],
                },
            }
            const { userList, isLoading } = useUsers(params, item.value)
            const selectedUser = computed(() =>
                userList && userList.value && userList.value.length
                    ? userList.value[0]
                    : []
            )
            const admin = computed(() =>
                selectedUser.value?.roles?.includes('$admin' || 'admin')
                    ? 'Admin'
                    : ''
            )
            const groupListAPIParams = {
                userId: selectedUser?.value.id,
                params: {
                    limit: 10,
                    offset: 0,
                    sort: 'name',
                    filter: {},
                },
            }
            const { groupList } = getUserGroups(
                groupListAPIParams,
                selectedUser?.value.id
            )
            const { bussinesCount, assetCount } = useUserPopover(
                'user',
                item.value
            )

            const handleClickViewUser = () => {
                setUserUniqueAttribute(item.value, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }
            const listOfPersona = ref([])
            const flag = ref(true)
            if (flag.value) {
                const { personaList } = usePersonaList()
                watch(personaList, (newValue) => {
                    if (newValue) {
                        const user = selectedUser.value.id
                        listOfPersona.value = newValue.filter((element) =>
                            element.users.includes(user)
                        )
                    }
                })
            }
            return {
                selectedUser,
                isLoading,
                bussinesCount,
                assetCount,
                groupList,
                handleClickViewUser,
                listOfPersona,
                admin,
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
