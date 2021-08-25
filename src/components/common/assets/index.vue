<template>
    <div class="flex flex-col h-full rounded-lg" :class="props.className">
        <Header
            :connectors-payload="connectorsPayload"
            :filtered-connector-list="filteredConnectorList"
            :projection="projection"
            @handleChangeConnectors="handleChangeConnectors"
            @handleSearchChange="handleSearchChange"
            @handleChangePreferences="handleChangePreferences"
            @handleChangeSort="handleChangeSort"
            @handleState="handleState"
        />
        <!--Body start-->
        <div class="flex w-full px-3 mt-3">
            <AssetTabs
                v-model="assetType"
                :asset-type-list="assetTypeList"
                :asset-type-map="assetTypeMap"
                :total="totalSum"
            ></AssetTabs>
        </div>

        <div
            v-if="list && list.length <= 0 && !isLoading && !isValidating"
            class="flex-grow"
        >
            <EmptyView :show-clear-filters-c-t-a="false"></EmptyView>
        </div>
        <AssetList
            v-else
            ref="assetlist"
            class="asset-list-height"
            :list="list"
            :score="searchScoreList"
            :is-loading="isLoading || isValidating"
            :projection="projection"
            @preview="handlePreview"
        ></AssetList>
        <!--Body end-->

        <Footer
            :is-loading="isLoading"
            :is-validating="isValidating"
            :is-load-more="isLoadMore"
            :list-count="list.length"
            :total-count="totalCount"
            :asset-type-label="assetTypeLabel"
            @loadMore="loadMore"
        />
    </div>
</template>

<script lang="ts">
    import { computed, reactive, ref, watch, ComputedRef } from 'vue'

    import EmptyView from '@common/empty/discover.vue'
    import { useDebounceFn } from '@vueuse/core'
    import AssetList from '~/components/discovery/list/assetList.vue'
    import AssetTabs from '~/components/discovery/list/assetTypeTabs.vue'
    import ConnectorDropdown from '~/components/common/dropdown/connectorDropdown.vue'
    import Preferences from '~/components/discovery/list/preference.vue'
    import { AssetTypeList } from '~/constant/assetType'
    import useAssetList from '~/composables/bots/useAssetList'
    import { SearchParameters } from '~/types/atlas/attributes'
    import { Components } from '~/api/atlas/client'
    import { useConnectionsStore } from '~/store/connections'
    import {
        BaseAttributes,
        BasicSearchAttributes,
    } from '~/constant/projection'
    import useDiscoveryPreferences from '~/composables/preference/useDiscoveryPreference'
    import Footer from './footer/index.vue'
    import Header from './header/index.vue'

    export default {
        name: 'Assets',
        components: {
            AssetList,
            ConnectorDropdown,
            AssetTabs,
            Footer,
            EmptyView,
            Preferences,
            Header,
        },
        props: {
            selectedUser: {
                type: Object,
                default: {},
            },
            selectedGroup: {
                type: Object,
                default: {},
            },
            selectedClassification: {
                type: String,
            },
            className: {
                type: String,
                default: '',
            },
        },
        setup(props) {
            const now = ref(false)
            const connectorsPayload = ref({})
            const selectedClassification: ComputedRef<string> = computed(() => {
                console.log('inside Props')
                return props.selectedClassification
            })
            const assetType = ref('Catalog')
            const activeTab = computed(() => {
                if (Object.keys(props.selectedUser).length) return 'user'
                if (Object.keys(props.selectedGroup).length) return 'group'
                return ''
            })
            const criterion: Components.Schemas.FilterCriteria[] = []
            if (selectedClassification.value) {
                criterion.push({
                    attributeName: '__classificationNames',
                    attributeValue: selectedClassification.value,
                    operator: 'eq',
                })
                criterion.push({
                    attributeName: '__propagatedClassificationNames',
                    attributeValue: selectedClassification.value,
                    operator: 'eq',
                })
                console.log(criterion, 'classifications')
            }

            if (activeTab.value === 'user') {
                criterion.push({
                    attributeName: 'ownerUsers',
                    attributeValue: props.selectedUser.username,
                    operator: 'contains',
                })
            } else if (activeTab.value === 'group') {
                criterion.push({
                    attributeName: 'ownerGroups',
                    attributeValue: props.selectedGroup.alias,
                    operator: 'contains',
                })
            }
            const entityFilterPayload = [
                {
                    condition: 'OR',
                    criterion,
                } as Components.Schemas.FilterCriteria,
            ]
            const state = ref('active')
            const sortOrder = ref('default')
            const limit = ref(20)
            const offset = ref(0)
            const assetTypeList = ref([])
            assetTypeList.value = AssetTypeList.filter(
                (item) => item.isDiscoverable == true
            )
            const assetTypeListString = assetTypeList.value
                .map((item) => item.id)
                .join(',')
            let initialBody: SearchParameters = reactive({})

            assetTypeList.value.push({
                id: 'Catalog',
                label: 'All',
            })
            const queryText = ref('')
            const {
                list,
                replaceBody,
                isLoading,
                isValidating,
                searchScoreList,
                isAggregate,
                assetTypeMap,
            } = useAssetList(
                now,
                assetTypeListString,
                initialBody,
                assetType.value
            )
            const updateBody = (entityFilterData?: any) => {
                initialBody = {
                    typeName: assetTypeListString,
                    limit: limit.value,
                    offset: offset.value,
                    entityFilters: {},
                    attributes: [...BaseAttributes, ...BasicSearchAttributes],
                    aggregationAttributes: [],
                }
                if (entityFilterData?.length > 0) {
                    initialBody.entityFilters = {
                        condition: 'AND',
                        criterion: [...entityFilterData],
                    }
                } else {
                    initialBody.entityFilters = {
                        condition: 'AND',
                        criterion: [...entityFilterPayload],
                    }
                }

                if (assetType.value !== 'Catalog') {
                    initialBody.entityFilters.criterion.push({
                        attributeName: '__typeName',
                        attributeValue: assetType.value,
                        operator: 'eq',
                    })
                }

                if (state.value) {
                    if (state.value === 'all') {
                        initialBody.excludeDeletedEntities = false
                    } else if (state.value === 'deleted') {
                        initialBody.excludeDeletedEntities = false
                        initialBody.entityFilters.criterion.push({
                            attributeName: '__state',
                            attributeValue: 'DELETED',
                            operator: 'eq',
                        })
                    } else {
                        initialBody.excludeDeletedEntities = true
                    }
                }
                const connectorCritera = {
                    condition: 'OR',
                    criterion: [],
                }
                const connectionCriteria = {
                    condition: 'OR',
                    criterion: [],
                }

                if (connectorsPayload.value?.connector) {
                    connectorCritera.criterion?.push({
                        attributeName: 'integrationName',
                        attributeValue: connectorsPayload.value?.connector,
                        operator: 'eq',
                    })
                }
                if (connectorsPayload.value?.connection) {
                    connectorCritera.criterion?.push({
                        attributeName: 'connectionQualifiedName',
                        attributeValue: connectorsPayload.value?.connection,
                        operator: 'eq',
                    })
                }
                initialBody.entityFilters.criterion.push(connectorCritera)
                initialBody.entityFilters.criterion.push(connectionCriteria)
                if (sortOrder.value !== 'default') {
                    const split = sortOrder.value.split('|')
                    if (split.length > 1) {
                        initialBody.sortBy = split[0]
                        initialBody.sortOrder = split[1].toUpperCase()
                    }
                } else {
                    delete initialBody.sortBy
                    delete initialBody.sortOrder
                }
                if (queryText.value) {
                    initialBody.query = queryText.value
                }
                replaceBody(initialBody)
            }
            const { projection } = useDiscoveryPreferences()
            const handleSearchChange = useDebounceFn((e) => {
                queryText.value = e.target.value
                console.log(queryText.value, 'vaklue')

                offset.value = 0
                updateBody()
            }, 100)
            // const handleClearFilters = () => {
            //   offset.value = 0;
            //   queryText.value = "";
            //   connectorsPayload.value = {};
            //   updateBody();
            // };
            const totalCount = computed(() => {
                if (assetType.value === 'Catalog') {
                    return totalSum.value
                }
                return assetTypeMap.value[assetType.value]
            })
            const isLoadMore = computed(
                () => totalCount.value > list.value.length
            )
            const loadMore = () => {
                console.log('called')
                if (list.value.length + limit.value < totalCount.value) {
                    offset.value = list.value.length + limit.value
                }
                isAggregate.value = false
                updateBody()
            }
            const totalSum = computed(() => {
                let sum = 0
                assetTypeList.value.forEach((element) => {
                    if (assetTypeMap.value[element.id]) {
                        sum += assetTypeMap.value[element.id]
                    }
                })
                return sum
            })
            const assetTypeLabel = computed(() => {
                const found = AssetTypeList.find(
                    (item) => item.id == assetType.value
                )
                return found?.label
            })
            const connectorStore = useConnectionsStore()
            const filteredConnectorList = computed(() =>
                connectorStore.getSourceList?.filter(
                    (item) => connectorsPayload.value?.connector == item.id
                )
            )
            const handleChangePreferences = (payload: any) => {
                projection.value = payload
            }

            const handleChangeSort = (payload: any) => {
                sortOrder.value = payload
                isAggregate.value = false
                updateBody()
            }

            const handleState = (payload: any) => {
                state.value = payload
                isAggregate.value = true
                updateBody()
            }
            const handleChangeConnectors = (payload: any) => {
                connectorsPayload.value = payload
                isAggregate.value = true
                offset.value = 0
                updateBody()
            }
            const handlePreview = (e) => {
                console.log(e)
            }
            watch(
                assetType,
                () => {
                    isAggregate.value = false
                    offset.value = 0
                    updateBody()
                    if (!now.value) {
                        isAggregate.value = true
                        now.value = true
                    }
                },
                {
                    immediate: true,
                }
            )

            return {
                handlePreview,
                connectorsPayload,
                props,
                assetType,
                handleSearchChange,
                isLoading,
                isValidating,
                searchScoreList,
                list,
                queryText,
                totalCount,
                isLoadMore,
                loadMore,
                totalSum,
                assetTypeLabel,
                handleChangeConnectors,
                filteredConnectorList,
                assetTypeList,
                assetTypeMap,
                handleChangePreferences,
                handleChangeSort,
                handleState,
                projection,
                updateBody,
            }
        },
    }
</script>

<style lang="less" scoped>
    .asset-list-height {
        max-height: calc(100vh - 23.5rem);
    }
</style>
