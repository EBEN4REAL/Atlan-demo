<template>
    <div class="flex flex-col flex-grow h-full">
        <!-- purpose  -->
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
        <!-- workspaces -->
        <span class="px-4 mt-8 mb-2 text-xs font-bold text-gray-500">
            WORKSPACE</span
        >
        <!-- pages -->
        <button
            class="menu-item"
            :class="{ active: page === '/' }"
            @click="handleClick('home')"
        >
            <span class="flex items-center">
                <atlan-icon icon="Trash" class="h-4 mr-3 text-primary" />
                Home
            </span>
        </button>

        <button
            v-for="nav in navKeys"
            :key="nav.label"
            class="menu-item"
            :class="{ active: nav.path === page }"
            @click="handleClick(nav.path)"
        >
            <span class="flex items-center">
                <atlan-icon icon="Link" class="h-4 mr-3 text-primary" />
                {{ nav.label }}
            </span>
        </button>
        <div class="flex-grow"></div>
        <div class="w-full justify-self-end">
            <button
                class="w-full mr-2 menu-item"
                :class="{ active: 'admin' === page }"
                @click="handleClick('admin')"
            >
                <span class="flex items-center">
                    <atlan-icon icon="Link" class="h-4 mr-3 text-primary" />
                    Admin Center
                </span>
            </button>
            <button
                v-for="item in ['Notifications', 'Help', 'Feedback']"
                :key="item"
                class="mr-2 menu-item"
            >
                <span class="flex items-center">
                    <atlan-icon icon="Link" class="h-4 mr-3 text-primary" />
                    {{ item }}
                </span>
            </button>
        </div>
        <span class="flex items-center px-4 mt-2 mb-4 text-sm text-gray-500"
            >Built with 💙
            <span class="ml-2">by</span>
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
    import UserPersonalAvatar from '~/components/common/avatar/me.vue'

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
            const navKeys = [
                { path: 'assets', label: 'Discover' },
                { path: 'glossary', label: 'Glossary' },
                { path: 'insights', label: 'Insights' },
                { path: 'workflows', label: 'Workflows' },
            ]

            function handleClick(key: string) {
                emit('change', key)
            }
            watch(esc, (v) => {
                if (v) {
                    console.log('close')
                    emit('closeNavbar')
                }
            })
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
