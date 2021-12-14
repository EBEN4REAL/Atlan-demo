<template>
    <div class="flex flex-col flex-grow h-full">
        <!-- purpose  -->
        <div
            v-if="page === ''"
            class="flex items-center justify-between w-full px-3 py-3 border-b border-gray-200"
        >
            <UserPersonalAvatar> </UserPersonalAvatar>
        </div>

        <div class="px-3">
            <router-link
                to="/"
                class="w-full mx-0 mt-3 menu-item"
                @click="closeNavDrawer"
            >
                <span class="flex items-center">
                    <atlan-icon
                        icon="Home"
                        class="h-5 mr-2"
                        :class="{
                            'text-primary': page === '/' || page === 'home',
                        }"
                    />
                    <span class="">Home</span>
                </span>
            </router-link>

            <!-- workspaces -->
            <div
                class="px-3 mt-4 mb-1 text-xs font-bold text-gray-500 uppercase"
            >
                Workspace
            </div>
            <!-- pages -->

            <template v-for="nav in workspaceList" :key="nav.label">
                <router-link
                    v-if="nav.isActive"
                    v-auth="nav.auth"
                    :to="nav.path"
                    class="w-full mx-0 menu-item"
                    :class="{ active: nav.path === page }"
                    @click="closeNavDrawer"
                >
                    <span class="flex items-center">
                        <atlan-icon :icon="nav?.icon" class="h-4 mr-2" />

                        {{ nav.label }}
                    </span>
                </router-link>
            </template>
        </div>
        <div class="flex-grow"></div>
        <div class="px-3">
            <template v-for="nav in workspaceCentreList" :key="nav.label">
                <router-link
                    v-if="
                        (nav.isActive &&
                            nav.path === '/platform' &&
                            role === 'Admin') ||
                        (nav.isActive && nav.path !== '/platform')
                    "
                    v-auth.or="nav.auth"
                    :to="nav.path"
                    class="w-full mx-0 menu-item"
                    :class="{ active: nav.path === page }"
                    @click="closeNavDrawer"
                >
                    <span class="flex items-center">
                        <atlan-icon :icon="nav?.icon" class="h-4 mr-2" />
                        {{ nav.label }}
                    </span>
                </router-link>
            </template>
        </div>
        <div class="flex items-center justify-between px-3 my-3">
            <div class="flex items-center px-3 text-sm text-gray-500">
                with 💙
                <span class="ml-2">by</span>
                <!-- FIXME: What is this URL??? -->
                <img
                    src="https://atlan.com/assets/img/atlan-blue.6ed81a56.svg"
                    class="w-auto h-3 ml-2 mb-0.5"
                />
            </div>
            <p class="flex items-center text-xs text-gray-500">
                v{{ getVersion }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import UserPersonalAvatar from '@/common/avatar/meLarge.vue'
    import useUserData from '~/composables/user/useUserData'
    import map from '~/constant/accessControl/map'

    import { workspaceList } from '~/constant/navigation/workspace'
    import { workspaceCentreList } from '~/constant/navigation/workspaceCentre'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        name: 'HomeSidePanel',
        components: { UserPersonalAvatar },
        props: {
            page: { type: String, required: true },
        },
        emits: ['change', 'closeNavbar'],
        setup(props, { emit }) {
            const { username, name } = useUserData()
            const { role } = whoami()

            const getVersion = process.env.npm_package_version

            function closeNavDrawer() {
                emit('closeNavbar')
            }
            return {
                role,
                closeNavDrawer,
                workspaceList,
                workspaceCentreList,
                username,
                name,
                getVersion,
                map,
            }
        },
    })
</script>

<style lang="less" scoped>
    .menu-item {
        @apply flex items-center px-3  self-stretch mx-1 py-2;
        @apply text-sm text-gray;
        @apply rounded;
        @apply transition duration-300;
        @apply outline-none;
        @apply border border-transparent;

        &:hover {
            @apply text-primary !important;
            @apply bg-primary-light !important;
        }
        &:focus-visible {
            @apply border-primary-focus !important;
        }
        &.active {
            @apply text-primary;
            @apply bg-primary-light;
        }

        :global(.router-link-active) {
            @apply text-primary !important;
            @apply bg-primary-light !important;
            @apply font-semibold;
        }
    }
</style>
