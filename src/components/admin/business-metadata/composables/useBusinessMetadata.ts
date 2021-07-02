import { useAPI } from "~/api/useAPIv2";
// import { reactive, Ref, toRefs } from 'vue';

import { ADD_BUSINESS_METADATA } from "~/api/keyMaps/businessMetadata/index";
const useBusinessMetadata = () => {

    const addNewBusinessMetadata = (payload: any) => {
        const { data, mutate, error, isReady } = useAPI(ADD_BUSINESS_METADATA, "POST", { params: { type: "BUSINESS_METADATA" }, cache: undefined, body: payload })
        return { data, mutate, error, isReady };
    }

    const updateNewBusinessMetadata = (payload: any) => {
        const { data, mutate, error, isReady } = useAPI(ADD_BUSINESS_METADATA, "PUT", { params: { type: "BUSINESS_METADATA" }, cache: undefined, body: payload })
        return { data, mutate, error, isReady };
    }

    return {
        addNewBusinessMetadata,
        updateNewBusinessMetadata
    };
};
export default useBusinessMetadata;
