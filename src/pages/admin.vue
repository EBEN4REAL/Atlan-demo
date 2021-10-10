<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col w-1/5 h-full overflow-hidden bg-white border-r"
        >
            <div class="px-8 pt-4 pb-2">
                <p class="mb-0 text-2xl">Admin Centre</p>
            </div>

            <div class="flex flex-grow w-full px-6 mb-2 overflow-y-auto">
                <a-menu
                    mode="inline"
                    :class="$style.sidebar"
                    @click="handleClick"
                    v-model:selectedKeys="current"
                    :inlineIndent="0"
                >
                    <a-menu-item-group title="Workspace">
                        <!-- <a-menu-item key="general">General</a-menu-item> -->
                        <a-menu-item key="members">Members</a-menu-item>
                        <a-menu-item key="groups">Groups</a-menu-item>
                        <a-menu-item key="apikeys">API Keys</a-menu-item>
                        <!-- <a-menu-item key="integrations">Integrations</a-menu-item> -->
                        <!-- <a-menu-item key="billing">Billing & License</a-menu-item> -->
                    </a-menu-item-group>

                    <a-menu-item-group title="Access Control">
                        <a-menu-item key="classifications"
                            >Classifications</a-menu-item
                        >
                        <!-- <a-menu-item key="metadata_policies">Metadata Policies</a-menu-item>
            <a-menu-item key="data_policies">Data Policies</a-menu-item> -->
                        <a-menu-item key="personas">Personas</a-menu-item>
                        <a-menu-item key="sso">SSO</a-menu-item>
                        <a-menu-item key="smtp">SMTP</a-menu-item>
                        <a-menu-item key="requests">Requests</a-menu-item>
                    </a-menu-item-group>
                    <a-menu-item-group title="Metadata Management">
                        <a-menu-item key="custom-metadata">
                            Custom Metadata
                        </a-menu-item>
                        <a-menu-item key="enums"> Enums </a-menu-item>
                    </a-menu-item-group>
                    <a-menu-item-group title="Cloud & Compliance">
                        <!-- <a-menu-item key="accesslogs">Access Logs</a-menu-item>
            <a-menu-item key="auditlogs">Audit Logs</a-menu-item> -->
                        <!-- <a-menu-item key="releases">Releases</a-menu-item> -->
                        <a-menu-item key="health">Health Status</a-menu-item>
                        <!-- <a-menu-item key="observe">Observability</a-menu-item> -->
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

    export default defineComponent({
        setup() {
            const router = useRouter()
            const route = useRoute()

            const handleClick = ({ key }) => {
                router.push(`/admin/${key}`)
            }

            const initialRoute = route.path.split('/').slice(-1)
            const current = ref(
                initialRoute[0] === 'admin' ? ['members'] : initialRoute
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
</route>
