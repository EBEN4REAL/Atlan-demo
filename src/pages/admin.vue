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
                    <a-menu-item-group v-if="sectionPermissions.workspace" title="Workspace">
                        <a-menu-item v-if="activePermissions.overview" key="overview">Overview</a-menu-item>
                        <a-menu-item v-if="activePermissions.members" key="members">Members</a-menu-item>
                        <a-menu-item v-if="activePermissions.groups" key="groups">Groups</a-menu-item>
                        <a-menu-item v-if="activePermissions.sso" key="sso">SSO</a-menu-item>
                        <a-menu-item v-if="activePermissions.smtp" key="smtp">SMTP</a-menu-item>
                        <a-menu-item v-if="activePermissions.integrations" key="integrations"
                            >Integrations</a-menu-item
                        >
                    </a-menu-item-group>

                    <a-menu-item-group v-if="sectionPermissions.accessControl" title="Access Control">
                        <a-menu-item v-if="activePermissions.personas" key="personas">Personas</a-menu-item>
                        <a-menu-item v-if="activePermissions.apiKeys" key="apikeys">API Keys</a-menu-item>
                    </a-menu-item-group>
                    <a-menu-item-group v-if="sectionPermissions.governance" title="Governance">
                        <a-menu-item v-if="activePermissions.classifications" key="classifications"
                            >Classifications</a-menu-item
                        >
                        <a-menu-item v-if="activePermissions.requests" key="requests">Requests</a-menu-item>
                        <a-menu-item key="custom-metadata">
                            Custom Metadata
                        </a-menu-item>
                        <a-menu-item v-if="activePermissions.enums" key="enums"> Enums </a-menu-item>
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
    import { useAccessStore } from '~/services/access/accessStore'

    export default defineComponent({
        setup() {
            const router = useRouter()
            const route = useRoute()
            const accessStore = useAccessStore()

            const handleClick = ({ key }) => {
                router.push(`/admin/${key}`)
            }

            const activePermissions = computed(() => ({
                overview: accessStore.checkPermission('UPDATE_WORKSPACE'),
                members: accessStore.checkPermission('LIST_USERS'),
                groups: accessStore.checkPermission('LIST_GROUPS'),
                sso: true,
                smtp: true,
                integrations: true,
                personas: accessStore.checkPermission('LIST_PERSONA'),
                purpose: accessStore.checkPermission('LIST_PURPOSE'),
                apiKeys: accessStore.checkPermission('LIST_APIKEY'),
                classifications: accessStore.checkPermission('LIST_CLASSIFICATION'),
                requests: accessStore.checkPermission('LIST_REQUEST'),
                metaData: accessStore.checkPermission('LIST_BUSINESS_METADATA'),
                enums: accessStore.checkPermission('LIST_ENUM'),
            }))
            const sectionPermissions = computed(() => ({
                workspace: accessStore.checkAnyPermissionExists(['UPDATE_WORKSPACE', 'LIST_USERS', 'LIST_GROUPS']),
                accessControl: accessStore.checkAnyPermissionExists(['LIST_PERSONA', 'LIST_PURPOSE', 'LIST_APIKEY']),
                governance: accessStore.checkAnyPermissionExists(['LIST_CLASSIFICATION', 'LIST_REQUEST', 'LIST_BUSINESS_METADATA', 'LIST_ENUM']),

            }))

            const initialRoute = route.path.split('/').slice(-1)
            const current = ref(
                initialRoute[0] === 'admin' ? ['members'] : initialRoute
            )

            return {
                handleClick,
                current,
                activePermissions,
                sectionPermissions
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
