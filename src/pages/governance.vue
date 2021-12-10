<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col w-1/5 h-full overflow-hidden bg-white border-r"
        >
            <div class="flex flex-grow w-full px-6 mt-4 mb-2 overflow-y-auto">
                <a-menu
                    v-model:selectedKeys="current"
                    mode="inline"
                    :class="$style.sidebar"
                    :inline-indent="0"
                    @click="handleClick"
                >
                    <a-menu-item-group title="Access Control">
                        <a-menu-item key="personas" v-auth="[map.LIST_PERSONA]"
                            >Personas</a-menu-item
                        >
                        <a-menu-item key="purposes" v-auth="[map.LIST_PURPOSE]"
                            >Purposes</a-menu-item
                        >
                    </a-menu-item-group>

                    <a-menu-item-group title="Governance">
                        <a-menu-item
                            key="classifications"
                            v-auth="map.LIST_CLASSIFICATION"
                        >
                            Classifications
                        </a-menu-item>

                        <a-menu-item key="requests" v-auth="[map.LIST_USERS]"
                            >Requests</a-menu-item
                        >

                        <a-menu-item
                            key="custom-metadata"
                            v-auth="[map.LIST_BUSINESS_METADATA]"
                        >
                            Custom Metadata
                        </a-menu-item>
                        <a-menu-item key="enums" v-auth="[map.LIST_ENUM]">
                            Enums
                        </a-menu-item>
                    </a-menu-item-group>
                    <a-menu-item-group title="Logs">
                        <a-menu-item
                            key="query-logs"
                            v-auth="[map.QUERY_SQL_LOGS]"
                            >Query Logs</a-menu-item
                        >
                      <a-menu-item
                            key="accessLogs"
                            v-auth="[map.QUERY_ACCESS_LOGS]"
                            >Access Logs</a-menu-item
                        >
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
    import { computed, defineComponent, ref } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    import map from '~/constant/accessControl/map'

    export default defineComponent({
        setup() {
            const router = useRouter()
            const route = useRoute()

            const handleClick = ({ key }) => {
                router.push(`/governance/${key}`)
            }

            const initialRoute = route.path.split('/').slice(-1)
            const current = ref(
                initialRoute[0] === 'governance' ? ['persona'] : initialRoute
            )

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
