<template>
    <a-drawer
        placement="right"
        :destroy-on-close="true"
        :visible="isVisible"
        :get-container="false"
        :closable="false"
        :mask="false"
        :class="$style.drawerStyle"
        :width="460"
    >
        <div class="flex flex-col h-full">
            <div class="flex items-center justify-between">
                <span class="px-4 pt-4 text-lg font-bold text-gray-700"
                    >Select Assets</span
                >
                <AtlanBtn
                    class="ml-auto mr-2 border-none"
                    size="sm"
                    padding="compact"
                    color="secondary"
                    @click="() => (isVisible = false)"
                >
                    <AtlanIcon icon="Cross" class="-mx-1" />
                </AtlanBtn>
            </div>

            <RaisedTab
                v-model:active="activeTab"
                class="mt-3 ml-4 mr-auto"
                :data="tabConfig"
            />
            <a-divider class="my-4" />

            <keep-alive>
                <template v-if="activeTab === 'tree'">
                    <span class="mx-4 mt-2 text-base font-bold text-gray-500"
                        >Browse from your assets</span
                    >
                    <div class="h-full p-4 overflow-y-auto">
                        <AssetBrowserTree
                            v-model:assets="checkedKeys"
                            :connection-qf-name="connectionQfName"
                        />
                    </div>
                </template>
                <template v-else-if="activeTab === 'list'">
                    <span class="mx-4 mt-2 text-base font-bold text-gray-500"
                        >Search from your assets</span
                    >
                    <!-- <AssetsWrapper class="h-full" :data-map="filterConfig" /> -->
                </template>
                <template v-else-if="activeTab === 'custom'">
                    <span class="mx-4 mt-2 text-base font-bold text-gray-500"
                        >Select assets matching
                    </span>
                    <CustomAssetSelector
                        v-model:assets="regexKeys"
                        class="h-full py-4"
                        :connection-qf-name="connectionQfName"
                    />
                </template>
            </keep-alive>

            <a-divider />
            <div class="flex items-center justify-end m-2 gap-x-2">
                <span class="text-base font-bold text-gray-500"
                    >{{ selectedAssetCount || 'No' }} items selected</span
                >
                <AtlanBtn
                    size="sm"
                    padding="compact"
                    color="secondary"
                    @click="resetAssetState"
                    >Cancel</AtlanBtn
                >
                <AtlanBtn size="sm" padding="compact" @click="saveAssets"
                    >Save</AtlanBtn
                >
            </div>
        </div>
    </a-drawer>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        toRefs,
        watch,
    } from 'vue'
    // import AssetsWrapper from '@common/assets/index.vue'
    import AtlanBtn from '@/UI/button.vue'
    import RaisedTab from '@/UI/raisedTab.vue'
    import AssetBrowserTree from './assetBrowserTree.vue'
    import CustomAssetSelector from './customAssetSelector.vue'

    export default defineComponent({
        name: 'AssetSelector',
        components: {
            AtlanBtn,
            AssetBrowserTree,
            RaisedTab,
            // AssetsWrapper,
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
        },
        emits: ['update:visible', 'update:assets'],
        setup(props, { emit }) {
            const { visible, assets, connectionQfName } = toRefs(props)

            // Drawer Visibility
            const isVisible = computed({
                get: () => visible.value,
                set: (val) => {
                    emit('update:visible', val)
                },
            })

            // Asset related stuff
            const checkedKeys = ref([] as string[])
            const regexKeys = ref([] as string[])

            function resetAssetState() {
                checkedKeys.value = []
                regexKeys.value = []
                isVisible.value = false
            }

            function saveAssets() {
                // TODO: Optional* Change this implementation
                // Use a WritableComputedRef and the @check event
                // to see which node got selected or unselected and
                // use a set to maintain the state
                const assetSet = new Set([
                    ...checkedKeys.value,
                    ...assets.value,
                    ...regexKeys.value,
                ])
                emit('update:assets', [...assetSet])
                resetAssetState()
            }

            const selectedAssetCount = computed(
                () => checkedKeys.value.length + assets.value.length
            )

            const filterConfig = computed(() => ({
                connector: {
                    attributeName: 'connectionQualifiedName',
                    attributeValue: connectionQfName.value,
                },
            }))

            // Tab related data
            const activeTab = ref('custom')
            const tabConfig = [
                { key: 'tree', label: 'Browse' },
                { key: 'list', label: 'Search' },
                { key: 'custom', label: 'Custom' },
            ]

            return {
                activeTab,
                tabConfig,
                isVisible,
                checkedKeys,
                regexKeys,
                saveAssets,
                resetAssetState,
                selectedAssetCount,
                filterConfig,
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