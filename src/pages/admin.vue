<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col w-1/6 h-full overflow-hidden bg-white border-r"
        >
            <!-- <div class="flex items-center px-6 mt-6 font-semibold">
                <AtlanIcon icon="Admin" class="mr-2 -mt-0.5" />
                <span class="text-base">Admin Center</span>
            </div> -->
            <div class="flex flex-grow w-full px-6 mt-3 mb-2 overflow-y-auto">
                <a-menu
                    v-model:selectedKeys="current"
                    mode="vertical"
                    style="width: inherit"
                    class="border-none admin-sidebar"
                    :inline-indent="1"
                    @click="handleClick"
                >
                    <a-menu-item-group title="Workspace">
                        <!-- TODO port to json -->
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
                            >API Tokens</a-menu-item
                        >
                        <a-menu-item key="sso" v-auth="[map.UPDATE_SSO]">
                            SSO
                        </a-menu-item>
                        <a-menu-item key="smtp" v-auth="[map.UPDATE_SMTP]">
                            SMTP
                        </a-menu-item>
                        <a-menu-item
                            key="integrations"
                            v-auth="[map.LIST_INTEGRATION]"
                        >
                            Integrations
                        </a-menu-item>
                        <a-menu-item key="labs" v-auth="[map.UPDATE_SSO]">
                            <!-- TODO: @rohan - change permission to Labs -->
                            Labs
                        </a-menu-item>
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
        <div class="w-5/6 max-h-screen px-6 overflow-y-auto">
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
