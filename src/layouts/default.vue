<template>
    <a-layout class="min-h-full">
        <a-layout-header class="z-30 h-10 p-0 m-0">
            <div class="h-full px-4 bg-white border-b">
                <NavMenu
                    :page="activeKey"
                    :is-sidebar-active="showNavbar"
                    @toggleNavbar="handleToggleNavbar"
                    @openNavbar="showNavbar = true"
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
                    <SidePanel :page="activeKey" @closeNavbar="closeNavbar" />
                </a-drawer>
                <div v-else style="min-width: 264px">
                    <SidePanel :page="activeKey" />
                </div>
                <div
                    class="w-full"
                    @click="handleClick"
                    @mouseover="showNavbar = false"
                >
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

        setup() {
            const router = useRouter()
            const showNavbar = ref(false)
            const { currentRoute } = router

            const keys = useMagicKeys()
            const esc = keys.Escape
            const activeKey = ref('/')
            const pages = [
                '/',
                '/assets',
                '/glossary',
                '/insights',
                '/connections',
                '/workflows',
                '/reporting',
                '/admin',
                '/platform',
            ]

            const curPath = computed(() => currentRoute.value.path)

            const handleToggleNavbar = () => {
                showNavbar.value = !showNavbar.value
            }
            const closeNavbar = () => {
                showNavbar.value = false
            }

            const updatePaths = () => {
                const page = `/${currentRoute.value.path.split('/')[1]}`
                if (pages.includes(page)) activeKey.value = page
                // else router.push('/')
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

            updatePaths()

            return {
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
