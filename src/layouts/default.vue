<template>
    <a-layout class="min-h-full">
        <a-layout-header class="z-30 h-12 p-0 m-0">
            <div class="h-full px-5 bg-white border-b">
                <NavMenu :page="activeKey[0]" @change="handleChange" />
            </div>
        </a-layout-header>

        <a-layout class="h-full">
            <a-layout-content
                class="overflow-hidden"
                style="height: calc(100vh - 48px) !important"
            >
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

    export default defineComponent({
        name: 'Default Layout',
        components: {
            PreviewDrawer,
            NavMenu,
        },
        mixins: [KeycloakMixin],
        setup() {
            const router = useRouter()

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
                }else {
                    router.push(pages[404])
                }
            }

            onMounted(() => {
                const { currentRoute } = router
                const page = currentRoute.value.path.split('/')[1]
                if (Object.keys(pages).find((item) => item === page)) {
                    activeKey.value = [page]
                }else {
                    router.push(pages[404])
                }
            })
            return {
                handleChange,
                activeKey,
            }
        },
    })
</script>
