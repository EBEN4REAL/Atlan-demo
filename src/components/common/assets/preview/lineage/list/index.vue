<template>
    <div class="mx-5 mt-3">
        <SearchAndFilter
            v-model:value="queryText"
            :placeholder="getPlaceholder"
            size="minimal"
        >
            <!-- <template #filter>
                <Preferences
                    assetType="Column"
                    v-model="preference"
                    @change="handleChangePreference"
                />
            </template> -->
        </SearchAndFilter>
    </div>

    <AggregationTabs
        v-model="selectedType"
        class="px-4 mb-1"
        :list="assetTypes"
    ></AggregationTabs>

    <AssetList
        ref="assetlistRef"
        class="overflow-y-auto"
        :list="filteredAssets"
    >
        <template v-slot:default="{ item }">
            <AssetItem
                :item="item"
                :preference="preference"
                class="mx-4"
            ></AssetItem>
        </template>
    </AssetList>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import Preferences from '@/assets/preference/index.vue'

    import AssetList from './assetList.vue'
    import AssetItem from './assetItem.vue'

    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetTypeList } from '~/constant/assetType'

    export default defineComponent({
        name: 'LineageList',
        components: {
            SearchAndFilter,
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

            const preference = ref({
                display: [],
            })

            const { title } = useAssetInfo()

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
            }
        },
    })
</script>
