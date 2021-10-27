<template>
    <div style="padding: 2rem 0">
        <div class="flex items-center justify-between w-full pr-5 mb-8 pl-14">
            <!-- View Selector-->

            <RaisedTab
                v-model:active="activePreviewTabKey"
                :data="tabConfig"
                class="flex-none flex-grow-0"
            />

            <SearchAndFilter v-model:value="queryText" class="w-1/2">
            </SearchAndFilter>
        </div>
        <div class="pl-12 pr-2">
            <KeepAlive>
                <AssetTypeItems
                    v-if="activePreviewTabKey === 'card'"
                    :projections="checkedList"
                    page="discovery"
                    asset-type="queries"
                    :asset-id="selectedAsset.guid"
                    :css-classes="cssClasses"
                />
                <AssetTypeItems
                    v-else-if="activePreviewTabKey === 'compact'"
                    :projections="[]"
                    asset-type="queries"
                    :asset-id="selectedAsset.guid"
                    :css-classes="cssClasses"
                />
            </KeepAlive>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ref, Ref, defineAsyncComponent } from 'vue'
    import { storeToRefs } from 'pinia'

    // Components
    import RaisedTab from '@/UI/raisedTab.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    // store
    import useDiscoveryStore from '~/store/discovery'

    export default defineComponent({
        components: {
            RaisedTab,
            SearchAndFilter,
            AssetTypeItems: defineAsyncComponent(
                () =>
                    import(
                        '@/discovery/preview/tabs/relations/assetTypeItems.vue'
                    )
            ),
        },
        props: {
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup() {
            const activePreviewTabKey: Ref<'card' | 'compact'> = ref('card')

            const tabConfig = [
                { key: 'card', label: 'Card View' },
                { key: 'compact', label: 'Compact View' },
            ]

            const queryText = ref('')

            const checkedList = ref(['description', 'classifications', 'terms'])

            /** METHODS */
            // useAssetInfo
            const { assetType } = useAssetInfo()

            // store
            const storeDiscovery = useDiscoveryStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)

            return {
                assetType,
                activePreviewTabKey,
                selectedAsset,
                tabConfig,
                queryText,
                checkedList,
                cssClasses: {
                    textSize: 'text-sm',
                },
            }
        },
    })
</script>
