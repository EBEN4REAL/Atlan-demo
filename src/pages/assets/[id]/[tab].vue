<template>
    <LoadingView v-if="!data?.asset" />
    <ErrorView v-else-if="data?.error" :error="data?.error" />

    <div v-else class="w-full h-full max-profile-width">
        <div class="flex flex-col">
            <Header />
            <div
                v-if="data?.asset?.guid === '-1'"
                style="height: calc(100vh - 170px)"
            >
                <NoAccessPage
                    ><div class="flex flex-col items-center justify-center">
                        <div>
                            Oops, looks like you don’t have<br />access to view
                            this asset!
                        </div>
                        <a-button class="flex mt-2" @click="$router.back()">
                            <atlan-icon
                                icon="ArrowRight"
                                class="mt-0.5 mr-1 transform rotate-180"
                            />Back to assets</a-button
                        >
                    </div>
                </NoAccessPage>
            </div>
            <div v-else>
                <a-tabs
                    v-if="assetType(data.asset)?.includes('Tableau')"
                    :active-key="activeKey"
                    :class="$style.profiletab"
                    @change="selectBiTab($event)"
                >
                    <a-tab-pane
                        v-for="tab in biTabs"
                        :key="tab.id"
                        :tab="tab.name"
                    >
                        <component
                            :is="tab.component"
                            :key="activeKey || id"
                            :ref="
                                (el) => {
                                    refs[tab.id] = el
                                }
                            "
                            :user-has-edit-permission="userHasEditPermission"
                            class="bg-transparent"
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
                            :is="tab.component"
                            :key="activeKey || id"
                            :ref="
                                (el) => {
                                    refs[tab.id] = el
                                }
                            "
                            :user-has-edit-permission="userHasEditPermission"
                            class="bg-transparent"
                            @preview="handlePreview"
                        ></component>
                    </a-tab-pane>
                </a-tabs>
            </div>
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
    import NoAccessPage from '@/discovery/noAccess.vue'
    import Header from '~/components/asset/assetProfile/header.vue'

    // Composables
    import useAsset from '~/composables/asset/useAsset'
    import useBusinessMetadataStore from '~/store/businessMetadata'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import useCheckAccess from '~/services/access/useCheckAccess'

    // Constants
    import { AssetTypeList } from '~/constant/assetType'

    export default defineComponent({
        components: {
            Header,
            LoadingView,
            ErrorView,
            NoAccessPage,
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
            relationships: defineAsyncComponent(
                () =>
                    import(
                        '@/asset/assetProfile/tabs/overview/tableauAsset/overviewRelations.vue'
                    )
            ),
        },

        emits: ['preview'],
        setup(props, context) {
            /** DATA */
            const activeKey = ref(1)
            const data = ref({})
            const refs: { [key: string]: any } = ref({})
            const userHasEditPermission = ref<any>({})

            const biTabs = [
                {
                    id: 1,
                    name: 'Overview',
                    component: 'overview',
                },
                {
                    id: 2,
                    name: 'Relationships',
                    component: 'relationships',
                },
                {
                    id: 3,
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

            const { evaluatePermissions } = useCheckAccess()

            /** COMPUTED */
            const id = computed(() => route?.params?.id || '')
            // Evaluating this here, so we don't have to do it again separetly in header & summary card
            // TODO: remove after fixing hierarchy bug
            // const parentForBIAsset = computed(() => {
            //     if (assetType(data.value?.asset).includes('Tableau')) {
            //         const typeObject = AssetTypeList.find(
            //             (type) => type.id === assetType(data?.value?.asset)
            //         )
            //         if (
            //             typeObject &&
            //             typeObject.parents &&
            //             typeObject.parents.length
            //         ) {
            //             const { parents } = typeObject
            //             // eslint-disable-next-line no-restricted-syntax
            //             for (const parent of parents) {
            //                 const parentObj = AssetTypeList.find(
            //                     (type) => type.id === parent
            //                 )
            //                 if (parentObj && parentObj.nameAttribute) {
            //                     if (
            //                         data?.value?.asset?.attributes[
            //                             parentObj.nameAttribute
            //                         ]
            //                     )
            //                         return {
            //                             [parentObj.label]:
            //                                 data?.value?.asset?.attributes[
            //                                     parentObj.nameAttribute
            //                                 ],
            //                         }
            //                 }
            //                 return {}
            //             }
            //         }
            //     }
            //     return {}
            // })
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
                        if (data.value?.asset?.guid !== '-1') {
                            handlePreview(data.value?.asset)
                        }

                        const { data: userPermission } = evaluatePermissions(
                            data.value?.asset,
                            'ENTITY_UPDATE'
                        )
                        userHasEditPermission.value = { userPermission }
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

            // TODO: remove after fixing hierarchy bug
            // provide('parentForBIAsset', parentForBIAsset)

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
                userHasEditPermission,
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
