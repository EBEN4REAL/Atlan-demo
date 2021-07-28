
import { computed, Ref, ref } from 'vue';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { IConfig } from 'swrv';
import { Run } from '~/api2/run';


export default function useWorkflowList(dependentKey?: Ref<any>, initialParams?: any, cacheSuffx?: string | "") {

    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());
    let asyncOptions: IConfig & AxiosRequestConfig = {
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateDebounce: 0,
    }
    if (cancelTokenSource) {
        asyncOptions.cancelToken = cancelTokenSource.value.token
    }

  
  
    let cachekey = ref(`${cacheSuffx}`)
    const { data, STATES,
        state, mutate } = Run.List(initialParams, asyncOptions, cachekey, dependentKey);


    const isLoading = computed(() => {
        return [STATES.PENDING].includes(state.value);
    });
    const isValidating = computed(() => {
        return [STATES.VALIDATING].includes(state.value);
    });

    const refresh = () => {
        if (cancelTokenSource) {
            if (
                ([STATES.PENDING].includes(state.value) ||
                    [STATES.VALIDATING].includes(state.value)) &&
                cancelTokenSource.value
            ) {
                cancelTokenSource?.value.cancel('aborted')
            }
            cancelTokenSource.value = axios.CancelToken.source()
            asyncOptions.cancelToken = cancelTokenSource?.value.token
        }
        mutate();
    };





    return {
        data,
        state,
        STATES,
        isLoading,
        isValidating,

        refresh,
    }
};