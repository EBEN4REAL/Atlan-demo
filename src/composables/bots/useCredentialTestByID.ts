
import { computed, reactive, Ref, ref, watch } from 'vue';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { IConfig } from 'swrv';
import { Credential } from '~/api2/credential';
import useSWRVState from '~/api2/useSWRVState';


export default function useCredentialTestbyID(dependentKey?: Ref<any>, id?: any, cacheSuffx?: string | "") {

    const asyncOptions: Ref<IConfig & AxiosRequestConfig> = ref({
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateDebounce: 0,
    });

    const paramId = ref(id);

    let cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());
    const { data, state, STATES,
        mutate, error, isValidating } = Credential.TestCredentialByID(paramId.value, asyncOptions, `${cacheSuffx}`, dependentKey);

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
            return "Authentication successful"
        } else if (isError.value) {
            return "Authentication failed"
        }
        return "Connecting...";
    });


    const errorMessage = computed(() => {
        return error.value?.response?.data?.message;
    });


    const replaceId = (id: any) => {
        paramId.value = id;
        refresh();
    };


    const refresh = () => {
        if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            asyncOptions.cancelToken = cancelTokenSource.value.token;
        }
        mutate();
    };

    return {
        data,
        state,
        STATES,
        isLoading,
        isError,
        isSuccess,
        alertType,
        alertMessage,
        errorMessage,
        refresh,
        replaceId,
        error
    }
};