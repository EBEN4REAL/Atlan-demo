<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col w-1/5 h-full overflow-hidden bg-white border-r"
        >
            <div class="flex flex-grow w-full px-6 mt-3 mb-2 overflow-y-auto">
                <a-menu
                    v-model:selectedKeys="current"
                    mode="inline"
                    :class="$style.sidebar"
                    :inline-indent="0"
                    @click="handleClick"
                >
                    <a-menu-item-group title="Workspace">
                        <a-menu-item
                            key="overview"
                            v-auth="[map.UPDATE_WORKSPACE]"
                            >Overview</a-menu-item
                        >
                        <a-menu-item key="users" v-auth="[map.LIST_USERS]">
                            Users
                        </a-menu-item>
                        <a-menu-item key="groups" v-auth="[map.LIST_GROUPS]">
                            Groups
                        </a-menu-item>
                        <a-menu-item key="apikeys" v-auth="[map.LIST_APIKEY]"
                            >API Keys</a-menu-item
                        >
                        <a-menu-item key="sso" v-auth="[map.UPDATE_SSO]">
                            SSO
                        </a-menu-item>
                        <a-menu-item key="smtp" v-auth="[map.UPDATE_SMTP]">
                            SMTP
                        </a-menu-item>
                        <a-menu-item
                            key="integration"
                            v-auth="[map.LIST_INTEGRATION]"
                        >
                            Integrations
                        </a-menu-item>
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
    import { defineComponent, ref, computed } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    import map from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'AdminPage',
        setup() {
            const router = useRouter()
            const route = useRoute()

            const handleClick = ({ key }) => {
                console.log(key)
                router.push(`/admin/${key}`)
            }
            const current = computed(() => {
                const initialRoute = route.path.split('/')
                if (initialRoute.length === 2 && initialRoute[0] === 'admin')
                    return ['overview']
                if (initialRoute.length > 2) return [initialRoute[2]]
                return initialRoute.slice(-1)
            })
            return {
                handleClick,
                current,
                map,
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
</route>
