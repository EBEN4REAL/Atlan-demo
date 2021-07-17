import { useAPI } from "~/api/useAPI";
import { GET_BUSINESS_METADATA } from "~/api/keyMaps/businessMetadata/index";
import { ADD_BUSINESS_METADATA } from "~/api/keyMaps/businessMetadata/index";
import { ref } from "vue";
// TODO Move all apis to /api
const getBMList = () => {
    let options = ref({
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        dedupingInterval: 1,
        immediate: false,
    });
    return useAPI(
        GET_BUSINESS_METADATA,
        "GET",
        { params: { type: "BUSINESS_METADATA" }, cache: "true", options }
    );
}

const addNewBusinessMetadata = (payload: object) => {
    const { data, mutate, error, isReady } = useAPI(ADD_BUSINESS_METADATA, "POST", { params: { type: "BUSINESS_METADATA" }, cache: undefined, body: payload })
    return { data, mutate, error, isReady };
}

const updateNewBusinessMetadata = (payload: object) => {
    const { data, mutate, error, isReady } = useAPI(ADD_BUSINESS_METADATA, "PUT", { params: { type: "BUSINESS_METADATA" }, cache: undefined, body: payload })
    return { data, mutate, error, isReady };
}


export const useBusinessMetadata = {
    getBMList,
    addNewBusinessMetadata,
    updateNewBusinessMetadata
}