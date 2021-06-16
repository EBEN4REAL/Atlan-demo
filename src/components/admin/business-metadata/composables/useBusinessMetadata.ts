import { useAPI } from "~/api/useAPI"
// import { reactive, Ref, toRefs } from 'vue';

import { GET_BUSINESS_METADATA } from "~/api/keyMaps/businessMetadata/index";

const useBusinessMetadata =  () => {
    // const response = { data: {}, error: {},  isloading: false};
    let { data: bmResponse, error, isLoading: loading } =  useAPI(GET_BUSINESS_METADATA, 'GET', { params: { type: "BUSINESS_METADATA" }, cache: false });
    
    // response.data = data
    // response.error = error
    // response.isloading = isloading
    
    return {
       bmResponse, error, loading
    }
}

export default useBusinessMetadata;