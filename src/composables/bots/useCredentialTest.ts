import { computed, reactive, Ref, ref, watch } from 'vue';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
// import { IConfig } from 'swrv';
import { Credential } from '~/api/auth/credential';


export default function useCredentialTest(initialBody?: any, asyncOpts?: object) {

    const cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());
    const body = ref({
        ...initialBody
    });
    const options = ref({
        // cancelToken: cancelTokenSource
    })

    const { data, mutate, error: isError, isReady } = Credential.TestCredential(body, options, asyncOpts);

    const isSuccess = ref(null);
    const isLoading = ref(null);
    if (asyncOpts.hasOwnProperty('immediate'))
        isLoading.value = asyncOpts.immediate
    else isLoading.value = true;

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
        if (isError.value?.message === "timeout") {
            return "Request timed out. Please check your host/port"
        }
        return isError.value?.response?.data?.message;
    });



    const refresh = () => {
        if (isLoading.value) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            asyncOptions.cancelToken = cancelTokenSource.value.token;
        }
        isLoading.value = true;
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