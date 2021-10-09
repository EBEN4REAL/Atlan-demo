<template>
    <a-layout class="min-h-full">
        <a-layout-header class="z-30 h-12 p-0 m-0">
            <div class="h-full px-5 bg-white border-b">
                <NavMenu
                    :page="activeKey[0]"
                    @change="handleChange"
                    @toggleNavbar="handleToggleNavbar"
                />
            </div>
        </a-layout-header>

        <a-layout class="h-full">
            <a-layout-content
                class="relative overflow-hidden"
                :class="{ flex: activeKey[0] === '/' }"
                style="height: calc(100vh - 48px) !important"
            >
                <a-drawer
                    v-if="activeKey[0] !== '/'"
                    placement="left"
                    :destroyOnClose="true"
                    :visible="showNavbar && activeKey[0] !== '/'"
                    :get-container="false"
                    :closable="false"
                    :wrap-style="{ position: 'absolute' }"
                    :mask="false"
                    :class="$style.drawerStyles"
                >
                    <SidePanel :page="activeKey[0]" @change="handleChange" />
                </a-drawer>
                <div v-else style="min-width: 264px">
                    <SidePanel :page="activeKey[0]" @change="handleChange" />
                </div>
                <router-view class="flex-grow" />
            </a-layout-content>
        </a-layout>
    </a-layout>
    <PreviewDrawer />
    <!-- <div class="mx-auto mt-5" @click="themeToggle">[Default Layout]</div> -->
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

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

            const activeKey = ref(['/'])
            const pages: Record<string, string> = {
                home: '/',
                assets: '/assets',
                glossary: '/glossary',
                insights: '/insights',
                connections: '/connections',
                workflows: '/workflows',
                admin: '/admin',
                404: '/404',
            }

            const handleChange = (key: string) => {
                if (key && Object.keys(pages).find((page) => page === key)) {
                    activeKey.value = [key]
                    router.push(pages[key])
                } else {
                    router.push(pages[404])
                }
            }
            const handleToggleNavbar = () => {
                showNavbar.value = !showNavbar.value
            }

            onMounted(() => {
                const { currentRoute } = router
                const page = currentRoute.value.path.split('/')[1]
                if (Object.keys(pages).find((item) => item === page)) {
                    activeKey.value = [page]
                } else {
                    router.push(pages['home'])
                }
            })
            return {
                handleChange,
                activeKey,
                handleToggleNavbar,
                showNavbar,
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
