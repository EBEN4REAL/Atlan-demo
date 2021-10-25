<template>
    <a-table
        v-if="userList && listType === 'users'"
        id="userList"
        :key="persona.id"
        :scroll="{ y: 'calc(100vh - 20rem)' }"
        :table-layout="'fixed'"
        :data-source="userList"
        :columns="columns"
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
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { whenever } from '@vueuse/core'
    import { message } from 'ant-design-vue'

    import AtlanBtn from '@/UI/button.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import { useUserPreview } from '~/composables/user/showUserPreview'

    import userAPI from '~/services/heracles/apis/users'
    import { getFormattedUser } from '~/composables/user/useUsers'

    export default defineComponent({
        name: 'PersonaUsersGroups',
        components: {
            AtlanBtn,
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
            const personaUsers = computed(() => persona.value.users!)

            const { getUsersBulk } = userAPI

            const { data, isLoading, mutate, error } =
                getUsersBulk(personaUsers)

            const userList = computed(() =>
                data.value.map((usr) => getFormattedUser(usr))
            )
            watch(
                () => persona.value.id,
                () => mutate()
            )

            const listType = ref('users')

            const columns = [
                {
                    title: 'User',
                    key: 'user',
                    sorter: true,
                    width: 220,
                    slots: { customRender: 'name' },
                    sortKey: 'first_name',
                },
                {
                    title: 'Groups',
                    key: 'group',
                    sorter: true,
                    width: 150,
                    slots: { customRender: 'group' },
                    sortKey: 'group_count',
                    dataIndex: 'group_count_string',
                },
                {
                    title: 'Status',
                    key: 'status',
                    slots: { customRender: 'status' },
                    filterMultiple: false,
                    width: 150,
                },
                {
                    title: 'Actions',
                    width: 120,
                    slots: { customRender: 'actions' },
                },
            ]

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()

            const showUserPreviewDrawer = (user: any) => {
                setUserUniqueAttribute(user.id)
                showUserPreview()
            }

            whenever(error, () => {
                message.error('Failed to get users')
                console.error(error.value)
            })

            return {
                userList,
                listType,
                columns,
                imageUrl,
                showUserPreviewDrawer,
                isLoading,
            }
        },
    })
</script>
