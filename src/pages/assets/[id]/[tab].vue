<template>
    <LoadingView v-if="loading" />
    <ErrorView v-else-if="error" :error="error" />
    <div v-else class="w-full bg-gray-100">
        <div class="h-24 p-4 bg-white">
            <AssetHeader :asset="response?.entities[0]" />
        </div>
        <div class="asset-profile">
            <a-tabs v-model="activeKey" @change="selectTab($event)">
                <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.name">
                    <component
                        :is="tab.component"
                        :ref="
                            (el) => {
                                refs[tab.id] = el
                            }
                        "
                        :asset="response?.entities[0] || {}"
                    ></component>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>
<script lang="ts">
    // Vue
    import { computed, defineComponent, ref, defineAsyncComponent } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    // Components
    import LoadingView from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import AssetHeader from '~/components/asset/assetProfile/assetHeader.vue'
    import useAsset from '~/composables/asset/useAsset'

    export default defineComponent({
        components: {
            AssetHeader,
            LoadingView,
            ErrorView,
            overview: defineAsyncComponent(
                () =>
                    import('~/components/asset/assetProfile/tabs/overview.vue')
            ),
            lineage: defineAsyncComponent(
                () => import('~/components/asset/assetProfile/tabs/lineage.vue')
            ),
        },
        setup() {
            /** DATA */
            const activeKey = ref('1')
            const refs: { [key: string]: any } = ref({})
            const tabs = [
                {
                    id: '1',
                    name: 'Overview',
                    component: 'overview',
                },
                {
                    id: '2',
                    name: 'Lineage',
                    component: 'lineage',
                },
            ]

            /** UTILS */
            const router = useRouter()
            const route = useRoute()

            /** COMPUTED */
            const id = computed(() => route?.params?.id || '')

            /** METHODS */
            const selectTab = (activeKey) => {
                const selectedTab = tabs.find((i) => i.id === activeKey)
                router.replace(
                    `/assets/${id.value}/${selectedTab.name.toLowerCase()}`
                )
            }
            const { response, error, loading } = useAsset({
                entityId: id.value,
            })

            return {
                activeKey,
                tabs,
                refs,
                selectTab,
                response,
                error,
                loading,
            }
        },
    })
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>

<style lang="less">
    .asset-profile {
        .ant-tabs-bar {
            @apply px-4 bg-white  !important;
        }
    }
</style>
