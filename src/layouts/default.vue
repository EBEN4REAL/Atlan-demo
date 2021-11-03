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
                    :maskClosable="true"
                    :style="{ position: 'absolute' }"
                    :mask="true"
                    :maskStyle="{
                        background: 'rgba(244, 246, 253, 0.9)',
                    }"
                    :class="$style.drawerStyles"
                    @close="handleClick"
                >
                    <SidePanel
                        :page="activeKey"
                        class="border-r border-gray-200"
                    />
                </a-drawer>
                <div style="min-width: 264px" v-else>
                    <SidePanel
                        :page="activeKey"
                        class="border-r border-gray-200"
                    />
                </div>
                <div class="w-full">
                    <CmndK
                        :isCmndKVisible="isCmndKVisible"
                        @closeModal="isCmndKVisible = false"
                    />
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
    <!-- <PreviewDrawer /> -->
    <!-- <div class="mx-auto mt-5" @click="themeToggle">[Default Layout]</div> -->
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useMagicKeys, whenever } from '@vueuse/core'

    import NavMenu from '@/common/layout/navMenu.vue'
    import SidePanel from '@/common/layout/sidePanel.vue'
    import CmndK from '~/components/common/commandk/cmndK.vue'

    export default defineComponent({
        name: 'Default Layout',
        components: {
            NavMenu,
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
            // watch for shortcut keys for command k
            whenever(keyK, () => {
                if (
                    (keyK.value && control.value) ||
                    (keyK.value && meta.value)
                ) {
                    showModal()
                    console.log('open cmnd k')
                    keyK.value = false
                    meta.value = false
                    control.value = false
                }
            })

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
