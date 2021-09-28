import { computed, reactive, Ref, ref, watch } from 'vue';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { Connection } from '~/api/auth/connection';


export default function useConnectionTest(initialBody?: any, asyncOpts?: object) {

    const cancelTokenSource: Ref<CancelTokenSource> = ref(axios.CancelToken.source());

    const body = ref({
        ...initialBody
    });

    const options = ref({
        // cancelToken: cancelTokenSource,
    })


    const { data, mutate, error: isError } = Connection.TestNetwork(body, options, asyncOpts);

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
            return "Connection successful"
        } if (isError.value) {
            return "Connection failed"
        }
        return "Connecting...";
    });


    const errorMessage = computed(() => {
        if (isError.value?.message === "timeout") {
            return "Request timed out. Please check your host/port"
        }
        return isError.value?.response?.data?.message;
    });


    // const isLoading = computed(() => {
    //     return [STATES.PENDING].includes(state.value);
    // });
    // const isValidating = computed(() => {
    //     return [STATES.VALIDATING].includes(state.value);
    // });


    const refresh = () => {
        if (isLoading.value) {
            cancelTokenSource.value.cancel();
            cancelTokenSource.value = axios.CancelToken.source();
            asyncOptions.value.cancelToken = cancelTokenSource.value.token;
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
        isSuccess,
        isError,
        replaceBody,
        refresh,
        alertType,
        alertMessage,
        errorMessage,
    }
};