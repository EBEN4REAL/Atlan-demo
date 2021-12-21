<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col w-1/5 h-full overflow-hidden bg-white">
            <div class="flex flex-grow w-full px-6 mt-3 mb-2 overflow-y-auto">
                <a-menu
                    v-model:selectedKeys="current"
                    mode="vertical"
                    style="width: 100%"
                    class="admin-sidebar"
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
                        <!-- <a-menu-item
                            key="integration"
                            v-auth="[map.LIST_INTEGRATION]"
                        >
                            Integrations
                        </a-menu-item> -->
                    </a-menu-item-group>
                    <a-menu-item-group title="Logs">
                        <a-menu-item
                            key="query-logs"
                            v-auth="[map.QUERY_SQL_LOGS]"
                            >Query Logs</a-menu-item
                        >
                        <!-- <a-menu-item
                            key="access-logs"
                            v-auth="[map.QUERY_ACCESS_LOGS]"
                            >Access Logs</a-menu-item
                        > -->
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

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
