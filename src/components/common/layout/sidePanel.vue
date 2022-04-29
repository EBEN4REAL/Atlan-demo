<template>
    <div class="flex flex-col flex-grow h-full">
        <!-- purpose  -->
        <div
            v-if="logoUrl && !logoNotFound"
            class="flex items-center h-10 px-2 mb-1"
        >
            <router-link
                to="/"
                class="flex items-center w-full mx-0"
                :class="isCollapsed ? 'justify-center px-0 py-1' : ''"
            >
                <img
                    :src="logoUrl"
                    class="rounded-sm cursor-pointer select-none"
                    :alt="defaultLogo"
                    :class="isCollapsed ? 'w-8' : 'h-4 mr-2'"
                    @error="onLogoNotFound"
                />
                <span v-if="!isCollapsed" class="font-semibold">{{
                    logoName
                }}</span>
            </router-link>
        </div>

        <div v-else class="flex items-center h-10 px-2 mb-1">
            <router-link
                to="/"
                class="flex items-center w-full mx-0"
                :class="isCollapsed ? 'justify-center px-0 py-1' : ''"
            >
                <atlan-icon
                    icon="Home"
                    :class="isCollapsed ? 'h-6' : 'h-4 mr-2'"
                    class="text-gray-500"
                />
                <span v-if="!isCollapsed" class="font-semibold">{{
                    logoName
                }}</span>
            </router-link>
        </div>

        <div class="px-0">
            <template v-for="nav in workspaceList" :key="nav.label">
                <router-link
                    v-if="nav.isActive"
                    v-slot="{ isActive }"
                    v-auth="nav.auth"
                    :to="nav.path"
                    @click="closeNavDrawer"
                >
                    <div
                        class="flex items-center w-full mx-0 menu-item"
                        :class="[
                            isCollapsed
                                ? 'px-2 py-1 justify-center my-3  '
                                : 'mt-1',
                            isActive || isHovering === nav.path
                                ? bgClass(nav.path)
                                : '',
                        ]"
                        @mouseover="isHovering = nav.path"
                        @mouseout="isHovering = ''"
                    >
                        <span class="flex flex-col items-center">
                            <atlan-icon
                                :icon="isActive ? nav?.icon : nav?.inactiveIcon"
                                :class="[
                                    isCollapsed ? 'h-6' : 'h-4 mr-2',
                                    isActive ? 'text-primary' : 'text-gray-500',
                                ]"
                            />
                            <span
                                class="mt-1 leading-none tracking-tight text-gray-500"
                                style="font-size: 11px"
                            >
                                {{ nav.label }}</span
                            >
                        </span>
                    </div>
                </router-link>
            </template>
        </div>
        <div class="p-2"><hr /></div>
        <div class="px-0">
            <template v-for="nav in workspaceCentreList" :key="nav.label">
                <router-link
                    v-if="
                        (nav.isActive &&
                            nav.path === '/platform' &&
                            role === 'Admin') ||
                        (nav.isActive && nav.path !== '/platform')
                    "
                    v-slot="{ isActive }"
                    v-auth.or="nav.auth"
                    :to="nav.path"
                    @click="closeNavDrawer"
                    ><div
                        class="flex items-center w-full mx-0 menu-item"
                        :class="[
                            isCollapsed ? 'p-2 justify-center my-1' : 'mt-1',
                            isActive || isHovering === nav.path
                                ? bgClass(nav.path)
                                : '',
                        ]"
                        @mouseover="isHovering = nav.path"
                        @mouseout="isHovering = ''"
                    >
                        <span class="flex flex-col items-center">
                            <atlan-icon
                                :icon="
                                    isActive
                                        ? nav?.icon
                                        : nav?.inactiveIcon || nav?.icon
                                "
                                :class="[
                                    isCollapsed ? 'h-6' : 'h-4 mr-2',
                                    isActive ? 'text-primary' : 'text-gray-500',
                                ]"
                            />

                            <span
                                class="mt-1 leading-none tracking-tight text-gray-500"
                                style="font-size: 11px"
                            >
                                {{ nav.label }}</span
                            >
                        </span>
                    </div>
                </router-link>
            </template>
        </div>

        <div class="flex-grow"></div>
        <div class="mb-4">
            <template v-for="nav in helpCenterList" :key="nav.id">
                <div
                    v-if="nav.isActive"
                    class="flex items-center w-full mx-0 my-1 cursor-pointer menu-item hover:bg-primary-menu"
                    :class="isCollapsed ? 'p-2 justify-center' : ''"
                    @click="
                        () => {
                            nav.id === 'support' ? toggleHelpWidget() : null
                        }
                    "
                >
                    <a
                        v-if="nav.link"
                        :target="nav.openInANewTab ? '_blank' : 'self'"
                        :href="nav.link"
                        class="flex items-center flex-col"
                    >
                        <atlan-icon
                            :icon="nav?.icon"
                            class="text-gray-500"
                            :class="isCollapsed ? 'h-6' : 'h-4 mr-2'"
                        />
                        <span
                            class="mt-1 leading-none tracking-tight text-gray-500"
                            style="font-size: 11px"
                        >
                            {{ nav.label }}</span
                        >
                    </a>
                    <span v-else class="flex items-center flex-col">
                        <atlan-icon
                            :icon="nav?.icon"
                            class="text-gray-500"
                            :class="isCollapsed ? 'h-6' : 'h-4 mr-2'"
                        />
                        <span
                            class="mt-1 leading-none tracking-tight text-gray-500"
                            style="font-size: 11px"
                        >
                            {{ nav.label }}</span
                        >
                    </span>
                </div>
            </template>
        </div>

        <!-- <div
            v-if="path === '/'"
            class="flex items-center justify-between w-full px-3 border-t border-b border-gray-200"
        >
            <UserPersonalAvatar placement="topLeft" class="py-2">
            </UserPersonalAvatar>
        </div> -->
        <!--  <div class="w-full my-3">
            <div class="flex mx-3">
                <span class="flex items-center text-xs text-gray-500">
                    ATL{{ getVersion }}
                </span>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import { useRoute } from 'vue-router'
    import UserPersonalAvatar from '@/common/avatar/meLarge.vue'
    import useUserData from '~/composables/user/useUserData'
    import map from '~/constant/accessControl/map'

    import { workspaceList } from '~/constant/navigation/workspace'
    import { workspaceCentreList } from '~/constant/navigation/workspaceCentre'
    import { helpCenterList } from '~/constant/navigation/helpCentre'
    import useHelpWidget from '~/composables/helpCenter/useHelpWidget'
    import whoami from '~/composables/user/whoami'
    import { useTenantStore } from '~/store/tenant'
    import defaultLogo from '~/assets/images/your_company.png'

    export default defineComponent({
        name: 'HomeSidePanel',
        components: { UserPersonalAvatar },
        props: {
            page: { type: String, required: true },
            isCollapsed: { type: Boolean, required: false },
        },
        emits: ['change', 'closeNavbar'],
        setup(props, { emit }) {
            const { username, name } = useUserData()
            const { role } = whoami()
            const { toggleHelpWidget } = useHelpWidget()

            const tenantStore = useTenantStore()
            const logoNotFound = ref(false)
            const isHovering = ref('')
            const { logoUrl } = toRefs(tenantStore)
            const logoName = computed(() => tenantStore.displayName)

            const onLogoNotFound = () => {
                logoNotFound.value = true
            }

            const getVersion = process.env.npm_package_version
            const route = useRoute()

            const path = computed(() => route.path)

            function closeNavDrawer() {
                emit('closeNavbar')
            }

            const bgClass = (routePath: String) => {
                switch (routePath) {
                    case '/glossary':
                        return 'glossary-bg'

                    case '/insights':
                        return 'insights-bg'

                    case '/workflows':
                        return 'workflows-bg'

                    default:
                        return 'bg-primary-menu'
                }
            }

            return {
                role,
                closeNavDrawer,
                workspaceList,
                workspaceCentreList,
                helpCenterList,
                username,
                name,
                getVersion,
                map,
                path,
                toggleHelpWidget,
                logoUrl,
                logoNotFound,
                logoName,
                onLogoNotFound,
                defaultLogo,
                bgClass,
                isHovering,
            }
        },
    })
</script>

<style lang="less" scoped>
    .menu-item {
        @apply flex items-center px-3  self-stretch mx-1 py-2;
        @apply text-sm text-gray;

        @apply transition duration-300;
        @apply outline-none;
        @apply border border-transparent;

        &:focus-visible {
            @apply border-primary-focus !important;
        }
        &.active {
            @apply text-primary;
            @apply bg-primary-menu;
        }
    }
    :global(.ant-tooltip-inner) {
        @apply px-3 py-2 !important;
    }

    .glossary-bg {
        background-color: #ffecf1;
    }
    .insights-bg {
        background-color: #fff5c6;
    }

    .workflows-bg {
        background-color: #d7fcdf;
    }
</style>
