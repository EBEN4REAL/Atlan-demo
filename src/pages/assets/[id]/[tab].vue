<template>
    <LoadingView v-if="!data?.asset" />
    <ErrorView v-else-if="data?.error" :error="data?.error" />

    <div v-if="data?.asset" class="w-full">
        <div class="z-30 px-4 pt-5 pb-3 bg-white">
            <assetProfileHeader :asset="data?.asset" />
        </div>
        <div class="asset-profile">
            <a-tabs
                :active-key="activeKey"
                :class="$style.profiletab"
                @change="selectTab($event)"
            >
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
                        @preview="handlePreview"
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
        provide,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    // Components
    import LoadingView from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import assetProfileHeader from '@/asset/assetProfile/assetProfileHeader.vue'
    import useAsset from '~/composables/asset/useAsset'

    export default defineComponent({
        components: {
            assetProfileHeader,
            LoadingView,
            ErrorView,
            overview: defineAsyncComponent(
                () =>
                    import(
                        '~/components/asset/assetProfile/tabs/overview/index.vue'
                    )
            ),
            lineage: defineAsyncComponent(
                () =>
                    import(
                        '~/components/asset/assetProfile/tabs/lineage/index.vue'
                    )
            ),
            settings: defineAsyncComponent(
                () =>
                    import(
                        '~/components/asset/assetProfile/tabs/settings/index.vue'
                    )
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
                {
                    id: 3,
                    name: 'Settings',
                    component: 'settings',
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
            const handlePreview = (item) => {
                context.emit('preview', item)
            }

            /** PROVIDER */

            provide('assetData', data.value)

            return {
                id,
                activeKey,
                tabs,
                handlePreview,
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

<style lang="less" module>
    .profiletab {
        :global(.ant-tabs-tab) {
            padding-left: 2px;
            padding-right: 2px;
            @apply pb-5 mr-5 text-gray-500 text-sm tracking-wide;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-5;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray font-bold;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0;
        }
        :global(.ant-tabs-content) {
            @apply pr-0;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 pb-0 !important;
        }
    }
</style>
