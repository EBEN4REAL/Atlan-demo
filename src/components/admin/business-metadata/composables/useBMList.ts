import { useAPI } from "~/api/useAPIv2";
import { GET_BUSINESS_METADATA } from "~/api/keyMaps/businessMetadata/index";
import { ref } from "vue";

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

export const useBMList = {
    getBMList
}