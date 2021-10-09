<template>
    <LoadingView v-if="!data?.asset" />
    <ErrorView v-else-if="data?.error" :error="data?.error" />

    <div v-if="data?.asset" class="w-full h-full max-profile-width">
        <div class="flex flex-col">
            <Header />

            <a-tabs
                v-if="assetType(data.asset).includes('Tableau')"
                :active-key="activeKey"
                :class="$style.profiletab"
                @change="selectBiTab($event)"
            >
                <a-tab-pane v-for="tab in biTabs" :key="tab.id" :tab="tab.name">
                    <component
                        class="bg-transparent"
                        :is="tab.component"
                        :key="activeKey || id"
                        :ref="
                            (el) => {
                                refs[tab.id] = el
                            }
                        "
                        @preview="handlePreview"
                    ></component>
                </a-tab-pane>
            </a-tabs>
            <a-tabs
                v-else
                :active-key="activeKey"
                :class="$style.profiletab"
                @change="selectNonBiTab($event)"
            >
                <a-tab-pane
                    v-for="tab in nonBiTabs"
                    :key="tab.id"
                    :tab="tab.name"
                >
                    <component
                        class="bg-transparent"
                        :is="tab.component"
                        :key="activeKey || id"
                        :ref="
                            (el) => {
                                refs[tab.id] = el
                            }
                        "
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
        toRefs,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    // Components
    import LoadingView from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import Header from '~/components/asset/assetProfile/header.vue'

    // Composables
    import useAsset from '~/composables/asset/useAsset'
    import { useBusinessMetadataStore } from '~/store/businessMetadata'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {
            Header,
            LoadingView,
            ErrorView,
            overview: defineAsyncComponent(
                () => import('@/asset/assetProfile/tabs/overview/index.vue')
            ),
            lineage: defineAsyncComponent(
                () => import('@/asset/assetProfile/tabs/lineage/index.vue')
            ),
            settings: defineAsyncComponent(
                () => import('@/asset/assetProfile/tabs/settings/index.vue')
            ),
            columns: defineAsyncComponent(
                () => import('@/asset/assetProfile/tabs/columns/index.vue')
            ),
        },

        emits: ['preview'],
        setup(props, context) {
            /** DATA */
            const activeKey = ref(1)
            const data = ref({})
            const refs: { [key: string]: any } = ref({})
            const biTabs = [
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
                /* {
                    id: 3,
                    name: 'Settings',
                    component: 'settings',
                }, */
            ]

            const nonBiTabs = [
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
                    name: 'Columns',
                    component: 'columns',
                },
            ]

            const { assetType } = useAssetInfo()

            /** UTILS */
            const router = useRouter()
            const route = useRoute()

            /** COMPUTED */
            const id = computed(() => route?.params?.id || '')

            /** METHODS */
            // selectTab
            const selectBiTab = (val: number) => {
                activeKey.value = val
                const selectedTab = biTabs.find((i) => i.id === val)
                router.replace(
                    `/assets/${id.value}/${selectedTab?.name.toLowerCase()}`
                )
            }
            const selectNonBiTab = (val: number) => {
                activeKey.value = val
                const selectedTab = nonBiTabs.find((i) => i.id === val)
                router.replace(
                    `/assets/${id.value}/${selectedTab?.name.toLowerCase()}`
                )
            }

            const store = useBusinessMetadataStore()
            const BMListLoaded = computed(
                () => store.getBusinessMetadataListLoaded
            )

            // handlePreview
            const handlePreview = (item) => {
                context.emit('preview', item)
            }

            // fetch
            const fetch = () => {
                if (BMListLoaded.value) {
                    const { data: response, error } = useAsset({
                        entityId: id.value,
                    })

                    watch(response, () => {
                        data.value.asset = response.value?.entities?.[0]
                        data.value.error = error.value

                        handlePreview(data.value?.asset)
                    })
                }
            }

            /** LIFECYCLES */
            onMounted(async () => {
                await fetch()

                const tab = route?.params?.tab
                if (!tab) return
                const currTab = nonBiTabs.find(
                    (i) => i.name.toLowerCase() === tab.toLowerCase()
                )
                activeKey.value = currTab.id
            })

            /** WATCHERS */
            watch(id, () => {
                if (id.value) fetch()
            })
            watch(BMListLoaded, (v: boolean) => {
                if (v) fetch()
            })

            /** PROVIDER */
            provide('assetData', data.value)

            return {
                id,
                activeKey,
                nonBiTabs,
                biTabs,
                handlePreview,
                refs,
                assetType,
                data,
                selectBiTab,
                selectNonBiTab,
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
            @apply ml-8;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray font-bold;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0 pl-7;
            @apply bg-white;
        }

        :global(.ant-tabs-tabpane) {
            height: calc(100vh - 170px) !important;
            overflow: auto !important;
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
<style lang="less" scoped>
    .max-profile-width {
        max-width: calc(100vw - 420px);
    }
</style>
