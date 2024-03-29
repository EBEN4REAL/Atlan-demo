<template>
    <a-drawer
        placement="right"
        :destroy-on-close="true"
        :visible="isVisible"
        :get-container="getContainer"
        :closable="false"
        :mask="false"
        :class="$style.drawerStyle"
        :width="460"
        @close="$emit('close')"
    >
        <div class="relative flex flex-col h-full bg-white">
            <div
                class="flex items-center p-4 bg-white border-b border-gray-300"
            >
                <AtlanBtn
                    class="border-none btn-add-assets"
                    size="sm"
                    padding="compact"
                    data-test-id="cross"
                    color="secondary"
                    @click="() => (isVisible = false)"
                >
                    <AtlanIcon icon="ArrowRight" class="-rotate-180" />
                </AtlanBtn>
                <span class="text-lg font-bold text-gray-700">Add Assets</span>
                <div class="flex items-center ml-auto w-fit">
                    <span
                        v-if="selectedAssetCount"
                        class="mr-3 text-sm font-bold text-gray-500"
                        >{{
                            `${selectedAssetCount} ${
                                selectedAssetCount > 1 ? 'assets' : 'asset'
                            } added`
                        }}
                    </span>
                    <!-- <AtlanBtn
                        padding="compact"
                        class="px-7 h-fit"
                        @click="saveAssets"
                    >
                        Add
                    </AtlanBtn> -->
                </div>
            </div>

            <RaisedTab
                v-model:active="activeTab"
                class="mx-4 mt-3 bg-gray-200 tab-select-asset"
                :data="tabConfig"
            />
            <div class="my-4" />

            <div
                class="relative overflow-x-hidden overflow-y-hidden drawer_height"
            >
                <div
                    class="absolute w-full h-full bg-white"
                    :class="
                        activeTab === 'tree' ? 'front-z-index' : 'rear-z-index'
                    "
                >
                    <span class="mx-4 mt-2 text-base font-bold text-gray-500"
                        >Browse from your assets</span
                    >
                    <div class="h-full p-4 overflow-y-auto wrapper-asset-tree">
                        <AssetBrowserTree
                            v-model:assets="checkedKeys"
                            :connection-qf-name="connectionQfName"
                        />
                    </div>
                </div>

                <div
                    class="absolute w-full h-full bg-white assets-wrapper"
                    :class="
                        activeTab === 'list' ? 'front-z-index' : 'rear-z-index'
                    "
                >
                    <span class="mx-4 mt-2 text-base font-bold text-gray-500"
                        >Search from your assets</span
                    >
                    <!-- <AssetsWrapper class="h-full" :data-map="filterConfig" /> -->
                    <AssetsWrapper
                        :show-filters="false"
                        :static-use="true"
                        :show-aggrs="true"
                        :show-check-box="true"
                        :initial-filters="filterConfig"
                        checked-criteria="qualifiedName"
                        :preference="preference"
                        page="personas"
                        :all-checkbox-area-click="true"
                    />
                </div>

                <div
                    class="absolute w-full h-full bg-white"
                    :class="
                        activeTab === 'custom'
                            ? 'front-z-index'
                            : 'rear-z-index'
                    "
                >
                    <span class="mx-4 mt-2 text-base font-bold text-gray-500"
                        >Select assets matching
                    </span>
                    <CustomAssetSelector
                        v-model:assets="regexKeys"
                        class="h-full py-4"
                        :connection-qf-name="connectionQfName"
                    />
                </div>
            </div>

            <div
                class="absolute bottom-0 flex items-center justify-end w-full p-3 bg-white border-t border-gray-300 gap-x-2"
            >
                <span class="pl-2 mr-auto text-gray-500"
                    >{{ selectedAssetCount || 'No' }} items selected</span
                >
                <AtlanBtn
                    size="sm"
                    padding="compact"
                    color="secondary"
                    data-test-id="cancel"
                    class="btn-asset"
                    @click="closeDrawer"
                >
                    Cancel
                </AtlanBtn>
                <AtlanBtn
                    size="sm"
                    padding="compact"
                    data-test-id="save"
                    class="btn-asset"
                    @click="saveAssets"
                >
                    Save
                </AtlanBtn>
            </div>
        </div>
    </a-drawer>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        toRaw,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import RaisedTab from '@/UI/raisedTab.vue'
    import AssetBrowserTree from './assetBrowserTree.vue'
    import CustomAssetSelector from './customAssetSelector.vue'
    import useBulkUpdateStore from '~/store/bulkUpdate'
    import AssetsWrapper from '@/assets/index.vue'

    export default defineComponent({
        name: 'AssetSelector',
        components: {
            AtlanBtn,
            AssetBrowserTree,
            RaisedTab,
            AssetsWrapper,
            CustomAssetSelector,
        },
        props: {
            connectionQfName: {
                type: String,
                required: true,
            },
            assets: {
                type: Array as PropType<string[]>,
                required: true,
            },
            visible: {
                type: Boolean,
                default: () => false,
            },
            getContainer: {
                type: Boolean,
                default: () => false,
            },
            biTypes: {
                type: Array,
                required: true,
            },
        },
        emits: ['update:visible', 'update:assets'],
        setup(props, { emit }) {
            const { visible, assets, connectionQfName, biTypes } = toRefs(props)
            const preference = ref({
                sort: 'default',
                display: [],
            })

            const bulkStore = useBulkUpdateStore()

            // Drawer Visibility
            const isVisible = computed({
                get: () => visible.value,
                set: (val) => {
                    emit('update:visible', val)
                },
            })

            // Asset related stuff
            const checkedKeys = ref([...assets.value] as string[])
            const regexKeys = ref([] as string[])
            const BIAssets = computed(() => biTypes.value)
            bulkStore.setBulkSelectedAssets(toRaw(checkedKeys.value))

            const getConnectorName = (qualifiedName: string) => {
                let attributeValues: string[]
                let connectorName: string = ''
                if (qualifiedName) {
                    attributeValues = qualifiedName?.split('/')
                    if (attributeValues.length > 0) {
                        connectorName = attributeValues[1]
                    }
                }

                return connectorName
            }

            function closeDrawer() {
                isVisible.value = false
            }

            /* Adds /* to pathname */
            const addSufffix = (qualifiedNames: string[]) =>
                qualifiedNames?.map((qualifiedName) => `${qualifiedName}/*`) ??
                []

            function saveAssets() {
                // TODO: Optional* Change this implementation
                // Use a WritableComputedRef and the @check event
                // to see which node got selected or unselected and
                // use a set to maintain the state
                const assetSet = new Set([
                    ...checkedKeys.value,
                    ...regexKeys.value,
                    ...bulkStore.bulkSelectedAssets,
                ])
                emit('update:assets', [...assetSet])
                bulkStore.setBulkSelectedAssets([])
                closeDrawer()
            }

            const selectedAssetCount = computed(() => {
                const s = new Set([
                    ...checkedKeys?.value,
                    ...regexKeys.value,
                    ...bulkStore.bulkSelectedAssets,
                ])
                return s.size
            })

            const filterConfig = computed(() => ({
                hierarchy: {
                    connectorName: getConnectorName(connectionQfName.value),
                    connectionQualifiedName: connectionQfName.value,
                },
                typeName:
                    getConnectorName(connectionQfName.value) === 's3'
                        ? 'S3Bucket'
                        : null,
            }))

            // Tab related data
            const activeTab = ref('custom')
            const tabConfig = ref([{ key: 'custom', label: 'Custom' }])
            /* For sync b/w tree and selected assets */
            watch(checkedKeys, () => {
                /* NOTE: If condiion is IMP otherwise this will go in infinite loop */
                if (
                    checkedKeys.value.length !==
                    bulkStore.bulkSelectedAssets.length
                )
                    bulkStore.setBulkSelectedAssets(toRaw(checkedKeys.value))
            })
            watch(bulkStore, () => {
                /* NOTE: If condiion is IMP otherwise this will go in infinite loop */
                if (
                    checkedKeys.value.length !==
                    bulkStore.bulkSelectedAssets.length
                )
                    checkedKeys.value = [...bulkStore.bulkSelectedAssets]
            })
            watch(isVisible, () => {
                if (isVisible.value) {
                    checkedKeys.value = [...assets.value]
                    bulkStore.setBulkSelectedAssets([...assets.value])
                } else {
                    bulkStore.setBulkSelectedAssets([])
                }
            })

            watch(
                [connectionQfName, BIAssets],
                () => {
                    if (
                        BIAssets.value.includes(
                            getConnectorName(connectionQfName.value)
                        )
                    ) {
                        tabConfig.value = [{ key: 'custom', label: 'Custom' }]
                        tabConfig.value.unshift({
                            key: 'list',
                            label: 'Search',
                        })
                        activeTab.value = 'list'
                    } else {
                        tabConfig.value = [{ key: 'custom', label: 'Custom' }]
                        tabConfig.value.unshift({
                            key: 'list',
                            label: 'Search',
                        })
                        tabConfig.value.unshift({
                            key: 'tree',
                            label: 'Browse',
                        })
                        activeTab.value = 'tree'
                    }
                },
                { immediate: true }
            )

            return {
                assets,
                preference,
                closeDrawer,
                filterConfig,
                activeTab,
                tabConfig,
                isVisible,
                checkedKeys,
                regexKeys,
                saveAssets,
                selectedAssetCount,
            }
        },
    })
</script>

<style lang="less" module>
    .drawerStyle {
        :global(.ant-drawer-body) {
            overflow-y: hidden;
            height: 100%;
        }
    }
</style>
<style lang="less" scoped>
    .rear-z-index {
        z-index: 1001;
    }
    .front-z-index {
        z-index: 1002;
    }
    .drawer_height {
        height: calc(100vh - 14rem);
    }
</style>

<style lang="less">
    .assets-wrapper {
        .asset-card {
            padding-left: 0px !important;
            cursor: pointer !important;
        }
    }
    .tab-select-asset {
        .tab-btn {
            flex: 1 !important;
        }
    }
    .btn-asset {
        min-width: 80px;
    }
    .btn-add-assets {
        transform: rotate(180deg);
    }
</style>
