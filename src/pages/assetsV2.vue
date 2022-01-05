<template>
    <div class="flex">
        <div><AssetFilters /></div>
        <div class="flex flex-col">
            <div>
                <SearchAdvanced>
                    <template #postFilter>
                        <div style="max-width: 330px">
                            <PreferenceSelector
                                v-model="preference"
                                @change="handleChangePreference"
                                @display="handleDisplayChange"
                            />
                        </div> </template
                ></SearchAdvanced>
            </div>
            <div>
                <AggregationTabs />
            </div>
            <div>
                <AssetList :list="list">
                    <template #default="{ item }">
                        <AssetItem :item="item"></AssetItem>
                    </template>
                </AssetList>
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import ListNavigator from '@common/keyboardShortcuts/listNavigator.vue'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'

    export default defineComponent({
        name: 'AssetsV2',
        components: {
            AssetFilters,
            SearchAdvanced,
            PreferenceSelector,
            AssetList,
            AssetItem,
        },
    })
</script>

<style></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
