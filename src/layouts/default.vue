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
                style="height: calc(100vh - 40px) !important"
            >
                <a-drawer
                    v-if="currentRoute.path !== '/'"
                    placement="left"
                    :destroy-on-close="true"
                    :visible="showNavbar"
                    :get-container="false"
                    :closable="false"
                    :mask-closable="true"
                    :style="{ position: 'absolute' }"
                    :content-wrapper-style="{ width: '264px' }"
                    :mask="true"
                    :mask-style="{
                        background: 'rgba(244, 246, 253, 0.9)',
                    }"
                    :class="$style.drawerStyles"
                    @close="handleClick"
                >
                    <SidePanel
                        :page="activeKey"
                        class="border-r border-gray-200"
                        @closeNavbar="closeNavbar"
                        @mouseleave="closeNavbar"
                    />
                </a-drawer>
                <div v-else style="min-width: 264px">
                    <SidePanel
                        :page="activeKey"
                        class="border-r border-gray-200"
                        @closeNavbar="closeNavbar"
                    />
                </div>

                <div class="w-full overflow-y-auto">
                    <a-modal
                        v-model:visible="isCmndKVisible"
                        width="630px"
                        class="rounded-md"
                        :destroy-on-close="true"
                        wrap-class-name="rounded-md"
                        :class="$style.modalStyles"
                        :closable="false"
                        :footer="null"
                        :mask="true"
                    >
                        <CmndK
                            :is-cmnd-k-visible="isCmndKVisible"
                            @closeModal="isCmndKVisible = false"
                    /></a-modal>

                    <router-view />
                </div>
                <div id="overAssetSidebar" class="bg-white"></div>
            </a-layout-content>
        </a-layout>
    </a-layout>
    <PreviewDrawer />
    <!-- <div class="mx-auto mt-5" @click="themeToggle">[Default Layout]</div> -->
</template>

<script lang="ts">
    import { defineComponent, provide, ref, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { useMagicKeys, whenever } from '@vueuse/core'
    import PreviewDrawer from '@/common/drawer/previewDrawer.vue'

    import NavMenu from '@/common/layout/navMenu.vue'
    import SidePanel from '@/common/layout/sidePanel.vue'
    import CmndK from '~/components/common/commandk/cmndK.vue'

    export default defineComponent({
        name: 'DefaultLayout',
        components: {
            NavMenu,
            PreviewDrawer,
            SidePanel,
            CmndK,
        },
        setup() {
            const router = useRouter()
            const showNavbar = ref(false)
            const { currentRoute } = router
            const activeKey = ref('')
            // shortcuts for comand k
            const keys = useMagicKeys()
            const { control, meta, meta_K } = keys
            const keyK = keys.K
            const isCmndKVisible = ref<boolean>(false)
            const showModal = () => {
                isCmndKVisible.value = true
            }
            provide('togglecmdK', () => {
                isCmndKVisible.value = !isCmndKVisible.value
            })

            // watch for shortcut keys for command k
            whenever(keyK, () => {
                if (
                    (keyK.value && control.value) ||
                    (keyK.value && meta.value)
                ) {
                    showModal()
                    keyK.value = false
                    meta.value = false
                    control.value = false
                }
            })

            watch(currentRoute, () => {
                isCmndKVisible.value = false
            })

            const closeNavbar = () => {
                showNavbar.value = false
            }

            const handleToggleNavbar = () => {
                showNavbar.value = !showNavbar.value
            }

            const handleClick = () => {
                if (showNavbar.value) handleToggleNavbar()
            }

            return {
                activeKey,
                handleToggleNavbar,
                showNavbar,
                handleClick,
                currentRoute,
                isCmndKVisible,
                closeNavbar,
            }
        },
    })
</script>
<style lang="less" module>
    .drawerStyles {
        :global(.ant-drawer-body) {
            @apply h-full !important;
            width: 264px;
        }
        :global(.ant-drawer-content-wrapper) {
            width: 264px;
        }
    }
</style>
