<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col w-1/5 h-full overflow-hidden bg-white"
        >
            <div class="flex flex-grow w-full px-6 mt-3 mb-2 overflow-y-auto">
                <a-menu
                    mode="vertical"
                    class="admin-sidebar"
                    @click="handleClick"
                    style="width: 100%"
                    v-model:selectedKeys="current"
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

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    role: $admin
</route>
