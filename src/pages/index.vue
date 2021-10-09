<template>
    <div class="flex w-full h-full bg-red-500">
        <div class="items-stretch">
            <div class="grid p-5 bg-primary-light justify-items-center">
                <div class="flex items-center w-3/4 mb-5">
                    <div class="flex flex-col w-full pt-5">
                        <a-input-search
                            class="p2"
                            placeholder="Search assets across Atlan..."
                            size="large"
                        >
                        </a-input-search>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, computed, ref } from 'vue'

    import SavedList from '@/home/saved/index.vue'

    import { useHead } from '@vueuse/head'

    import { useUser } from '~/composables/user/useUsers'

    import Avatar from '~/components/common/avatar.vue'

    import Sidebar from '~/components/home/sidebar/index.vue'

    import UpdateSkills from '~/components/admin/users/userPreview/about/updateSkills.vue'
    import UpdateDesignation from '~/components/admin/users/userPreview/about/updateDesignation.vue'
    import { useTenantStore } from '~/store/tenants'

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            SavedList,
            Sidebar,
            Avatar,
            UpdateSkills,
            UpdateDesignation,
        },
        props: {
            msg: {
                type: String,
                default: '',
            },
        },
        setup() {
            const keycloak = inject('$keycloak')
            const tenantStore = useTenantStore()

            const username = keycloak.tokenParsed.preferred_username || ''

            const fullName = computed(() => {
                const firstName = keycloak.tokenParsed.given_name || ''
                const lastName = keycloak.tokenParsed.family_name || ''
                return `${
                    firstName.charAt(0).toUpperCase() +
                    firstName.substr(1).toLowerCase()
                } ${
                    lastName.charAt(0).toUpperCase() +
                    lastName.substr(1).toLowerCase()
                }`
            })
            useHead({
                title: `Welcome - ${fullName.value} `,
            })
            const imageUrl = ref(
                `http://localhost:3333/api/auth/tenants/default/avatars/${username}`
            )
            const filterObj = {
                $and: [{ email_verified: true }, { username }],
            }
            const { userList, getUser, state, STATES } = useUser({
                limit: 1,
                offset: 0,
                sort: 'first_name',
                filter: filterObj,
            })
            const handleUpdateUser = async () => {
                await getUser()
            }
            const userObj = computed(() =>
                userList && userList.value && userList.value.length
                    ? userList.value[0]
                    : []
            )

            const views = [
                { id: 1, src: 'https://picsum.photos/50/50' },
                { id: 2, src: 'https://picsum.photos/50/50' },
                { id: 3, src: 'https://picsum.photos/50/50' },
            ]
            const dummyProjects = [
                {
                    id: 1,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
                {
                    id: 2,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
                {
                    id: 3,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
                {
                    id: 4,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
                {
                    id: 5,
                    projectName: 'Sales churn analysis',
                    description:
                        "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
                },
            ]

            return {
                fullName,
                name: keycloak.tokenParsed.name || '',
                username,
                displayName: computed(
                    () => tenantStore?.tenant?.getDisplayName
                ),
                displayNameHTML: computed(
                    () => tenantStore?.tenant?.getDisplayNameHTML
                ),
                realm: computed(() => tenantStore?.tenant?.getRealmName),
                imageUrl,
                state,
                STATES,
                userObj,
                handleUpdateUser,
                views,
                dummyProjects,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
