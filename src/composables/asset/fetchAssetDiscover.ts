
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
import { Components } from '~/api/atlas/client';


export default function fetchAssetDiscover(cache?: boolean, dependentKey?: Ref<any>, assetTypeAggregation: string) {

    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());

    let entityFilters: Components.Schemas.FilterCriteria = {
        condition: "AND" as Components.Schemas.Condition,
        criterion: []
    };



    const body: Ref<SearchParameters> = ref({
        typeName: "Table,View,Column",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        limit: 20,
        offset: 0,
        attributes: [...BaseAttributes, ...BasicSearchAttributes],
        entityFilters: {
            ...entityFilters,
            criterion: entityFilters.criterion
        }
    });

    let options = ref({
        cancelToken: cancelTokenSource?.value.token,
        revalidateOnFocus: false,
        dedupingInterval: 1,
        immediate: false,
    });
    const { data, mutate, isValidating, error } = SearchBasic.BasicV2(true, body, options, dependentKey);
    const { state, STATES } = swrvState(data, error, isValidating);



    //Aggregate Setup
    const aggregateBody: Ref<SearchParameters> = ref({
        ...body.value,
        limit: 1,
        offset: 0,
        attributes: [],
        entityFilters: {
            ...entityFilters,
            criterion: entityFilters.criterion
        },
        aggregationAttributes: ["__typeName.keyword"]
    });
    const dependentKeyAggregation = ref(false);
    const { data: aggregationData, mutate: mutateAggregation, error: errorAggregation, isValidating: isValidatingAggregation } = SearchBasic.BasicV2(false, aggregateBody, options);
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
        console.log("refresh");
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
            limit: 1,
            offset: 0,
            attributes: [],
            entityFilters: {
            },
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



    const changeAssetType = (assetType: string) => {
        let temp = {
            ...entityFilters
        }
        temp.criterion = [...entityFilters.criterion];
        temp.criterion?.push({
            attributeName: "__typeName",
            attributeValue: assetType,
            operator: "eq"
        });
        body.value.entityFilters = {
            ...temp
        }
        refresh();
    };

    const filter = (filters: Components.Schemas.FilterCriteria) => {
        body.value.entityFilters.criterion = filters;
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


    return {
        data,
        list,
        listCount,
        mutate,
        isLoadMore,
        loadMore,
        query,
        filter,
        isError,
        isLoading,
        error,
        limit,
        offset,
        totalCount,
        refresh,
        assetTypeList,
        changeAssetType,
    }
}