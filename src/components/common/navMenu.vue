<template>
    <div class="flex items-center justify-between w-full h-full">
        <div class="flex items-center">
            <atlan-icon
                icon="Readme"
                class="h-4 mr-3 cursor-pointer"
                @click="$emit('toggleNavbar')"
            />
            <img
                src="https://atlan.com/assets/img/atlan-blue.6ed81a56.svg"
                class="w-auto h-4 mb-1"
            />
            <atlan-icon
                v-if="page !== '/'"
                icon="ChevronRight"
                class="h-4 mx-3"
            />
            <span class="mt-0.5 text-xs font-bold text-gray-500 tracking-wider">
                {{ navKeys[page]?.toUpperCase() }}</span
            >
        </div>
        <div class="flex items-center justify-self-end">
            <AtlanIcon icon="Notification" class="h-5 mr-3" />
            <UserPersonalAvatar class="self-center" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import UserPersonalAvatar from '~/components/common/avatar/me.vue'

    export default defineComponent({
        name: 'Navigation Menu',
        components: { UserPersonalAvatar },
        props: {
            page: { type: String, required: true },
        },
        emits: ['change', 'toggleNavbar'],
        setup(props, { emit }) {
            const navKeys = {
                assets: 'Discover',
                glossary: 'Glossary',
                insights: 'Insights',
                workflows: 'Workflows',
            }

            function handleClick(key: string) {
                emit('change', key)
            }

            return { handleClick, navKeys }
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
