
import { computed, reactive, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';
import { BaseAttributes, BotsAttributes } from '~/constant/projection';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { Search } from '~/api2/search';
import { IConfig } from 'swrv';
import { Components } from '~/api/atlas/client';
import { AssetTypeList } from '~/constant/assetType';
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage';



export default function useSearchList(typeName: string, list: any, attributes: string[], dependentKey?: Ref<any>, initialBody?: any, cacheSuffx?: string | "", quickChange?: boolean, isLocalStorage?: boolean) {

    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());
    let asyncOptions: IConfig & AxiosRequestConfig = {
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateDebounce: 0,
    };
    if (isLocalStorage) {
        asyncOptions.cache = new LocalStorageCache()
    }

    let body = ref({
        typeName: typeName,
        excludeDeletedEntities: true,
        includeClassificationAttributes: false,
        includeSubClassifications: false,
        includeSubTypes: true,
        limit: 100,
        offset: 0,
        attributes: [...BaseAttributes, ...attributes],
        entityFilters: {},
        aggregationAttributes: [],
        ...initialBody
    });


    let cachekey = ref(`${cacheSuffx}`);
    const { data,
        mutate, state, STATES, error } = Search.BasicSearch(body, asyncOptions, cachekey, dependentKey);


    watch(data, () => {
        if (body?.value?.offset > 0) {
            list.value = list.value.concat(data?.value?.entities);
        } else {
            if (data.value?.entities) {
                list.value = [...data.value?.entities];
            } else {
                list.value = [];
            }
        }
    });

    const isLoading = computed(() => {
        return ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) && !data;
    });
    const isValidating = computed(() => {
        return [STATES.VALIDATING].includes(state.value);
    });
    const isError = computed(() => {
        return [STATES.ERROR].includes(state.value);
    });

    const refresh = () => {
        if (([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) && cancelTokenSource.value) {
            cancelTokenSource.value.cancel("aborted");
        }
        cancelTokenSource.value = axios.CancelToken.source();
        asyncOptions.cancelToken = cancelTokenSource.value.token;
        if (quickChange) {
            cachekey.value = `${cacheSuffx}_${Date.now().toString()}`;
        }
        else {
            mutate();
        }
    };

    const query = (queryText: string) => {
        body.value.query = queryText;
        body.value.offset = 0;
        refresh();
    };

    const replaceBody = (payload: any) => {
        body.value = payload;

        refresh();
    }

    const replaceFilters = (filters: Components.Schemas.FilterCriteria) => {
        body.value.entityFilters = {
            ...filters
        }
        refresh();
    }

    const assetTypeMap = computed(() => {
        if (data.value?.aggregations) {
            return data.value?.aggregations["__typeName.keyword"];
        }
        return {};
    });

    const assetTypeList = computed(() => {
        const tempList = AssetTypeList.filter((item) => item.isDiscoverable);
        tempList.forEach((item) => {
            item.count = assetTypeMap.value[item.id];
        })
        return tempList;
    });
    const assetTypeSum = computed(() => {
        let initialValue = 0;
        let sum = assetTypeList.value.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.count
        }, initialValue)
        return sum;
    });




    return {
        data,
        list,
        state,
        STATES,
        isLoading,
        isError,
        error,
        isValidating,
        query,
        replaceFilters,
        refresh,
        replaceBody,
        body,
        assetTypeMap,
        assetTypeList,
        assetTypeSum,
    }
};