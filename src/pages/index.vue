<template>
    <div class="flex flex-col items-center w-full h-full bg-white border-l">
        <img :src="logoUrl" class="w-auto h-12 mt-8 mb-2" />

        <SearchAndFilter
            placeholder="Search accross atlan..."
            class="w-1/2 mt-2"
        />
        <div class="flex justify-end w-1/2">
            <span
                class="flex items-center self-end mt-2 font-bold cursor-pointer text-primary"
                @click="redirectToDiscover"
                >Assets
                <atlan-icon icon="ArrowRight" class="w-auto h-4 ml-1" />
            </span>
        </div>
        <div class="flex flex-col w-full ml-16">
            <template v-for="item in [1, 2]" :key="item">
                <div class="w-40 h-10 my-4 bg-gray-300"></div>
                <div class="flex items-center space-x-20">
                    <div
                        v-for="item in [1, 2, 3]"
                        :key="item"
                        class="flex items-center justify-center h-32 my-4 bg-gray-300 w-72"
                    >
                        Placeholder
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, computed, ref } from 'vue'


    import { useHead } from '@vueuse/head'

    import { useRouter } from 'vue-router'
    import SavedList from '@/home/saved/index.vue'
    import { useUser } from '~/composables/user/useUsers'

    import Avatar from '~/components/common/avatar.vue'

    import Sidebar from '~/components/home/sidebar/index.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    import UpdateSkills from '~/components/admin/users/userPreview/about/updateSkills.vue'
    import UpdateDesignation from '~/components/admin/users/userPreview/about/updateDesignation.vue'
    import { useTenantStore } from '~/services/keycloak/tenant/store'
    import useRecentTerms from '~/composables/home/useRecentTerms'

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            SavedList,
            Sidebar,
            Avatar,
            UpdateSkills,
            UpdateDesignation,
            SearchAndFilter,
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
            const router = useRouter()
            // recent terms
            const recentTerms = useRecentTerms()
            console.log('recentTerms', recentTerms)

            const logoUrl = computed(() => `${window.location.origin}/api/service/avatars/_logo_`)

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

            const redirectToDiscover = () => {
                router.push('/assets')
            }
            useHead({
                title: `Welcome - ${fullName.value} `,
            })
            const imageUrl = ref(
                `${window.location.origin}/api/service/avatars/${username}`
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
                logoUrl,
                redirectToDiscover,
                recentTerms
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
