<template>
    <div class="flex items-center flex-grow h-full">
        <img
            src="https://atlan.com/assets/img/atlan-blue.6ed81a56.svg"
            class="w-auto h-4 mr-6 cursor-pointer"
            @click="handleClick('home')"
        />
        <button
            v-for="nav in navKeys"
            @click="handleClick(nav.path)"
            class="menu-item"
            :class="{ active: nav.path === page }"
        >
            <span>
                {{ nav.label }}
            </span>
        </button>
        <div class="flex-grow"></div>
        <button
            @click="handleClick('admin')"
            class="mr-2 menu-item"
            :class="{ active: 'admin' === page }"
        >
            Admin
        </button>
        <AtlanIcon icon="Notification" class="h-5 mr-3" />
        <UserPersonalAvatar class="self-center" />
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
        emits: ['change'],
        setup(props, { emit }) {
            const navKeys = [
                { path: 'assets', label: 'Discover' },
                { path: 'glossary', label: 'Glossary' },
                { path: 'insights', label: 'Insights' },
                { path: 'connections', label: 'Connectors' },
            ]

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
