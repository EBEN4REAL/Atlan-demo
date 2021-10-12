<template>
    <div class="flex items-center justify-between w-full h-full">
        <div class="flex items-center">
            <atlan-icon
                v-if="!isHome"
                icon="Dots"
                class="h-6 mr-2 cursor-pointer"
                @click="$emit('toggleNavbar')"
            />
            <img src="/api/service/avatars/_logo_" class="w-auto h-8" />

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
    import { computed, defineComponent } from 'vue'
    import { useRoute } from 'vue-router'
    import UserPersonalAvatar from '~/components/common/avatar/me.vue'

    export default defineComponent({
        name: 'Navigation Menu',
        components: { UserPersonalAvatar },
        props: {
            page: { type: String, required: true },
        },
        emits: ['change', 'toggleNavbar'],
        setup(props, { emit }) {
            const route = useRoute()

            const path = computed(() => route.path)

            const isHome = computed(() => {
                if (path.value === '/' || path.value === '') {
                    return true
                }
                return false
            })

            const navKeys = {
                assets: 'Discover',
                glossary: 'Glossary',
                insights: 'Insights',
                workflows: 'Workflows',
            }

            function handleClick(key: string) {
                emit('change', key)
            }

            return { handleClick, navKeys, isHome }
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
