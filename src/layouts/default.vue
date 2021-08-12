<template>
    <a-layout class="min-h-full">
        <a-layout-header class="z-30 h-12 p-0 m-0">
            <div
                class="flex justify-between h-full px-4 bg-white border-b  text-gray"
            >
                <div
                    class="flex flex-row items-center space-x-4 text-base font-bold "
                >
                    <img
                        src="https://atlan.com/assets/img/atlan-blue.6ed81a56.svg"
                        class="w-auto h-4 cursor-pointer"
                        @click="() => handleChange('home')"
                    />
                    <a-menu
                        v-model:selectedKeys="activeKey"
                        class="h-full border-0"
                        mode="horizontal"
                    >
                        <a-dropdown :trigger="['hover']">
                            <a-menu-item
                                key="assets"
                                class="flex items-center px-4 cursor-pointer"
                                @click="() => handleChange('assets')"
                            >
                                Discover
                            </a-menu-item>
                            <template #overlay>
                                <div
                                    class="flex px-8 py-6 text-sm leading-4 bg-white border  min-w-96 dropdown"
                                >
                                    <div class="flex flex-col pr-4 border-r">
                                        <h2
                                            class="mb-4 text-base leading-5  text-gray"
                                        >
                                            Your Saved Filters
                                        </h2>
                                        <div class="flex flex-col">
                                            <a-button
                                                type="link"
                                                class="p-0 m-0"
                                                >Sales Dashboard 2021 (21
                                                assets)</a-button
                                            >
                                            <a-button
                                                type="link"
                                                class="p-0 m-0"
                                                >Sales Dashboard 2021 (21
                                                assets)</a-button
                                            >
                                            <a-button
                                                type="link"
                                                class="p-0 m-0"
                                                >Sales Dashboard 2021 (21
                                                assets)</a-button
                                            >
                                            <a-button
                                                type="link"
                                                class="p-0 m-0"
                                                >Sales Dashboard 2021 (21
                                                assets)</a-button
                                            >
                                        </div>
                                    </div>
                                    <div class="flex flex-col ml-4">
                                        <h2
                                            class="mb-4 text-base leading-5  text-gray"
                                        >
                                            Organisation's Saved Filters
                                        </h2>
                                        <div class="flex flex-col">
                                            <a-button
                                                type="link"
                                                class="p-0 m-0"
                                                >Sales Dashboard 2021 (21
                                                assets)</a-button
                                            >
                                            <a-button
                                                type="link"
                                                class="p-0 m-0"
                                                >Sales Dashboard 2021 (21
                                                assets)</a-button
                                            >
                                            <a-button
                                                type="link"
                                                class="p-0 m-0"
                                                >Sales Dashboard 2021 (21
                                                assets)</a-button
                                            >
                                            <a-button
                                                type="link"
                                                class="p-0 m-0"
                                                >Sales Dashboard 2021 (21
                                                assets)</a-button
                                            >
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </a-dropdown>
                        <a-menu-item
                            key="glossary"
                            class="flex items-center px-4 cursor-pointer"
                            @click="() => handleChange('glossary')"
                            >Glossary</a-menu-item
                        >
                        <a-menu-item
                            key="insights"
                            class="flex items-center px-4 cursor-pointer"
                            @click="() => handleChange('insights')"
                            >Insights</a-menu-item
                        >
                        <a-menu-item
                            key="connections"
                            class="flex items-center px-4 cursor-pointer"
                            @click="() => handleChange('connections')"
                            >Connectors</a-menu-item
                        >
                    </a-menu>
                </div>

                <div class="flex items-center space-x-6">
                    <a-input
                        placeholder="Search Atlan"
                        size="small"
                        class="h-8 rounded"
                        style="background: #f0f2f7"
                    >
                    </a-input>
                    <a-menu
                        v-model:selectedKeys="activeKey"
                        class="w-24 h-full border-0"
                        mode="horizontal"
                    >
                        <a-menu-item
                            key="admin"
                            class="flex items-center w-20 px-4 cursor-pointer"
                            @click="() => handleChange('admin')"
                        >
                            Admin
                        </a-menu-item>
                    </a-menu>
                    <fa icon="fal bell w-3"></fa>
                    <div class="flex items-center text-center">
                        <UserPersonalAvatar></UserPersonalAvatar>
                    </div>
                </div>
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
    import UserPersonalAvatar from '~/components/common/avatar/me.vue'
    import PreviewDrawer from '~/components/common/previewDrawer.vue'

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            UserPersonalAvatar,
            PreviewDrawer,
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
                admin: '/admin',
            }

            const handleChange = (key: string) => {
                if (key && Object.keys(pages).find((page) => page === key)) {
                    activeKey.value = [key]
                    router.push(pages[key])
                }
            }

            onMounted(() => {
                const { currentRoute } = router
                const page = currentRoute.value.path.split('/')[1]
                if (Object.keys(pages).find((item) => item === page)) {
                    activeKey.value = [page]
                }
            })
            return {
                handleChange,
                activeKey,
            }
        },
    })
</script>

<style lang="less" module></style>
