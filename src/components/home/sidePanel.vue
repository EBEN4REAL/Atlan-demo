<template>
    <div class="flex flex-col flex-grow h-full border-r">
        <!-- purpose  -->
        <div
            v-if="page === '/'"
            class="flex items-center justify-between w-full px-3 py-3"
        >
            <UserPersonalAvatar> </UserPersonalAvatar>
        </div>
        <a-divider v-if="page === '/'" class="my-0" />
        <!-- <span class="px-4 mt-5 mb-2 text-xs font-bold text-gray-500">
            PURPOSE</span
        >
        <a-dropdown class="mx-4">
            <template #overlay>
                <a-menu>
                    <a-menu-item key="1" @click="purpose = 'Universe 1'">
                        Universe 1</a-menu-item
                    >
                    <a-menu-item key="2" @click="purpose = 'Universe 2'">
                        Universe 2</a-menu-item
                    >
                </a-menu>
            </template>
            <a-button>
                <div class="flex items-center justify-between">
                    {{ purpose }}
                    <AtlanIcon icon="ChevronDown" class="h-4" />
                </div>
            </a-button>
        </a-dropdown> -->

        <div class="px-3">
            <router-link
                to="/"
                class="w-full mx-0 mt-3 menu-item"
                :class="{ active: page === '/' }"
                @click="closeNavDrawer"
            >
                <span class="flex items-center">
                    <atlan-icon
                        icon="Home"
                        class="h-4 mr-2"
                        :class="{
                            'text-primary': page === '/' || page === 'home',
                        }"
                    />
                    Home
                </span>
            </router-link>

            <!-- workspaces -->
            <div class="px-3 mt-4 mb-3 text-xs font-bold text-gray-500">
                WORKSPACE
            </div>
            <!-- pages -->

            <template v-for="nav in topNavKeys" :key="nav.label">
                <router-link
                    :to="nav.path"
                    class="w-full mx-0 menu-item"
                    :class="{ active: nav.path === page }"
                    @click="closeNavDrawer"
                >
                    <span class="flex items-center">
                        <atlan-icon
                            :icon="
                                nav.path !== page
                                    ? nav?.inactiveIcon
                                    : nav?.icon
                            "
                            class="h-4 mr-2"
                        />
                        {{ nav.label }}
                    </span>
                </router-link>
            </template>
        </div>
        <div class="flex-grow"></div>
        <div class="px-3">
            <template v-for="nav in bottomNavKeys" :key="nav.label">
                <router-link
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

        <span class="flex items-center px-3 mt-2 mb-4 text-sm text-gray-500"
            >Built with 💙
            <span class="ml-2">by</span>
            <!-- FIXME: What is this URL??? -->
            <img
                src="https://atlan.com/assets/img/atlan-blue.6ed81a56.svg"
                class="w-auto h-3 ml-2 mb-0.5"
            />
        </span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import { useMagicKeys } from '@vueuse/core'
    import UserPersonalAvatar from '~/components/common/avatar/meLarge.vue'
    import whoami from '~/composables/user/whoami'
    import { topNavKeys, bottomNavKeys } from '~/constant/navigation'

    export default defineComponent({
        name: 'HomeSidePanel',
        components: { UserPersonalAvatar },
        props: {
            page: { type: String, required: true },
        },
        emits: ['change', 'closeNavbar'],
        setup(props, { emit }) {
            const purpose = ref('Universe 1')
            const keys = useMagicKeys()
            const esc = keys.Escape
            const { username, name } = whoami()

            function closeNavDrawer() {
                emit('closeNavbar')
            }

            return {
                closeNavDrawer,
                topNavKeys,
                purpose,
                username,
                name,
                bottomNavKeys,
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
            @apply text-primary;
        }
        &:focus-visible {
            @apply border-primary-focus !important;
        }
        &.active {
            @apply text-primary;
            @apply bg-primary-light;
        }
    }
</style>
