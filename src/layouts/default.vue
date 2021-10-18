<template>
    <a-layout class="min-h-full">
        <a-layout-header class="z-30 h-10 p-0 m-0">
            <div class="h-full px-4 bg-white border-b">
                <NavMenu
                    :page="activeKey[0]"
                    :is-sidebar-active="showNavbar"
                    @change="handleChange"
                    @toggleNavbar="handleToggleNavbar"
                />
            </div>
        </a-layout-header>

        <a-layout class="w-full h-full">
            <a-layout-content
                class="relative flex w-full overflow-hidden"
                style="height: calc(100vh - 48px) !important"
            >
                <a-drawer
                    v-if="currentRoute.path !== '/'"
                    placement="left"
                    :destroyOnClose="true"
                    :visible="showNavbar"
                    :get-container="false"
                    :closable="false"
                    :wrap-style="{ position: 'absolute' }"
                    :mask="false"
                    :class="$style.drawerStyles"
                >
                    <SidePanel
                        :page="activeKey[0]"
                        @change="handleChange"
                        @closeNavbar="closeNavbar"
                    />
                </a-drawer>
                <div v-else style="min-width: 264px">
                    <SidePanel :page="activeKey[0]" @change="handleChange" />
                </div>
                <div class="w-full" @click="handleClick">
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
    <PreviewDrawer />
    <!-- <div class="mx-auto mt-5" @click="themeToggle">[Default Layout]</div> -->
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted, watch, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useMagicKeys } from '@vueuse/core'

    import KeycloakMixin from '~/mixins/keycloak'
    import PreviewDrawer from '~/components/common/previewDrawer.vue'
    import NavMenu from '~/components/common/navMenu.vue'
    import SidePanel from '~/components/home/sidePanel.vue'

    export default defineComponent({
        name: 'Default Layout',
        components: {
            PreviewDrawer,
            NavMenu,
            SidePanel,
        },
        mixins: [KeycloakMixin],
        setup() {
            const router = useRouter()
            const showNavbar = ref(false)
            const { currentRoute } = router

            const keys = useMagicKeys()
            const esc = keys.Escape
            const activeKey = ref(['/'])
            const pages: Record<string, string> = {
                home: '/',
                assets: '/assets',
                glossary: '/glossary',
                insights: '/insights',
                connections: '/connections',
                workflows: '/workflows',
                reporting: '/reporting',
                admin: '/admin',
                platform: '/platform',
                404: '/404',
            }
            const curPath = computed(() => currentRoute.value.path)

            const handleChange = (key: string) => {
                if (key && Object.keys(pages).find((page) => page === key)) {
                    activeKey.value = key === 'home' ? ['/'] : [key]
                    router.push(pages[key])
                } else {
                    router.push(pages[404])
                }
                showNavbar.value = false
            }
            const handleToggleNavbar = () => {
                showNavbar.value = !showNavbar.value
            }
            const closeNavbar = () => {
                showNavbar.value = false
            }

            const updatePaths = () => {
                const page = currentRoute.value.path.split('/')[1]
                if (Object.keys(pages).find((item) => item === page)) {
                    activeKey.value = [page]
                } else {
                    router.push(pages['home'])
                }
            }
            watch(esc, (v) => {
                if (v) {
                    closeNavbar()
                }
            })
            const handleClick = () => {
                if (showNavbar.value) showNavbar.value = false
            }
            watch(curPath, () => {
                updatePaths()
            })

            onMounted(() => {
                updatePaths()
            })
            return {
                handleChange,
                activeKey,
                handleToggleNavbar,
                showNavbar,
                currentRoute,
                closeNavbar,
                handleClick,
            }
        },
    })
</script>
<style lang="less" module>
    .drawerStyles {
        :global(.ant-drawer-body) {
            @apply h-full !important;
        }
    }
</style>
