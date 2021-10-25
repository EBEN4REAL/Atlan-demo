<template>
    <div>
        <div class="flex items-center mb-6 gap-x-3">
            <SearchAndFilter
                v-model:value="queryText"
                class="bg-white w-80"
                :placeholder="placeholder"
            />
            <RaisedTab v-model:active="listType" :data="tabConfig" />

            <a-popover placement="left" trigger="click">
                <AtlanBtn color="light" padding="compact" class="ml-auto"
                    >Add users/Groups</AtlanBtn
                >
                <template #content>
                    <div
                        class="
                            p-2.5
                            bg-white
                            flex
                            items-center
                            flex-col
                            w-56
                            rounded
                        "
                    >
                        <!-- <UserSelector :data="userGroupData" /> -->
                    </div>
                </template>
            </a-popover>
        </div>
        <a-table
            v-if="filteredList && listType === 'users'"
            id="userList"
            :key="persona.id"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :table-layout="'fixed'"
            :data-source="filteredList"
            :columns="userColumns"
            :row-key="(user) => user.id"
            :pagination="false"
            :loading="isLoading"
        >
            <template #name="{ text: user }">
                <div class="flex items-center align-middle">
                    <avatar
                        :image-url="imageUrl(user.username)"
                        :allow-upload="false"
                        :avatar-name="user.name || user.username || user.email"
                        :avatar-size="40"
                        class="mr-2"
                    />
                    <div
                        class="truncate cursor-pointer"
                        @click="
                            () => {
                                showUserPreviewDrawer(user)
                            }
                        "
                    >
                        <span class="text-primary">{{ user.name || '-' }}</span>
                        <p class="mb-0 truncate text-gray">
                            @{{ user.username || '-' }}
                        </p>
                    </div>
                </div>
            </template>
            <template #status="{ text: user }">
                <div
                    class="
                        inline-flex
                        items-center
                        px-2
                        py-0.5
                        bg-gray-100
                        rounded
                        text-gray-500
                    "
                >
                    <fa
                        :icon="user.status_object.icon"
                        :class="user.status_object.color"
                        class="mr-1 text-xs"
                    ></fa>
                    <div>{{ user.status_object.status }}</div>
                </div>
            </template>
            <template #actions="{ text: user }"> Actions </template>
        </a-table>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        Ref,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { whenever } from '@vueuse/core'
    import { message } from 'ant-design-vue'

    import AtlanBtn from '@/UI/button.vue'
    import RaisedTab from '@/UI/raisedTab.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import UserSelector from '@/common/facets/owners.vue'

    import { IPersona } from '~/types/accessPolicies/personas'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import usePersonaUsers from './composables/usePersonaUsers'

    import {
        isEditing,
        selectedPersonaDirty,
    } from './composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaUsersGroups',
        components: {
            AtlanBtn,
            RaisedTab,
            SearchAndFilter,
            UserSelector,
        },
        props: {
            persona: {
                type: Object as PropType<IPersona>,
                required: true,
            },
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const { persona } = toRefs(props)
            const listType: Ref<'users' | 'groups'> = ref('users')

            const tabConfig = [
                { key: 'users', label: 'Users' },
                { key: 'groups', label: 'Groups' },
            ]

            const queryText = ref('')

            const { usePersonaUserList, userColumns } = usePersonaUsers
            const { isLoading, userList, userListError } =
                usePersonaUserList(persona)

            const filteredList = computed(() => {
                const qry = queryText.value
                if (listType.value === 'users') {
                    if (queryText.value)
                        return userList.value.filter(
                            (usr) =>
                                usr.email?.toLowerCase().includes(qry) ||
                                usr.lastName?.toLowerCase().includes(qry) ||
                                usr.firstName?.toLowerCase().includes(qry) ||
                                usr.username?.toLowerCase().includes(qry)
                        )
                    return userList.value
                }
                return []
            })

            const placeholder = computed(
                () =>
                    `Search ${
                        listType.value === 'users' ? userList.value.length : 0
                    } ${listType.value}`
            )

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const showUserPreviewDrawer = (user: any) => {
                setUserUniqueAttribute(user.id)
                showUserPreview()
            }

            whenever(userListError, () => {
                message.error('Failed to get users')
                console.error(userListError.value)
            })

            // const userGroupData = computed({
            //     get: () => ({
            //         userValue: selectedPersonaDirty.value!.users,
            //         groupValue: selectedPersonaDirty.value!.groups,
            //     }),
            //     set: (val) => {
            //         selectedPersonaDirty.value!.users = val.userValue
            //         selectedPersonaDirty.value!.groups = val.groupValue
            //     },
            // })

            return {
                placeholder,
                userList,
                tabConfig,
                queryText,
                filteredList,
                listType,
                userColumns,
                imageUrl,
                showUserPreviewDrawer,
                isLoading,
                // userGroupData,
            }
        },
    })
</script>
