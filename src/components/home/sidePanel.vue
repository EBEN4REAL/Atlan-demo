<template>
    <div class="flex flex-col flex-grow h-full">
        <span class="px-4 mt-5 mb-2 text-xs font-bold text-gray-500">
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
        </a-dropdown>
        <span class="px-4 mt-8 mb-2 text-xs font-bold text-gray-500">
            WORKSPACE</span
        >
        <button
            v-for="nav in navKeys"
            :key="nav.label"
            class="menu-item"
            :class="{ active: nav.path === page }"
            @click="handleClick(nav.path)"
        >
            <span>
                {{ nav.label }}
            </span>
        </button>
        <div class="flex-grow"></div>
        <div class="justify-self-end">
            <button
                class="mr-2 menu-item"
                :class="{ active: 'admin' === page }"
                @click="handleClick('admin')"
            >
                Admin
            </button>
            <UserPersonalAvatar class="self-center" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import UserPersonalAvatar from '~/components/common/avatar/me.vue'

    export default defineComponent({
        name: 'HomeSidePanel',
        components: { UserPersonalAvatar },
        props: {
            page: { type: String, required: true },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const purpose = ref('Universe 1')
            const navKeys = [
                { path: 'assets', label: 'Discover' },
                { path: 'glossary', label: 'Glossary' },
                { path: 'insights', label: 'Insights' },
                { path: 'workflows', label: 'Workflows' },
            ]

            function handleClick(key: string) {
                emit('change', key)
            }

            return { handleClick, navKeys, purpose }
        },
    })
</script>

<style lang="less" scoped>
    .menu-item {
        @apply flex items-center px-3 mb-1 self-stretch mx-1 py-1;
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
