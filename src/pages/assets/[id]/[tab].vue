<template>
    <LoadingView v-if="!data?.asset" />
    <ErrorView v-else-if="data?.error" :error="data?.error" />

    <div v-if="data?.asset" class="w-full bg-white">
        <div class="z-30 h-24 p-4 bg-white">
            <AssetHeader :asset="data?.asset" />
        </div>
        <div class="asset-profile">
            <a-tabs :active-key="activeKey" @change="selectTab($event)">
                <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.name">
                    <component
                        :is="tab.component"
                        :key="activeKey || id"
                        :ref="
                            (el) => {
                                refs[tab.id] = el
                            }
                        "
                        :asset="data?.asset || {}"
                    ></component>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>
<script lang="ts">
    // Vue
    import {
        computed,
        defineComponent,
        ref,
        defineAsyncComponent,
        watch,
        onMounted,
    } from 'vue'
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
        setup(_, context) {
            /** DATA */
            const activeKey = ref(1)
            const data = ref({})
            const refs: { [key: string]: any } = ref({})
            const tabs = [
                {
                    id: 1,
                    name: 'Overview',
                    component: 'overview',
                },
                {
                    id: 2,
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
            const selectTab = (val: number) => {
                activeKey.value = val
                const selectedTab = tabs.find((i) => i.id === val)
                router.replace(
                    `/assets/${id.value}/${selectedTab?.name.toLowerCase()}`
                )
            }

            const fetch = () => {
                const { data: response, error } = useAsset({
                    entityId: id.value,
                })

                watch(response, () => {
                    data.value.asset = response.value?.entities?.[0]
                    data.value.error = error.value

                    context.emit('updateAssetPreview', data.value.asset ?? [])
                })
            }

            onMounted(() => {
                const tab = route?.params?.tab
                if (!tab) return
                const currTab = tabs.find(
                    (i) => i.name.toLowerCase() === tab.toLowerCase()
                )
                activeKey.value = currTab.id
                fetch()
            })

            watch(id, () => fetch())

            return {
                id,
                activeKey,
                tabs,
                refs,
                data,
                selectTab,
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
            @apply px-4 bg-white m-0 !important;
        }
        .ant-tabs-top-bar {
            @apply m-0 !important;
        }
    }
</style>
