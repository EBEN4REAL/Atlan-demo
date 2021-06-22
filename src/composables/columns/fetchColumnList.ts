
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';

import { SearchBasic } from '~/api/atlas/searchbasic';
import { BaseAttributes, BotsAttributes, ColumnAttributes } from '~/constant/projection';
import axios, { CancelTokenSource } from 'axios';

import swrvState from '../utils/swrvState';
import { Components } from '~/api/atlas/client';
import { BotsType } from '~/types/atlas/bots';
import { dataTypeList } from '~/constant/datatype';



export default function fetchColumnList(cache?: string, dependentKey?: Ref<any>, paramEntityFilters?: Components.Schemas.FilterCriteria, aggregationAttributes?: string[], sortBy?: string, sortOrder?: string) {


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
        typeName: "Column",
        excludeDeletedEntities: true,
        includeClassificationAttributes: false,
        includeSubClassifications: false,
        includeSubTypes: false,
        limit: 20,
        offset: 0,
        sortBy: sortBy,
        sortOrder: sortOrder,
        attributes: [...BaseAttributes, ...ColumnAttributes],
        entityFilters: {
            ...entityFilters,
            criterion: entityFilters.criterion
        },
        aggregationAttributes: aggregationAttributes
    });
    let options = ref({
        cancelToken: cancelTokenSource?.value.token,
        revalidateOnFocus: false,
        dedupingInterval: 1,
        immediate: dependentKey?.value,
    });
    const { data, mutate, isValidating, error } = SearchBasic.BasicV2(cache, body, options, dependentKey);
    const { state, STATES } = swrvState(data, error, isValidating);

    const list: Ref<any[]> = ref([]);
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
    });

    const listCount: ComputedRef<any> = computed(() => {
        return list.value?.length;
    });
    const limit: ComputedRef<any> = computed(() => {
        return body.value?.limit;
    });
    const offset: ComputedRef<any> = computed(() => {
        return body.value.offset;
    });
    const totalCount: ComputedRef<any> = computed(() => {
        return data?.value?.approximateCount;
    });
    const aggregations: ComputedRef<any[]> = computed(() => {
        return data?.value?.aggregations;
    });

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


    const getDataTypeImage = (dataType: any) => {
        const found = dataTypeList.find(item => {
            return item.type.includes(dataType);
        });
        return found?.image;
    };


    const dataTypeAggregationList = (list: any) => {
        let temp = [];
        list.forEach(element => {

            console.log(element);
            const found = dataTypeList.find(item => {
                return item.type.includes(element.id.toUpperCase());
            });
            if (found) {
                temp.push({
                    ...found,
                    count: element.value,
                    label: element.id,
                })
            }
        });
        return temp;
    };


    const refresh = () => {
        if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            options.value.cancelToken = cancelTokenSource.value.token;
        }

        console.log("refresh");

        mutate();
    };

    const isLoadMore = computed(() => {
        if (listCount.value < totalCount.value) {
            return true;
        }
        return false;
    });

    const loadMore = () => {
        if (isLoadMore.value) {
            body.value.offset += body.value.limit;
        }
        refresh();
    };

    const query = (queryText: string) => {
        body.value.query = queryText;
        body.value.offset = 0;
        refresh();
    };

    const filter = (filters: Components.Schemas.FilterCriteria) => {
        body.value.entityFilters = {
            ...filters
        }
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
        list,
        listCount,
        body,
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
        aggregations,
        aggregationArray,
        aggregationSum,
        dataTypeAggregationList,
        refresh,
        getDataTypeImage
    }
}