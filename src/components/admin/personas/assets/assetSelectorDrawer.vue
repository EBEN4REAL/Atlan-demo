<template>
    <a-drawer
        placement="right"
        :destroyOnClose="true"
        :visible="isVisible"
        :get-container="false"
        :closable="false"
        :mask="false"
        :class="$style.drawerStyle"
        :width="420"
    >
        <div class="flex flex-col h-full">
            <div class="flex items-center justify-between">
                <span class="px-4 pt-4 text-lg font-bold text-gray-700"
                    >Select Assets</span
                >
                <AtlanBtn
                    class="ml-auto mr-2"
                    size="sm"
                    padding="compact"
                    color="secondary"
                    @click="() => (isVisible = false)"
                >
                    <AtlanIcon icon="Cross" class="-mx-1" />
                </AtlanBtn>
            </div>
            <MinimalTab v-model:active="activeTab" :data="tabConfig" />

            <template v-if="activeTab === 'tree'">
                <span class="mx-4 mt-4 text-base font-bold text-gray-500"
                    >Browse from your assets</span
                >
                <div class="h-full p-4 overflow-y-auto">
                    <AssetBrowserTree
                        v-model:assets="checkedKeys"
                        :connectionQfName="connectionQfName"
                    />
                </div>
            </template>
            <template v-else-if="activeTab === 'list'">
                <span class="mx-4 mt-4 text-base font-bold text-gray-500"
                    >Search from your assets</span
                >
                <AssetsWrapper :dataMap="filterConfig" />
            </template>
            <div class="flex items-center justify-end m-2 gap-x-2">
                <AtlanBtn
                    size="sm"
                    padding="compact"
                    color="secondary"
                    @click="() => (isVisible = false)"
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
    import AtlanBtn from '@/UI/button.vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import AssetBrowserTree from './assetBrowserTree.vue'
    import AssetsWrapper from '@common/assets/index.vue'

    export default defineComponent({
        name: 'AssetSelector',
        components: { AtlanBtn, AssetBrowserTree, MinimalTab, AssetsWrapper },
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
            watch(assets, () => (checkedKeys.value = [...assets.value]), {
                immediate: true,
            })
            function saveAssets() {
                // TODO: Change this implementation
                // Use a WritableComputedRef and the @check event
                // to see which node got selected or unselected and
                // use a set to maintain the state
                const assetSet = new Set([
                    ...checkedKeys.value,
                    ...assets.value,
                ])
                emit('update:assets', [...assetSet])
                isVisible.value = false
            }
            function discardAssets() {
                checkedKeys.value = [...assets.value]
                isVisible.value = false
            }

            const filterConfig = computed(() => ({
                connector: {
                    attributeName: 'connectionQualifiedName',
                    attributeValue: connectionQfName.value,
                },
            }))

            // Tab related data
            const activeTab = ref('tree')
            const tabConfig = [
                { key: 'tree', label: 'Browse' },
                { key: 'list', label: 'Search' },
            ]

            return {
                activeTab,
                tabConfig,
                isVisible,
                checkedKeys,
                saveAssets,
                discardAssets,
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
