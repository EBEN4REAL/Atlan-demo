<template>
    <div class="px-5 pb-0 mt-1">
        <SearchAdvanced
            v-model:value="queryText"
            :placeholder="getPlaceholder"
            :autofocus="true"
        >
            <template #postFilter>
                <Preferences
                    v-model="preference.display"
                    v-model:process="preference.displayProcess"
                    @updateDisplay="handlePreferenceChange"
                />
            </template>
        </SearchAdvanced>
    </div>

    <AggregationTabs
        v-model="selectedType"
        class="px-5 mt-2 mb-1"
        :list="assetTypes"
    ></AggregationTabs>

    <AssetList
        ref="assetlistRef"
        class="overflow-y-auto"
        :list="filteredAssets"
    >
        <template #default="{ item, itemIndex }">
            <AssetItem
                :item="item"
                :item-index="itemIndex"
                :preference="preference"
                :enable-sidebar-drawer="true"
                class="px-2 hover:bg-primary-menu"
                isCompact
            ></AssetItem>
        </template>
    </AssetList>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import Preferences from '../preferences.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'

    // import AssetList from './assetList.vue'
    // import AssetItem from './assetItem.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'

    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetTypeList } from '~/constant/assetType'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        name: 'LineageList',
        components: {
            SearchAdvanced,
            Preferences,
            AggregationTabs,
            AssetList,
            AssetItem,
        },
        props: {
            assets: {
                type: Array as PropType<assetInterface[]>,
                default: () => [] as assetInterface[],
                required: true,
            },
        },

        setup(props, { emit }) {
            const { assets } = toRefs(props)
            const queryText = ref('')
            const selectedType = ref('__all')

            const preference = ref({ display: [] })

            const { title } = useAssetInfo()

            const discoveryStore = useAssetStore()

            if (discoveryStore.preferences) {
                preference.value = discoveryStore.preferences
            }

            const handlePreferenceChange = (id) => {
                discoveryStore.setPreferences(
                    JSON.parse(JSON.stringify(preference.value))
                )
            }

            const searchedAssets = computed(() => {
                if (queryText.value) {
                    return assets.value.filter((asset) =>
                        title(asset)
                            .toLowerCase()
                            .includes(queryText.value.toLowerCase())
                    )
                }
                return assets.value
            })

            const filteredAssets = computed(() => {
                if (selectedType.value !== '__all') {
                    return searchedAssets.value.filter(
                        (asset) => asset.typeName === selectedType.value
                    )
                }
                return searchedAssets.value
            })

            const assetMap = computed(() =>
                searchedAssets.value.reduce((agg, ast) => {
                    if (agg[ast.typeName]) {
                        agg[ast.typeName]++
                    } else agg[ast.typeName] = 1
                    return agg
                }, {})
            )

            const assetTypes = computed(() => {
                const aList = []
                assetTypeList.forEach((aType) => {
                    if (assetMap.value[aType.id]) {
                        aList.push({
                            count: assetMap.value[aType.id],
                            id: aType.id,
                            label: aType.label,
                        })
                    }
                })
                return aList
            })

            const getPlaceholder = computed(() => {
                if (selectedType.value !== '__all') {
                    const sType = assetTypes.value.find(
                        (ast) => ast.id === selectedType.value
                    )

                    return sType?.count
                        ? `Search ${sType?.count} ${sType?.label}`
                        : 'No assets to search from'
                }
                return assets.value.length
                    ? `Search ${assets.value.length} assets`
                    : 'No assets to search from'
            })

            return {
                queryText,
                getPlaceholder,
                preference,
                filteredAssets,
                assetTypes,
                selectedType,
                handlePreferenceChange,
            }
        },
    })
</script>
