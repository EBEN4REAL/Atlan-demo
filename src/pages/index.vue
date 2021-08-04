<template>
    <div class="grid h-full grid-cols-12 p-6 gap-x-12">
        <div class="col-span-12 sm:col-span-8">
            <div class="flex items-center w-full align-middle">
                <div class="flex flex-col w-full">
                    <p
                        class="mb-2 text-xl font-bold tracking-tight text-gray-900 "
                    >
                        Welcome Home, {{ fullName }}
                    </p>
                    <a-input-search
                        placeholder="Search all your assets.."
                        size="large"
                    >
                        <template #prefix>
                            <img
                                :src="displayNameHTML"
                                class="w-auto h-8 mr-3"
                            />
                        </template>
                    </a-input-search>
                </div>
            </div>
        </div>

        <div
            class="hidden h-full p-3 mt-3 bg-white border rounded-md  sm:col-span-4 sm:block"
        >
            <div class="flex items-center justify-between p-5 align-middle">
                <div class="flex items-center">
                    <avatar
                        :image-url="imageUrl"
                        :allow-upload="true"
                        :avatar-name="fullName || username"
                    />
                    <div class="flex flex-col ml-2">
                        <p
                            class="mb-0 text-lg leading-none tracking-tight text-gray-800 truncate  text-semibold"
                        >
                            {{ fullName }}
                        </p>
                        <p class="mb-0 text-sm text-gray-500">
                            @{{ username }}
                        </p>
                        <p
                            class="mt-0 mb-0 text-sm tracking-tight text-gray-800 "
                        >
                            <fa
                                icon="fal user-tag"
                                class="mr-1 text-gray-800 pushtop"
                            ></fa
                            >Admin
                        </p>
                    </div>
                </div>
                <fa icon="fal cog"></fa>
            </div>
            <a-divider class="mt-0"></a-divider>
            <div class="px-5">
                <UpdateDesignation
                    :user="userObj"
                    :allow-update="true"
                    @updatedUser="handleUpdateUser"
                />
                <UpdateSkills
                    class="mt-4"
                    :user="userObj"
                    :allow-update="true"
                    @updatedUser="handleUpdateUser"
                />
                <div class="mt-4">
                    <p class="mb-2 leading-none text-gray-400">Saved Filters</p>
                    <SavedList></SavedList>
                </div>
            </div>

            <!-- <a-menu mode="inline" class="bg-transparent">
          <a-menu-item key="1">
            <span>Home</span>
          </a-menu-item>
          <a-menu-item-group title="Discover">
            <a-menu-item key="2">
              <span>Assets</span>
            </a-menu-item>
            <a-menu-item key="2">
              <span>Terms</span>
            </a-menu-item>
            <a-menu-item key="2">
              <span>Connections</span>
            </a-menu-item>
            <a-menu-item key="2">
              <span>Projects</span>
            </a-menu-item>
          </a-menu-item-group>
      </a-menu>-->
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, computed, ref } from 'vue'

    import SavedList from '@/home/saved/index.vue'

    import { useHead } from '@vueuse/head'

    import { useUser } from '~/composables/user/useUsers'

    import Avatar from '~/components/common/avatar.vue'

    import UpdateSkills from '~/components/admin/users/userPreview/about/updateSkills.vue'
    import UpdateDesignation from '~/components/admin/users/userPreview/about/updateDesignation.vue'
    import { useTenantStore } from '~/store/tenants'

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            SavedList,
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
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
