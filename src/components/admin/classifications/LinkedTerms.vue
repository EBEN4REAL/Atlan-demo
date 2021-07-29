<template>
    <div class="flex flex-col h-full rounded-lg">
        <div class="flex items-center mx-3 mb-1">
            <a-input
                :placeholder="
                    `Search ${
                        queryText == '' ? list.length : filteredList.length
                    } linked glossary`
                "
                :allowClear="true"
                size="default"
                class="rounded-full"
                v-model:value="queryText"
                @change="handleSearchChange"
            >
                <template #suffix>
                    <a-popover placement="bottomLeft">
                        <template #content>
                            <div class="flex">
                                <div
                                    class="px-3 border-r border-gray-200 border-dashed"
                                >
                                    <p class="mb-1 text-gray-500">Show/Hide</p>
                                    <a-checkbox-group
                                        v-model:value="preferenceCheckbox"
                                        @change="handlePreferenceCheckboxChange"
                                    >
                                        <div class="flex">
                                            <div
                                                class="flex flex-col space-y-1"
                                            >
                                                <a-checkbox value="description"
                                                    >Description</a-checkbox
                                                >
                                            </div>
                                        </div>
                                    </a-checkbox-group>
                                </div>
                                <div class="pl-3">
                                    <p class="mb-1 text-gray-500">Order</p>
                                    <a-radio-group
                                        @change="handeChangeFilterSorting"
                                        v-model:value="sorting"
                                    >
                                        <div class="flex flex-col space-y-1">
                                            <a-radio value="ascending"
                                                >Name (A-Z)</a-radio
                                            >
                                            <a-radio value="descending"
                                                >Name (Z-A)</a-radio
                                            >
                                        </div>
                                    </a-radio-group>
                                </div>
                            </div>
                        </template>
                        <fa icon="fal cog"></fa>
                    </a-popover>
                </template>
            </a-input>
        </div>
        <!--Body start-->
        <div
            v-if="
                (list && list.length <= 0 && !isLoading && !isValidating) ||
                    (queryText !== '' && filteredList.length <= 0)
            "
            class="flex-grow"
        >
            <EmptyView :showClearFiltersCTA="false" type="Terms"></EmptyView>
        </div>
        <LinkedTermList
            class=" asset-list-height"
            v-else
            :list="queryText == '' ? list : filteredList"
            :score="searchScoreList"
            @preview="handlePreview"
            :isLoading="isLoading || isValidating"
            :projection="projection"
            ref="assetlist"
        ></LinkedTermList>
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
    import {
        defineComponent,
        computed,
        ref,
        ComputedRef,
        toRaw,
        watch,
        Ref,
    } from 'vue';
    import Preferences from '@/discovery/asset/preference/index.vue';
    import LinkedTermList from '@/common/list/linkedTerms/index.vue';
    import AssetTabs from '@/discovery/asset/tabs/index.vue';
    import EmptyView from '@common/empty/discover.vue';
    import { Components } from '~/api/atlas/client';
    import useAssetList from '~/composables/bots/useAssetList';
    import Footer from '@common/assets/footer/index.vue';

    export default defineComponent({
        name: 'LinkedTerms',
        components: {
            Preferences,
            LinkedTermList,
            EmptyView,
            AssetTabs,
            Footer,
        },
        props: {
            selectedClassification: {
                type: String,
            },
        },
        setup(props, { emit }) {
            const queryText = ref('');
            const activeKey = ref('Catalog');
            const assetType = ref('AtlasGlossaryTerm');
            const assetTypeListString = 'AtlasGlossaryTerm';
            const filteredList = ref([]);
            const assetTypeList = ref([]);
            const totalCount = ref(0);
            const assetTypeLabel = ref('terms');
            const selectedClassification = computed(
                () => props.selectedClassification
            );
            assetTypeList.value.push({
                id: 'Catalog',
                label: 'Terms',
            });
            const sorting = ref('ascending');

            const handleChangePreferences = (e: {
                [index: string]: string;
            }) => {
                console.log('handleChangePreferences', e);
                emit('handleChangePreferences', e);
            };
            const handleChangeSort = (e: string) => {
                emit('handleChangeSort', e);
            };
            const handleState = (e: string) => {
                emit('handleState', e);
            };
            let criterion: Components.Schemas.FilterCriteria[] = [];
            const entityFilterPayload = {
                condition: 'AND',
                criterion: [
                    {
                        condition: 'OR',
                        criterion,
                    },
                ],
            };
            criterion.push({
                attributeName: '__classificationNames',
                attributeValue: props.selectedClassification,
                operator: 'eq',
            });
            criterion.push({
                attributeName: '__propagatedClassificationNames',
                attributeValue: props.selectedClassification,
                operator: 'eq',
            });
            const initialBody = {
                attributes: ['anchor', 'shortDescription'],
                entityFilters: entityFilterPayload,
                excludeDeletedEntities: true,
                includeClassificationAttributes: true,
                includeSubClassifications: true,
                includeSubTypes: true,
                limit: 10,
                minScore: 100,
                termName: null,
                offset: 0,
                typeName: assetType.value,
            };

            const {
                list,
                data,
                replaceBody,
                isLoading,
                isValidating,
                searchScoreList,
                isAggregate,
                assetTypeMap,
            } = useAssetList(
                ref(true),
                assetTypeListString,
                initialBody,
                assetType.value
            );
            const filterListByQueryText = (query: string) => {
                filteredList.value = list.value.filter((item) =>
                    item?.attributes.name.includes(query)
                );
            };
            const handleSearchChange = (e: Event) => {
                console.log(e, 'handleSearch');
                queryText.value = e.target.value;
                filterListByQueryText(queryText.value);
            };

            const handlePreview = () => {};
            const projection = ref([]);
            console.log(assetTypeList.value);

            const sortClassificationsByOrder = (
                sortingOrder: string | null,
                data: any
            ) => {
                console.log(toRaw(data), 'hello');
                let list = [];
                switch (sortingOrder) {
                    case 'ascending': {
                        list = data.value.sort(function(listA, listB) {
                            let a = listA.attributes.name;
                            let b = listB.attributes.name;
                            if (a < b) {
                                return -1;
                            }
                            if (a > b) {
                                return 1;
                            }
                            return 0;
                        });
                        break;
                    }
                    case 'descending': {
                        list = data.value.sort(function(listA, listB) {
                            let a = listA.attributes.name;
                            let b = listB.attributes.name;
                            if (a < b) {
                                return 1;
                            }
                            if (a > b) {
                                return -1;
                            }
                            return 0;
                        });
                        break;
                    }
                    default: {
                        break;
                    }
                }
                console.log('classifications', list);
                return list;
            };

            watch([list], () => {
                totalCount.value = data.value.approximateCount;
                list.value = sortClassificationsByOrder(sorting.value, list);
                filteredList.value = list.value;
            });
            const isLoadMore = computed(() => {
                if (totalCount.value > list.value.length) return true;
                else false;
            });

            const loadMore = () => {
                const offset = ref(0);
                if (list.value.length + 10 < totalCount.value) {
                    offset.value = list.value.length + 10;
                }
                replaceBody({
                    attributes: ['anchor', 'shortDescription'],
                    entityFilters: entityFilterPayload,
                    excludeDeletedEntities: true,
                    includeClassificationAttributes: true,
                    includeSubClassifications: true,
                    includeSubTypes: true,
                    limit: 10,
                    minScore: 100,
                    termName: null,
                    offset: offset.value,
                    typeName: assetType.value,
                });
            };
            const updateBody = (
                entityFilterPayload: Components.Schemas.FilterCriteria
            ) => {
                replaceBody({
                    attributes: ['anchor', 'shortDescription'],
                    entityFilters: entityFilterPayload,
                    excludeDeletedEntities: true,
                    includeClassificationAttributes: true,
                    includeSubClassifications: true,
                    includeSubTypes: true,
                    limit: 10,
                    minScore: 100,
                    termName: null,
                    offset: 0,
                    typeName: assetType.value,
                });
            };
            watch(selectedClassification, () => {
                if (selectedClassification.value) {
                    let criterion: Components.Schemas.FilterCriteria[] = [];
                    const entityFilterPayload = {
                        condition: 'AND',
                        criterion: [
                            {
                                condition: 'OR',
                                criterion,
                            },
                        ],
                    };
                    criterion.push({
                        attributeName: '__classificationNames',
                        attributeValue: selectedClassification.value,
                        operator: 'eq',
                    });
                    criterion.push({
                        attributeName: '__propagatedClassificationNames',
                        attributeValue: selectedClassification.value,
                        operator: 'eq',
                    });

                    updateBody(entityFilterPayload);
                }
            });
            const handeChangeFilterSorting = () => {
                list.value = sortClassificationsByOrder(sorting.value, list);
            };
            const handlePreferenceCheckboxChange = () => {
                projection.value = preferenceCheckbox.value;
            };
            const preferenceCheckbox: Ref<any[]> = ref([]);

            return {
                sorting,
                preferenceCheckbox,
                handeChangeFilterSorting,
                loadMore,
                isLoadMore,
                assetTypeLabel,
                activeKey,
                list,
                assetTypeList,
                isLoading,
                isValidating,
                searchScoreList,
                isAggregate,
                assetTypeMap,
                props,
                assetType,
                projection,
                handleSearchChange,
                handlePreferenceCheckboxChange,
                handleChangePreferences,
                handleChangeSort,
                handleState,
                handlePreview,
                queryText,
                filteredList,
                totalCount,
            };
        },
    });
</script>
<style lang="less" scoped>
    .asset-list-height {
        // max-height: calc(100vh - 22rem);
    }
</style>
