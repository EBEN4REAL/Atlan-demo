<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col w-1/6 h-full overflow-hidden bg-white border-r"
        >
            <div class="flex items-center px-6 mt-6 font-semibold">
                <AtlanIcon icon="GovernanceCenter" class="mr-2 -mt-0.5" />
                <span class="text-base">Governance Center</span>
            </div>

            <div class="flex flex-grow w-full px-6 mt-4 mb-2 overflow-y-auto">
                <a-menu
                    v-model:selectedKeys="current"
                    mode="vertical"
                    class="border-none admin-sidebar"
                    :inlineIndent="1"
                    style="width: 100%"
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
                    </a-menu-item-group>
                    <a-menu-item-group title="Metadata">
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
                </a-menu>
            </div>
        </div>
        <div class="w-5/6 max-h-screen overflow-y-auto">
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
                initialRoute[0] === 'governance' ? ['personas'] : initialRoute
            )
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
