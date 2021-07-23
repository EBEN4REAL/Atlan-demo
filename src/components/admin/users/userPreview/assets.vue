<template>
    <div>
        <div class="mb-2 text-base font-bold text-gray-dark">Assets Owned</div>
        <div class="flex flex-col h-full border rounded-lg">
            <div class="border-b rounded-tl-lg rounded-tr-lg bg-gray-50">
                <ConnectorDropdown
                    :data="connectorsPayload"
                    @change="handleChangeConnectors"
                ></ConnectorDropdown>
            </div>
            <div class="flex items-center mx-3 mt-3">
                <a-input
                    placeholder="Search"
                    :allowClear="true"
                    size="default"
                    class="rounded-full"
                    v-model:value="queryText"
                    @change="handleSearchChange"
                >
                    <template #prefix>
                        <div class="flex -space-x-2">
                            <template
                                v-for="item in filteredConnectorList"
                                :key="item.id"
                            >
                                <img
                                    :src="item.image"
                                    class="w-auto h-6 mr-1 bg-white rounded-full border-5"
                                />
                            </template>
                        </div>
                    </template>
                    <template #suffix>
                        <a-popover placement="bottomLeft">
                            <template #content>
                                <Preferences
                                    :defaultProjection="projection"
                                    @change="handleChangePreferences"
                                    @sort="handleChangeSort"
                                    @state="handleState"
                                ></Preferences>
                            </template>
                            <fa icon="fal cog"></fa>
                        </a-popover>
                    </template>
                </a-input>
            </div>
            <div class="flex w-full px-3 mt-3">
                <AssetTabs
                    v-model="assetType"
                    :assetTypeList="assetTypeList"
                    :assetTypeMap="assetTypeMap"
                    :total="totalSum"
                ></AssetTabs>
            </div>

            <div
                v-if="list && list.length <= 0 && !isLoading && !isValidating"
                class="flex-grow"
            >
                <EmptyView :showClearFiltersCTA="false"></EmptyView>
            </div>
            <AssetList
                class="asset-list-height"
                v-else
                :list="list"
                :score="searchScoreList"
                @preview="handlePreview"
                :isLoading="isLoading || isValidating"
                :projection="projection"
                ref="assetlist"
            ></AssetList>
            <div
                class="flex w-full px-3 py-1 border-t bg-gray-50 border-gray-50"
            >
                <div class="flex items-center justify-between w-full">
                    <div
                        class="flex items-center text-sm leading-none"
                        v-if="isLoading || isValidating"
                    >
                        <a-spin size="small" class="mr-2 leading-none"></a-spin
                        ><span>searching results</span>
                    </div>
                    <AssetPagination
                        v-else
                        :label="assetTypeLabel"
                        :listCount="list.length"
                        :totalCount="totalCount"
                    ></AssetPagination>

                    <div
                        class="text-sm cursor-pointer text-primary"
                        @click="loadMore"
                        v-if="isLoadMore && (!isLoading || !isValidating)"
                    >
                        load more...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, reactive, ref, watch } from 'vue';

    import { AssetTypeList } from '~/constant/assetType';
    import EmptyView from '@common/empty/discover.vue';
    import useAssetList from '~/composables/bots/useAssetList';
    import { useDebounceFn } from '@vueuse/core';
    import { SearchParameters } from '~/types/atlas/attributes';
    import { Components } from '~/api/atlas/client';
    import AssetList from '@/discovery/asset/list/index.vue';
    import AssetTabs from '@/discovery/asset/tabs/index.vue';
    import AssetPagination from '@common/pagination/index.vue';
    import ConnectorDropdown from '@common/dropdown/connector/index.vue';
    import { useConnectionsStore } from '~/store/connections';
    import {
        BaseAttributes,
        BasicSearchAttributes,
    } from '~/constant/projection';
    import Preferences from '@/discovery/asset/preference/index.vue';
    import useDiscoveryPreferences from '~/composables/preference/useDiscoveryPreference';

    export default {
        name: 'Assets',
        props: {
            selectedUser: {
                type: Object,
                default: {},
            },
            selectedGroup: {
                type: Object,
                default: {},
            },
        },
        components: {
            AssetList,
            ConnectorDropdown,
            AssetTabs,
            AssetPagination,
            EmptyView,
            Preferences,
        },
        setup(props) {
            const now = ref(false);
            const connectorsPayload = ref({});
            const assetType = ref('Catalog');
            const activeTab = computed(() => {
                if (Object.keys(props.selectedUser).length) return 'user';
                else if (Object.keys(props.selectedGroup).length)
                    return 'group';
                return '';
            });
            let criterion: Components.Schemas.FilterCriteria[] = [];

            if (activeTab.value === 'user') {
                criterion.push({
                    attributeName: 'ownerUsers',
                    attributeValue: props.selectedUser.username,
                    operator: 'contains',
                });
            } else if (activeTab.value === 'group') {
                criterion.push({
                    attributeName: 'ownerGroups',
                    attributeValue: props.selectedGroup.alias,
                    operator: 'contains',
                });
            }
            const entityFilterPayload = [
                {
                    condition: 'OR',
                    criterion: criterion,
                } as Components.Schemas.FilterCriteria,
            ];
            const state = ref('active');
            const sortOrder = ref('default');
            const limit = ref(20);
            const offset = ref(0);
            let assetTypeList = ref([]);
            assetTypeList.value = AssetTypeList.filter((item) => {
                return item.isDiscoverable == true;
            });
            const assetTypeListString = assetTypeList.value
                .map((item) => item.id)
                .join(',');
            let initialBody: SearchParameters = reactive({});

            assetTypeList.value.push({
                id: 'Catalog',
                label: 'All',
            });
            const queryText = ref('');
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
            );
            const updateBody = () => {
                initialBody = {
                    typeName: assetTypeListString,
                    limit: limit.value,
                    offset: offset.value,
                    entityFilters: {},
                    attributes: [...BaseAttributes, ...BasicSearchAttributes],
                    aggregationAttributes: [],
                };
                initialBody.entityFilters = {
                    condition: 'AND',
                    criterion: [...entityFilterPayload],
                };

                if (assetType.value !== 'Catalog') {
                    initialBody.entityFilters.criterion.push({
                        attributeName: '__typeName',
                        attributeValue: assetType.value,
                        operator: 'eq',
                    });
                }

                if (state.value) {
                    if (state.value === 'all') {
                        initialBody.excludeDeletedEntities = false;
                    } else if (state.value === 'deleted') {
                        initialBody.excludeDeletedEntities = false;
                        initialBody.entityFilters.criterion.push({
                            attributeName: '__state',
                            attributeValue: 'DELETED',
                            operator: 'eq',
                        });
                    } else {
                        initialBody.excludeDeletedEntities = true;
                    }
                }
                let connectorCritera = {
                    condition: 'OR',
                    criterion: [],
                };
                let connectionCriteria = {
                    condition: 'OR',
                    criterion: [],
                };

                if (connectorsPayload.value?.connector) {
                    connectorCritera.criterion?.push({
                        attributeName: 'integrationName',
                        attributeValue: connectorsPayload.value?.connector,
                        operator: 'eq',
                    });
                }
                if (connectorsPayload.value?.connection) {
                    connectorCritera.criterion?.push({
                        attributeName: 'connectionQualifiedName',
                        attributeValue: connectorsPayload.value?.connection,
                        operator: 'eq',
                    });
                }
                initialBody.entityFilters.criterion.push(connectorCritera);
                initialBody.entityFilters.criterion.push(connectionCriteria);
                if (sortOrder.value !== 'default') {
                    const split = sortOrder.value.split('|');
                    if (split.length > 1) {
                        initialBody.sortBy = split[0];
                        initialBody.sortOrder = split[1].toUpperCase();
                    }
                } else {
                    delete initialBody.sortBy;
                    delete initialBody.sortOrder;
                }
                if (queryText.value) {
                    initialBody.query = queryText.value;
                }
                replaceBody(initialBody);
            };
            const { projection } = useDiscoveryPreferences();
            const handleSearchChange = useDebounceFn((val) => {
                offset.value = 0;
                updateBody();
            }, 100);
            // const handleClearFilters = () => {
            //   offset.value = 0;
            //   queryText.value = "";
            //   connectorsPayload.value = {};
            //   updateBody();
            // };
            const totalCount = computed(() => {
                if (assetType.value === 'Catalog') {
                    return totalSum.value;
                }
                return assetTypeMap.value[assetType.value];
            });
            const isLoadMore = computed(() => {
                return totalCount.value > list.value.length;
            });
            const loadMore = () => {
                if (list.value.length + limit.value < totalCount.value) {
                    offset.value = list.value.length + limit.value;
                }
                isAggregate.value = false;
                updateBody();
            };
            const totalSum = computed(() => {
                let sum = 0;
                assetTypeList.value.forEach((element) => {
                    if (assetTypeMap.value[element.id]) {
                        sum = sum + assetTypeMap.value[element.id];
                    }
                });
                return sum;
            });
            const assetTypeLabel = computed(() => {
                const found = AssetTypeList.find((item) => {
                    return item.id == assetType.value;
                });
                return found?.label;
            });
            const connectorStore = useConnectionsStore();
            const filteredConnectorList = computed(() => {
                return connectorStore.getSourceList?.filter((item) => {
                    return connectorsPayload.value?.connector == item.id;
                });
            });
            const handleChangePreferences = (payload: any) => {
                projection.value = payload;
            };

            const handleChangeSort = (payload: any) => {
                sortOrder.value = payload;
                isAggregate.value = false;
                updateBody();
            };

            const handleState = (payload: any) => {
                state.value = payload;
                isAggregate.value = true;
                updateBody();
            };
            const handleChangeConnectors = (payload: any) => {
                connectorsPayload.value = payload;
                isAggregate.value = true;
                offset.value = 0;
                updateBody();
            };
            watch(
                assetType,
                () => {
                    isAggregate.value = false;
                    offset.value = 0;
                    updateBody();
                    if (!now.value) {
                        isAggregate.value = true;
                        now.value = true;
                    }
                },
                {
                    immediate: true,
                }
            );
            return {
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
            };
        },
    };
</script>

<style lang="less" scoped>
    .asset-list-height {
        max-height: calc(100vh - 23.5rem);
    }
</style>
