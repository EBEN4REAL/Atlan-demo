<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col w-1/5 h-full overflow-hidden bg-white border-r"
        >
            <div class="flex flex-grow w-full px-6 mt-3 mb-2 overflow-y-auto">
                <a-menu
                    mode="inline"
                    :class="$style.sidebar"
                    @click="handleClick"
                    v-model:selectedKeys="current"
                    :inlineIndent="0"
                >
                    <a-menu-item-group title="Platform">
                        <a-menu-item key="services">Services</a-menu-item>
                        <a-menu-item key="query">Query</a-menu-item>
                    </a-menu-item-group>
                </a-menu>
            </div>
        </div>
        <div class="w-4/5 max-h-screen overflow-y-auto">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    export default defineComponent({
        name: 'PlatformPage',
        setup() {
            const router = useRouter()
            const route = useRoute()

            const handleClick = ({ key }) => {
                router.push(`/platform/${key}`)
            }

            const initialRoute = route.path.split('/').slice(-1)
            const current = ref(
                initialRoute[0] === 'platform' ? ['services'] : initialRoute
            )

            return {
                handleClick,
                current,
            }
        },
    })
</script>

<style lang="less" module>
    .sidebar {
        &:global(.ant-menu-inline) {
            @apply border-none !important;
        }

        :global(.ant-menu-item-group) {
            @apply mb-6;
        }
        :global(.ant-menu-item-group-title) {
            @apply pl-2;
            @apply text-xs uppercase tracking-wider font-bold leading-none;
        }
        :global(.ant-menu-title-content) {
            @apply pl-2;
        }
        :global(.ant-menu-item) {
            @apply text-sm;
            @apply py-2;
            margin: 0px !important;
        }

        :global(.ant-menu-item::after) {
            @apply border-none !important;
        }

        :global(.ant-menu-item-selected) {
            @apply rounded !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    role: $admin
</route>
