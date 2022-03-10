<template>
    <div class="flex flex-col flex-grow h-full">
        <!-- purpose  -->
        <div v-if="logoUrl && !logoNotFound" class="px-2">
            <a-tooltip placement="right" color="#2A2F45">
                <template #title
                    ><div class="text-sm font-semibold">Home</div></template
                >
                <router-link
                    to="/"
                    class="flex items-center w-full mx-0 mb-1"
                    :class="isCollapsed ? 'justify-center px-0 py-1' : ''"
                >
                    <img
                        :src="logoUrl"
                        class="w-auto cursor-pointer select-none"
                        :alt="defaultLogo"
                        :class="isCollapsed ? 'h-8 ' : 'h-4 mr-2'"
                        @error="onLogoNotFound"
                    />
                    <span v-if="!isCollapsed" class="font-semibold">{{
                        logoName
                    }}</span>
                </router-link>
            </a-tooltip>
        </div>

        <div v-else class="px-2">
            <a-tooltip placement="right" color="#2A2F45">
                <template #title
                    ><div class="text-sm font-semibold">Home</div>
                </template>
                <router-link
                    to="/"
                    class="flex items-center w-full mx-0 mb-1 menu-item"
                    :class="isCollapsed ? 'justify-center px-0 py-1' : ''"
                >
                    <atlan-icon
                        icon="Home"
                        :class="isCollapsed ? 'h-6' : 'h-4 mr-2'"
                    />
                    <span v-if="!isCollapsed" class="font-semibold">{{
                        logoName
                    }}</span>
                </router-link>
            </a-tooltip>
        </div>

        <div class="px-2">
            <template v-for="nav in workspaceList" :key="nav.label">
                <a-tooltip placement="right" color="#2A2F45">
                    <template #title
                        ><div class="text-sm font-semibold">
                            {{ nav.label }}
                        </div>
                        <div v-if="nav?.description" class="text-xs mt-0.5">
                            {{ nav?.description }}
                        </div></template
                    >
                    <router-link
                        v-if="nav.isActive"
                        v-slot="{ isActive }"
                        v-auth="nav.auth"
                        :to="nav.path"
                        class="flex items-center w-full mx-0 menu-item"
                        :class="
                            isCollapsed ? 'p-2 justify-center my-1' : 'mt-1'
                        "
                        @click="closeNavDrawer"
                    >
                        <span class="flex items-center">
                            <atlan-icon
                                :icon="isActive ? nav?.icon : nav?.inactiveIcon"
                                :class="[
                                    isCollapsed ? 'h-6' : 'h-4 mr-2',
                                    isActive ? 'text-primary' : 'text-gray-500',
                                ]"
                            />

                            <span v-if="!isCollapsed"> {{ nav.label }}</span>
                        </span>
                    </router-link>
                </a-tooltip>
            </template>
        </div>
        <div class="p-2"><hr /></div>
        <div class="px-2">
            <template v-for="nav in workspaceCentreList" :key="nav.label">
                <a-tooltip placement="right" color="#2A2F45">
                    <template #title
                        ><div class="text-sm font-semibold">
                            {{ nav.label }}
                        </div>
                        <div v-if="nav?.description" class="text-xs mt-0.5">
                            {{ nav?.description }}
                        </div></template
                    >
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
                        class="flex items-center w-full mx-0 my-1 menu-item"
                        :class="isCollapsed ? 'p-2 justify-center' : ''"
                        @click="closeNavDrawer"
                    >
                        <span class="flex items-center">
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

                            <span v-if="!isCollapsed"> {{ nav.label }}</span>
                        </span>
                    </router-link>
                </a-tooltip>
            </template>
        </div>

        <div class="flex-grow"></div>
        <div class="px-2">
            <template v-for="nav in helpCenterList" :key="nav.id">
                <a-tooltip placement="right" color="#2A2F45">
                    <template #title
                        ><div class="text-sm font-semibold">
                            {{ nav.label }}
                        </div>
                    </template>
                    <div
                        v-if="nav.isActive"
                        class="flex items-center w-full mx-0 my-1 menu-item"
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
                            class="flex items-center"
                        >
                            <atlan-icon
                                :icon="nav?.icon"
                                class="text-gray-500"
                                :class="isCollapsed ? 'h-6' : 'h-4 mr-2'"
                            />
                            <span v-if="!isCollapsed"> {{ nav.label }}</span>
                        </a>
                        <span v-else class="flex items-center">
                            <atlan-icon
                                :icon="nav?.icon"
                                class="text-gray-500"
                                :class="isCollapsed ? 'h-6' : 'h-4 mr-2'"
                            />
                            <span v-if="!isCollapsed"> {{ nav.label }}</span>
                        </span>
                    </div></a-tooltip
                >
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
            @apply bg-primary-menu !important;
        }
        &:focus-visible {
            @apply border-primary-focus !important;
        }
        &.active {
            @apply text-primary;
            @apply bg-primary-menu;
        }

        :global(.router-link-active) {
            @apply text-primary !important;
            @apply bg-primary-menu !important;
            @apply font-semibold;
        }
    }
    :global(.ant-tooltip-inner) {
        @apply px-3 py-2 !important;
    }
</style>
