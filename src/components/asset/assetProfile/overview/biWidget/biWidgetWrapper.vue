<template>
    <div class="px-5 pt-6 pb-2">
        <Readme
            class="w-full border-0"
            :showBorders="false"
            :showPaddingX="false"
        />
    </div>
    <p class="px-5 m-0 font-bold">Relations</p>
    <div class="flex items-center justify-between px-5 mt-3 mb-5 text-base">
        <!-- searchbar -->
        <a-input-search placeholder="Search" size="default">
        </a-input-search>
        <!-- filters -->
        <a-popover title="Show/hide" trigger="click" placement="bottomRight">
            <template #content>
                <a-checkbox-group
                    v-model:value="checkedList"
                    :options="plainOptions"
                    class="flex flex-col"
                />
            </template>
            <a-badge :dot="checkedList?.length" :class="$style.badge">
                <a-button class="px-2 py-1 ml-2 rounded">
                    <span class="flex items-center justify-center">
                        <fa
                            icon="fas sort-amount-up"
                            class="hover:text-primary-500"
                        />
                    </span>
                </a-button>
            </a-badge>
        </a-popover>
    </div>

    <a-tabs v-model:activeKey="activeKey" :class="$style.tabClasses">
        <a-tab-pane v-for="(item, index) in relationshipAssets" :key="index">
            <template #tab>
                <!-- <div>{{ item.displayText }}</div> -->
                <div class="flex items-center">
                    <!-- first letter to be uppercase -->
                    <p class="my-0 gray-500">
                        {{ item.displayText.charAt(0).toUpperCase()
                        }}{{ item.displayText.slice(1) }}
                    </p>
                    <div
                        v-if="item.length"
                        class="px-2 mx-2 bg-primary-light text-primary"
                    >
                        {{ item.length }}
                    </div>
                </div>
            </template>

            <!-- <BiWidgetTabPanel
                :projections="checkedList"
                :assetType="item.displayText"
                :assetId="assetId"
            /> -->
            <AssetTypeItems
                :projections="checkedList"
                :assetType="item.displayText"
                :assetId="asset.guid"
                :cssClasses="cssClasses"
                @preview="handlePreview"
            />
        </a-tab-pane>
    </a-tabs>
</template>
<script lang="ts">
    import { defineComponent, watch, onMounted, ref, toRefs } from 'vue'
    import AssetTypeItems from '@/preview/asset/v2/tabs/relations/assetTypeItems.vue'
    import BiWidgetTabPanel from '@/asset/assetProfile/overview/biWidget/biWidgetTabPanel.vue'
    import DescriptionWidget from '@/asset/assetProfile/overview/descriptionWidget.vue'
    import Readme from '@/common/readme/index.vue'
    import useEntityRelationships from '~/composables/asset/useEntityRelationships'

    export default defineComponent({
        components: {
            BiWidgetTabPanel,
            DescriptionWidget,
            Readme,
            AssetTypeItems,
        },
        props: ['asset'],
        emits: ['preview'],
        setup(props, context) {
            const relationshipAssets = ref([])
            const plainOptions = ['description', 'owners', 'business terms']
            const checkedList = ref(['description'])
            const { asset }: ToRefs = toRefs(props)
            const fetchData = () => {
                const { relationshipAssetTypes, isLoading } =
                    useEntityRelationships(props.asset.guid)

                relationshipAssets.value = relationshipAssetTypes.value
            }

            // filter required data

            onMounted(fetchData)
            watch(asset, fetchData)
            const handlePreview = (item) => {
                context.emit('preview', item)
            }
            return {
                relationshipAssets,
                plainOptions,
                checkedList,
                handlePreview,
                cssClasses: {
                    paddingY: 'py-6',
                },
            }
        },
    })
</script>

<style lang="less" module>
    .tabClasses {
        :global(.ant-tabs-tab) {
            margin: 0px 20px 0px 0px !important;
            padding: 0px 0px 20px 0px !important;
        }
        :global(.ant-tabs-nav) {
            margin: 0px !important;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray-700 font-bold !important;
        }
        :global(.ant-tabs-bar) {
            @apply px-5 !important;
        }
    }
    .badge {
        :global(.ant-badge-dot) {
            @apply bg-primary !important;
        }
        :global(.ant-badge-count) {
            @apply top-3 right-2 !important;
        }
    }
</style>
