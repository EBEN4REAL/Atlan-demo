
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';
import fetchSearchList from '../utils/search';

import { AssetTypeList } from "~/constant/assetType";
import { Search } from '~/api/atlas/search';
import { SearchBasic } from '~/api/atlas/searchbasic';
// import axios, { CancelTokenSource } from 'axios';
// import { Components } from '~/api/atlas/client';
// import fetchAssetAggregation from './fetchAssetAggregation';


import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';
import axios, { CancelTokenSource } from 'axios';
import { SourceList } from '~/constant/source';
import swrvState from '../utils/swrvState';


export default function fetchAssetDiscover(cache?: boolean, dependentKey?: Ref<any>, assetTypeAggregation: string) {

    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());

    const body: Ref<SearchParameters> = ref({
        typeName: "Table,View",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        limit: 20,
        offset: 0,
        attributes: [...BaseAttributes, ...BasicSearchAttributes],
        entityFilters: null,
    });

    let options = ref({
        cancelToken: cancelTokenSource?.value.token,
        revalidateOnFocus: false,
        dedupingInterval: 1,
        immediate: false,
    });
    const { data, mutate, isValidating, error } = SearchBasic.BasicV2(true, body.value, options, dependentKey);
    const { state, STATES } = swrvState(data, error, isValidating);



    //Aggregate Setup
    const aggregateBody = ref({
        ...body.value,
        limit: 1,
        offset: 0,
        attributes: [],
        aggregationAttributes: ["__typeName.keyword"]
    });
    const dependentKeyAggregation = ref(false);
    const { data: aggregationData, mutate: mutateAggregation, error: errorAggregation, isValidating: isValidatingAggregation } = SearchBasic.BasicV2(false, aggregateBody.value, options);
    const { state: AggregationState, STATES: AggergationSTATES } = swrvState(data, error, isValidating);



    const list = ref([]);
    watch(data, () => {
        if (body?.value?.offset > 0) {
            list.value = list.value.concat(data?.value?.entities);
        } else {
            if (data.value?.entities) {
                list.value = data.value?.entities;
            } else {
                list.value = [];
            }
        }
        refreshAggregation();
    });

    const listCount: ComputedRef<any> = computed(() => {
        return list.value.length;
    });
    const limit: ComputedRef<any> = computed(() => {
        return body.value.limit;
    });
    const offset: ComputedRef<any> = computed(() => {
        return body.value.offset;
    });
    const totalCount: ComputedRef<any> = computed(() => {
        return data?.value?.approximateCount;
    });
    const aggregations: ComputedRef<any[]> = computed(() => {
        return aggregationData?.value?.aggregations;
    });
    const assetTypeList: ComputedRef<any> = computed(() => {
        let temp: any[] = [];
        let map = aggregations?.value?.['__typeName.keyword'];
        if (map) {
            Object.keys(map).forEach((key) => {
                if (map[key] > 0) {
                    const found = AssetTypeList.find((item) => {
                        return item.id == key
                    });
                    if (found) {
                        temp.push({
                            ...found,
                            count: map[key]
                        });
                    }
                }
            });
        }
        console.log(map);
        return temp;
    });


    const refreshAggregation = () => {
        dependentKeyAggregation.value = true;
        aggregateBody.value = {
            ...body.value,
            aggregationAttributes: ["__typeName.keyword"]
        }
        mutateAggregation();
    };


    const refresh = () => {
        if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value) || [AggergationSTATES.PENDING].includes(AggregationState.value)
            || [AggergationSTATES.VALIDATING].includes(AggregationState.value)) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            options.value.cancelToken = cancelTokenSource.value.token;
        }
        mutate();
    };

    const isLoadMore = computed(() => {
        if (listCount.value < totalCount.value) {
            return true;
        }
        return false;
    });

    const loadMore = (limit: number) => {
        if (isLoadMore.value) {
            body.value.offset += limit;
        }

        refresh();
    };

    const query = (queryText: string) => {
        body.value.query = queryText;
        body.value.offset = 0;
        refresh();
    };

    const handleChangeAssetType = (assetType: string) => {
        console.log(assetType);
        refresh();
    };


    const isLoading = computed(() => {
        if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
            return true;
        }
        return false;
    });

    const isError = computed(() => {
        if ([STATES.ERROR, STATES.STALE_IF_ERROR].includes(state.value)) {
            return true;
        }
        return false;
    });





    // let localList: Ref<any[]> = ref([]);
    // const body: Ref<SearchParameters> = ref({
    //     typeName: "Table,View",
    //     excludeDeletedEntities: true,
    //     includeClassificationAttributes: true,
    //     includeSubClassifications: true,
    //     includeSubTypes: true,
    //     limit: 20,
    //     offset: 0,
    //     attributes: [...BaseAttributes, ...BasicSearchAttributes],
    //     entityFilters: null,
    // });

    // const { data,
    //     totalCount,
    //     aggregations,
    //     error,
    //     state,
    //     STATES,
    //     mutate } = fetchSearchList(immediate, body, cancelToken);

    // watch(data, (newValue, oldValue) => {
    //     if (body?.value?.offset > 0) {
    //         localList.value = localList.value.concat(data?.value?.entities);
    //     } else {
    //         if (data.value?.entities) {
    //             localList.value = data.value?.entities;
    //         } else {
    //             localList.value = [];
    //         }
    //     }
    // });

    // const refreshAssets = (limit?: number, offset?: number, filters?: SearchParameters, assetType?: string, sort?: string) => {
    //     // if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
    //     //     if (cancelToken.value) {
    //     //         cancelToken.value.cancel("cancelled");
    //     //     }
    //     //     cancelToken.value = axios.CancelToken.source();
    //     // }
    //     // console.log("refresh");
    //     // immediate.value = true;
    //     // console.log(immediate.value);
    //     // if (assetType?.value) {
    //     //     aggregationBody.value = {
    //     //         ...body.value
    //     //     }
    //     //     aggregationBody.value.aggregationAttributes = ["__typeName.keyword"];
    //     //     execute();
    //     // }
    //     mutate();
    // };



    // // let aggregationBody: Ref<SearchParameters> = ref({});
    // // const {
    // //     execute
    // // } = fetchAssetAggregation(aggregationBody, cancelToken);



    // const listCount: ComputedRef<any> = computed(() => {
    //     return localList.value.length;
    // });

    // const listCountSum: ComputedRef<any> = computed(() => {
    //     let sum = 0;
    //     assetTypeList.value.forEach((element: { count: number; }) => {
    //         sum += element.count;
    //     });
    //     return sum;
    // });

    // const assetTypeList: ComputedRef<any> = computed(() => {
    //     let temp: any[] = [];
    //     let map = aggregations?.value?.['__typeName.keyword'];
    //     if (map) {
    //         Object.keys(map).forEach((key) => {
    //             if (map[key] > 0) {
    //                 const found = AssetTypeList.find((item) => {
    //                     return item.id == key
    //                 });
    //                 if (found) {
    //                     temp.push({
    //                         ...found,
    //                         count: map[key]
    //                     });
    //                 }
    //             }
    //         });
    //     }
    //     return temp;
    // });

    // const updateLocalList = (updatedItem: any) => {
    //     const found = localList.value.findIndex((item) => item.guid === updatedItem.guid)
    //     if (found >= 0) {
    //         localList.value.splice(found, 1, updatedItem);
    //     }
    // };

    return {
        data,
        list,
        listCount,
        mutate,
        isLoadMore,
        loadMore,
        query,
        isError,
        isLoading,
        error,
        limit,
        offset,
        totalCount,
        refresh,
        assetTypeList,
    }
}