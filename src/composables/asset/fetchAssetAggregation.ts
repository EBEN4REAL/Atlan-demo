
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';
import { SearchBasic } from '~/api/atlas/searchbasic';
// import axios, { CancelTokenSource } from 'axios';
// import { Components } from '~/api/atlas/client';
// import fetchAssetAggregation from './fetchAssetAggregation';


import axios, { CancelTokenSource } from 'axios';

import swrvState from '../utils/swrvState';
import { Components } from '~/api/atlas/client';
import { SourceList } from '~/constant/source';
import { AssetTypeList } from '~/constant/assetType';


export default function fetchAssetAggregation(assetType: string, aggregationAttributes: string[], paramEntityFilters?: Components.Schemas.FilterCriteria, cache?: string, dependentKey?: Ref<any>) {

    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());


    let entityFilters: Components.Schemas.FilterCriteria = {};
    if (paramEntityFilters) {
        entityFilters = {
            ...paramEntityFilters,
            criterion: paramEntityFilters.criterion
        }
    } else {
        entityFilters = {
            condition: "AND" as Components.Schemas.Condition,
            criterion: []
        }
    }

    const body: Ref<SearchParameters> = ref({
        typeName: assetType,
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        limit: 1,
        offset: 0,
        entityFilters: {
            ...entityFilters,
            criterion: entityFilters.criterion
        },
        aggregationAttributes: aggregationAttributes,
    });

    let options = ref({
        cancelToken: cancelTokenSource?.value.token,
        revalidateOnFocus: false,
        dedupingInterval: 1,
        immediate: false,
    });
    const { data, mutate, isValidating, error } = SearchBasic.BasicV2(cache, body, options, dependentKey);
    const { state, STATES } = swrvState(data, error, isValidating);


    const aggregations: ComputedRef<{ [key: string]: any }> = computed(() => {
        return data?.value?.aggregations;
    });

    const refresh = () => {
        if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            options.value.cancelToken = cancelTokenSource.value.token;
        }
        mutate();
    };

    const filter = (filters: Components.Schemas.FilterCriteria) => {
        body.value.entityFilters = filters;
        refresh();
    };

    const filterWithDelete = (filters: Components.Schemas.FilterCriteria) => {
        body.value.excludeDeletedEntities = false;
        body.value.entityFilters = filters;
        refresh();
    };


    const aggregationArray = (val: string) => {
        let temp: { id: string, value: any }[] = [];
        if (aggregations?.value) {
            Object.keys(aggregations?.value[val]).forEach((key) => {
                temp.push({
                    id: key,
                    value: aggregations?.value[val][key]
                })
            });
        }
        temp.sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0))
        return temp;
    };
    const aggregationSum = (val: string) => {
        let sum = 0;
        aggregationArray(val).forEach((element) => {
            sum += element.value;
        });
        return sum;
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

    const source = (integratioName: string) => {
        return SourceList.find((item) => item.id == integratioName);
    };

    const assetTypeObject = (type: string) => {
        return AssetTypeList.find((item) => item.id == type);
    };


    return {
        data,
        aggregations,
        mutate,
        filter,
        filterWithDelete,
        isError,
        isLoading,
        error,
        refresh,
        aggregationArray,
        aggregationSum,
        source,
        assetTypeObject
    }
}