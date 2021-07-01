import { AxiosRequestConfig } from "axios";
import { IConfig } from "swrv";
import { Ref } from "vue";
import { SearchParameters } from "~/types/atlas/attributes";
import { BASIC_SEARCH } from "../keymap/search";
import { useAPI } from "../useAPI";

const BasicSearch = (
    body?: Ref<SearchParameters>,
    options?: IConfig & AxiosRequestConfig,
    cacheSuffix?: string,
    dependantFetchingKey?: Ref<any>
) => {
    return useAPI<any>(BASIC_SEARCH, "POST", {
        body,
        options,
        cacheSuffix,
        dependantFetchingKey
    });
};



export const Search = {
    BasicSearch,
};