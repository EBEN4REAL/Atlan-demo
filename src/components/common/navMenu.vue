<template>
    <div
        class="flex items-center justify-between w-full h-full"
        @mouseover="$emit('openNavbar')"
        @mouseleave="$emit('closeNavbar')"
    >
        <div class="flex items-center">
            <atlan-icon
                v-if="!isHome"
                icon="Dots"
                class="h-6 mr-2 rounded cursor-pointer  hover:bg-primary-light hover:text-primary"
                :class="{ 'text-primary': isSidebarActive }"
                @click="$emit('toggleNavbar')"
            />
            <img
                :src="logoUrl"
                class="w-auto h-8 cursor-pointer"
                @click="handleClick('home')"
            />

            <atlan-icon v-if="!isHome" icon="ChevronRight" class="h-4 mx-1" />
            <span class="text-sm font-bold tracking-wider text-gray-500">
                {{ navKeys[page]?.toUpperCase() }}</span
            >
        </div>
        <div class="flex items-center justify-self-end">
            <atlan-icon icon="Search" class="h-5 mr-3" />
            <atlan-icon icon="Add" class="h-5 mr-3 font-bold text-primary" />
            <!-- <AtlanIcon icon="Notification" class="h-5 mr-3" /> -->
            <UserPersonalAvatar class="self-center pl-3 border-l" />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, watch, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import UserPersonalAvatar from '~/components/common/avatar/me.vue'
    import { useTenantStore } from '~/services/keycloak/tenant/store'

    export default defineComponent({
        name: 'Navigation Menu',
        components: { UserPersonalAvatar },
        props: {
            page: { type: String, required: true },
            isSidebarActive: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        emits: ['change', 'toggleNavbar'],
        setup(props, { emit }) {
            const route = useRoute()
            const tenantStore = useTenantStore()
            const isHome = computed(() => {
                if (props.page === '/' || props.page === '') {
                    return true
                }
                return false
            })
            const logoUrl = ref('')
            watch(
                tenantStore,
                () => {
                    logoUrl.value = `${window.location.origin}/api/service/avatars/_logo_`
                },
                { deep: true }
            )
            // const logoUrl = computed(() => {
            //     return `${window.location.origin}/api/service/avatars/_logo_`
            // })

            const navKeys = {
                assets: 'Assets',
                glossary: 'Glossary',
                insights: 'Insights',
                workflows: 'Workflows',
                admin: 'Admin Centre',
            }

            function handleClick(key: string) {
                emit('change', key)
            }

            return { handleClick, navKeys, isHome, logoUrl }
        },
    })
</script>

<style lang="less" scoped>
    .menu-item {
        @apply flex items-center px-3 my-2 self-stretch mx-1;
        @apply font-bold text-base text-gray;
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
