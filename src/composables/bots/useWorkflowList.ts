
import { computed, reactive, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';
import { BaseAttributes, BotsAttributes } from '~/constant/projection';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { BotsType } from '~/types/atlas/bots';
import { Search } from '~/api2/search';
import { IConfig } from 'swrv';
import { Components } from '~/api/atlas/client';
import { Workflow } from '~/api2/workflow';


export default function useWorkflowList(dependentKey?: Ref<any>, initialParams?: any, cacheSuffx?: string | "") {


    console.log(initialParams);
    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());
    const asyncOptions: Ref<IConfig & AxiosRequestConfig> = ref({
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateDebounce: 0,
    });
    let params = ref({
        ...initialParams
    });
    const { data, STATES,
        state, mutate } = Workflow.List(params, asyncOptions, `${cacheSuffx}`, dependentKey);


    const isLoading = computed(() => {
        return [STATES.PENDING].includes(state.value);
    });
    const isValidating = computed(() => {
        return [STATES.VALIDATING].includes(state.value);
    });

    const refresh = () => {
        if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            asyncOptions.cancelToken = cancelTokenSource.value.token;
        }
        mutate();
    };


    const replaceParams = (payload: any) => {
        console.log("replace", params.value, payload);
        params.value = { ...payload }
        console.log("replace", params);
        // refresh();
    }



    return {
        data,
        state,
        STATES,
        isLoading,
        isValidating,
        replaceParams,
        refresh,
    }
};