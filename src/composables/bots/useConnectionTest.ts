
import { computed, reactive, Ref, ref, watch } from 'vue';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { IConfig } from 'swrv';
import { Connection } from '~/api2/connection';
import useSWRVState from '~/api2/useSWRVState';


export default function useConnectionTest(dependentKey?: Ref<any>, initialBody?: any, cacheSuffx?: string | "") {

    const asyncOptions: IConfig & AxiosRequestConfig = {
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateDebounce: 0,
    };
    let body = ref({
        ...initialBody
    });


    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());
    const { data,
        mutate, error, state, STATES, isValidating } = Connection.TestNetwork(body, asyncOptions, `${cacheSuffx}`, dependentKey);


    const isLoading = computed(() => {
        return (([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) && dependentKey?.value)
            || isValidating.value && dependentKey?.value;
    });

    const isSuccess = computed(() => {
        return ([STATES.SUCCESS].includes(state.value));
    });

    const isError = computed(() => {
        return [STATES.ERROR].includes(state.value) || [STATES.STALE_IF_ERROR].includes(state.value);
    });

    const alertType = computed(() => {
        if (isSuccess.value) {
            return "success"
        } else if (isError.value) {
            return "error"
        }
        return "info";
    });


    const alertMessage = computed(() => {
        if (isSuccess.value) {
            return "Connection successful"
        } else if (isError.value) {
            return "Connection failed"
        }
        return "Connecting...";
    });


    const errorMessage = computed(() => {
        return error.value?.response?.data?.message;
    });


    // const isLoading = computed(() => {
    //     return [STATES.PENDING].includes(state.value);
    // });
    // const isValidating = computed(() => {
    //     return [STATES.VALIDATING].includes(state.value);
    // });


    const refresh = () => {
        if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            asyncOptions.cancelToken = cancelTokenSource.value.token;
        }
        mutate(undefined, {
            forceRevalidate: true,
            shouldRetryOnError: true,
        });
    };

    const replaceBody = (payload: any) => {
        body.value = payload;
        refresh();
    }



    return {
        data,
        state,
        isLoading,
        isSuccess,
        isError,
        STATES,
        replaceBody,
        refresh,
        alertType,
        alertMessage,
        error,
        errorMessage,
        isValidating,
    }
};