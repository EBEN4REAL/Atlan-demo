
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';

import { SearchBasic } from '~/api/atlas/searchbasic';
import { BaseAttributes, BotsAttributes } from '~/constant/projection';
import axios, { CancelTokenSource } from 'axios';

import swrvState from '../utils/swrvState';
import { Components } from '~/api/atlas/client';
import { ConnectionType } from '~/types/atlas/connection';
import { BotsType } from '~/types/atlas/bots';



export default function fetchBotsList(cache?: string, dependentKey?: Ref<any>, paramEntityFilters?: Components.Schemas.FilterCriteria) {

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
        typeName: "Bot",
        excludeDeletedEntities: true,
        includeClassificationAttributes: false,
        includeSubClassifications: false,
        includeSubTypes: false,
        limit: 100,
        offset: 0,
        attributes: [...BaseAttributes, ...BotsAttributes],
        entityFilters: {
            ...entityFilters,
            criterion: entityFilters.criterion
        },
        aggregationAttributes: [],
    });
    let options = ref({
        cancelToken: cancelTokenSource?.value.token,
        revalidateOnFocus: false,
        dedupingInterval: 1,
        immediate: false,
    });
    const { data, mutate, isValidating, error } = SearchBasic.BasicV2(cache, body, options, dependentKey);
    const { state, STATES } = swrvState(data, error, isValidating);

    const list: Ref<BotsType[]> = ref([]);
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
        aggregations,
        refresh,
    }
}