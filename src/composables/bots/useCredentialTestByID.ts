
import { computed, reactive, Ref, ref, watch } from 'vue';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { Credential } from '~/api/auth/credential';


export default function useCredentialTestbyID(id?: string, asyncOpts?: object,) {

    const cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());

    const paramId = ref(id);

    const options = ref({
        // cancelToken: cancelTokenSource,
    })
    const { data, mutate, error: isError, isReady } = Credential.TestCredentialByID(paramId.value, options, asyncOpts);

    const isSuccess = ref(false);
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


    const errorMessage = computed(() => isError.value?.response?.data?.message);

    const refresh = () => {
        if (isLoading.value) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            options.value.cancelToken = cancelTokenSource.value.token;
        }
        isLoading.value = true;
        mutate();
    };

    const replaceId = (guid: string) => {
        paramId.value = guid;
        refresh();
    };

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        alertType,
        alertMessage,
        errorMessage,
        refresh,
        replaceId,
    }
};