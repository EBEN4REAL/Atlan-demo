<template>
    <div class="flex flex-col w-full h-full">
        <AssetHeader :item="selectedAsset"></AssetHeader>
        <a-tabs :class="$style.profiletab" v-model:activeKey="activeKey">
            <a-tab-pane
                v-for="tab in getProfileTabs(selectedAsset)"
                :key="tab.name"
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
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        ref,
        watch,
        defineAsyncComponent,
    } from 'vue'
    import { useRoute } from 'vue-router'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import AssetHeader from '@/assets/profile/header/index.vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'

    export default defineComponent({
        name: 'AssetProfile',
        components: {
            AssetHeader,
            lineage: defineAsyncComponent(
                () => import('@/assets/profile/tabs/lineage/index.vue')
            ),
            columns: defineAsyncComponent(
                () => import('@/assets/profile/tabs/columns/index.vue')
            ),
        },
        setup() {
            const { selectedAsset, getProfileTabs } = useAssetInfo()

            const refs: { [key: string]: any } = ref({})

            const userHasEditPermission = ref<boolean>(true)

            const activeKey = ref('')

            const route = useRoute()
            const id = computed(() => route?.params?.id || null)

            const limit = ref(1)
            const offset = ref(0)

            const facets = ref({
                guid: id.value,
            })

            const fetchKey = computed(() => {
                if (selectedAsset.value.guid) {
                    return null
                }
                return id.value
            })

            const dependentKey = ref(fetchKey.value)
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])

            const {
                handleSelectedAsset,
                list,
                isLoading,

                // assetTypeAggregationList,
                // isLoadMore,
                // isValidating,
                // fetch,
                // quickChange,
                // handleSelectedAsset,
            } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            watch(list, () => {
                if (list.value.length > 0) {
                    handleSelectedAsset(list.value[0])
                }
            })

            const handleChangeTab = (key) => {
                console.log('ss')
                activeKey.value = key
            }

            const item = computed(() =>
                selectedAsset
                    ? selectedAsset
                    : list?.length > 0
                    ? list[0]
                    : undefined
            )

            // const route = useRoute()
            // const router = useRouter()
            // const id = computed(() => route?.params?.id || '')
            // router.replace(`/assets/${id.value}/overview`)

            const handlePreview = (v) => {
                console.log('handlePreview', v)
            }

            return {
                refs,
                userHasEditPermission,
                handlePreview,
                selectedAsset,
                item,
                fetchKey,
                getProfileTabs,
                activeKey,
                handleChangeTab,
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
