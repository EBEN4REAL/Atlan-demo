<template>
    <div class="flex flex-col h-full rounded-lg" :class="props.className">
        <Header
            :connectorsPayload="connectorsPayload"
            :filteredConnectorList="filteredConnectorList"
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
        <!--Body end-->

        <Footer
            :isLoading="isLoading"
            :isValidating="isValidating"
            :isLoadMore="isLoadMore"
            :listCount="list.length"
            :totalCount="totalCount"
            :assetTypeLabel="assetTypeLabel"
            @loadMore="loadMore"
        />
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
    import ConnectorDropdown from '@common/dropdown/connector/index.vue';
    import { useConnectionsStore } from '~/store/connections';
    import {
        BaseAttributes,
        BasicSearchAttributes,
    } from '~/constant/projection';
    import Preferences from '@/discovery/asset/preference/index.vue';
    import useDiscoveryPreferences from '~/composables/preference/useDiscoveryPreference';
    import Footer from './footer/index.vue';
    import Header from './header/index.vue';

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
            className: {
                type: String,
                default: '',
            },
        },
        components: {
            AssetList,
            ConnectorDropdown,
            AssetTabs,
            Footer,
            EmptyView,
            Preferences,
            Header,
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
            const handleSearchChange = useDebounceFn((e) => {
                queryText.value = e.target.value;
                console.log(queryText.value, 'vaklue');

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
                console.log('called');
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
            const handlePreview = (e) => {
                console.log(e);
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
            };
        },
    };
</script>

<style lang="less" scoped>
    .asset-list-height {
        max-height: calc(100vh - 23.5rem);
    }
</style>
