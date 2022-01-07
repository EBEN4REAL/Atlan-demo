<template>
    <div class="p-6">
        <div class="p-4 bg-white rounded">
            <div class="flex items-center justify-between w-full mb-8">
                <!-- View Selector-->

                <RaisedTab
                    v-model:active="activePreviewTabKey"
                    :data="tabConfig"
                    class="flex-none flex-grow-0"
                />
                <div class="w-1/2">
                    <SearchAndFilter v-model:value="queryText" />
                </div>
            </div>
            <div>
                <KeepAlive>
                    <!--  <AssetTypeList
                        v-if="activePreviewTabKey === 'card'"
                        :preference="checkedList"
                        asset-type="queries"
                        :asset-id="selectedAsset.guid"
                    />
                    <AssetTypeList
                        v-else-if="activePreviewTabKey === 'compact'"
                        :preference="[]"
                        asset-type="queries"
                        :asset-id="selectedAsset.guid"
                    /> -->
                </KeepAlive>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        ref,
        Ref,
        defineAsyncComponent,
        PropType,
    } from 'vue'

    // Components
    import RaisedTab from '@/UI/raisedTab.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            RaisedTab,
            SearchAndFilter,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
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

            return {
                activePreviewTabKey,
                tabConfig,
                queryText,
                checkedList,
            }
        },
    })
</script>
