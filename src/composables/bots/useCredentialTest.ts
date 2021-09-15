import { computed, reactive, Ref, ref, watch } from 'vue';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
// import { IConfig } from 'swrv';
import { Credential } from '~/api/auth/credential';
// import useSWRVState from '~/api2/useSWRVState';


export default function useCredentialTest(dependentKey?: Ref<any>, initialBody?: any, cacheSuffx?: string | "") {

    const asyncOptions = {
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateDebounce: 0,

    };
    const body = ref({
        ...initialBody
    });

    const cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());
    const { data, mutate, error: isError, isReady } = Credential.TestCredential(body, asyncOptions);

    const isSuccess = ref(false);
    const isLoading = ref(true);

    watch([isError, data], (v) => {
        isLoading.value = false;
        if (v[1]?.message === "successful")
            isSuccess.value = true;
        else
            isSuccess.value = false;
    })
    const alertType = computed(() => {
        if (isSuccess.value) {
            return "success"
        } if (isError.value) {
            return "error"
        }
        return "info";
    });


    const alertMessage = computed(() => {
        if (isSuccess.value) {
            return "Authentication successful"
        } if (isError.value) {
            return "Authentication failed"
        }
        return "Connecting...";
    });


    const errorMessage = computed(() => {
        if (error.value?.message === "timeout") {
            return "Request timed out. Please check your host/port"
        }
        return error.value?.response?.data?.message;
    });



    const refresh = () => {
        // if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
        //     cancelTokenSource.value.cancel();
        //     cancelTokenSource.value = axios.CancelToken.source();
        //     asyncOptions.cancelToken = cancelTokenSource.value.token;
        // }
        mutate();
    };

    const replaceBody = (payload: any) => {
        body.value = payload;
        refresh();
    }
    return {
        data,
        isLoading,
        isError,
        isSuccess,
        alertType,
        alertMessage,
        errorMessage,
        replaceBody,
        refresh,
    }
};