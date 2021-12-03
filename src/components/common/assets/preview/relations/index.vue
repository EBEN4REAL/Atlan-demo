<template>
    <div
        v-if="loading"
        class="flex items-center justify-center flex-grow h-5/6"
    >
        <AtlanIcon icon="Loader" class="w-auto h-10 animate-spin" />
    </div>
    <div v-else-if="filteredRelationshipAssets.length === 0" class="h-5/6">
        <EmptyScreen emptyScreen="EmptyDiscover" desc="No relations found" />
    </div>

    <div v-else class="px-0 pt-4">
        <div class="px-3 mb-1">
            <!-- searchbar -->
            <SearchAndFilter v-model:value="queryText" size="minimal">
                <!-- filters -->
                <template #filter>
                    <a-checkbox-group
                        v-model:value="checkedList"
                        class="flex flex-col"
                    >
                        <div v-for="item in plainOptions" :key="item.id">
                            <a-checkbox :value="item.id"
                                ><span class="text-gray">
                                    {{ item.label }}
                                </span>
                            </a-checkbox>
                        </div>
                    </a-checkbox-group>
                </template>
            </SearchAndFilter>
        </div>
        <!-- accordions for different asset type -->
        <a-collapse
            :bordered="false"
            expand-icon-position="right"
            :accordion="true"
            class="m-0 bg-transparent"
            :class="$style.filter"
        >
            <template #expandIcon="{ isActive }">
                <div class="">
                    <AtlanIcon
                        icon="ChevronDown"
                        class="ml-1 text-gray-500 transition-transform duration-300 transform  hover:text-primary"
                        :class="isActive ? '-rotate-180' : 'rotate-0'"
                    />
                </div>
            </template>
            <!-- each panel is a asset type -->
            <a-collapse-panel
                v-for="(item, index) in filteredRelationshipAssets"
                :key="index"
                v-model:activeKey="activeKeys"
                class="bg-transparent"
            >
                <template #header>
                    <div class="flex items-center px-5 py-4">
                        <!-- first letter to be uppercase -->
                        <p class="my-0">
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
                <!-- accordion on expand  -->
                <AssetTypeList
                    :projections="checkedList"
                    :asset-type="item.displayText"
                    :asset-id="assetId"
                />
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        watch,
        ref,
        onMounted,
        computed,
        toRefs,
    } from 'vue'
    import EmptyScreen from '@/common/empty/index.vue'
    import emptyScreen from '~/assets/images/empty_search.png'

    import AssetTypeList from './assetTypeList.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useRelations } from '~/composables/discovery/useRelations'

    export default defineComponent({
        components: { AssetTypeList, SearchAndFilter, EmptyScreen },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const relationshipAssets = ref([])
            const loading = ref(false)
            const assetId = ref('')
            const queryText = ref('')
            const activeKeys = ref([])
            const checkedList = ref(['description'])
            const { selectedAsset } = toRefs(props)
            const plainOptions = [
                {
                    id: 'description',
                    label: 'Description',
                },
                {
                    id: 'classifications',
                    label: 'Classifications',
                },
                {
                    id: 'terms',
                    label: 'Business Terms',
                },
            ]

            const { useEntityRelationships } = useRelations
            const fetchData = () => {
                const { relationshipAssetTypes, isLoading } =
                    useEntityRelationships(selectedAsset.value?.guid)
                relationshipAssets.value = relationshipAssetTypes.value
                assetId.value = selectedAsset.value.guid
                loading.value = isLoading.value
                watch(isLoading, (newVal) => {
                    loading.value = newVal
                })
            }
            // filter required data
            const filteredRelationshipAssets = computed(() =>
                relationshipAssets.value.filter(
                    (el) =>
                        el.displayText
                            .toLowerCase()
                            .indexOf(queryText.value.toLowerCase()) !== -1
                )
            )
            watch(selectedAsset, fetchData, { immediate: true })
            onMounted(fetchData)
            return {
                relationshipAssets,
                loading,
                filteredRelationshipAssets,
                assetId,
                queryText,
                plainOptions,
                activeKeys,
                checkedList,
                emptyScreen,
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-content-box) {
            padding-right: 0px !important;
            padding-left: 0px !important;
            padding-top: 0px !important;
            padding-bottom: 0px !important;
        }
        :global(.ant-collapse-header) {
            padding-right: 0px !important;
            padding-left: 0px !important;
            padding-top: 0px !important;
            padding-bottom: 0px !important;
        }
    }
</style>
