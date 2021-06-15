import { fetcher, fetcherPost, getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import useSWRV, { IConfig } from "swrv";
import { GlossaryType } from "~/types/atlas/glossary";
import { ref, Ref, toRefs } from "vue";
import { Components } from "./client";

const serviceAlias = "auth/atlas";

const List = (params?: any, options?: AxiosRequestConfig, config?: IConfig) => {
    const resp = useSWRV([getAPIPath(serviceAlias, "/glossary"), params, options], fetcher, config);
    return {
        loading: !resp.error && !resp.data,
        ...toRefs(resp),
    }
}

const ListCategoryHeadersForGlossary = (glossaryID: string, params?: any, options?: AxiosRequestConfig, config?: IConfig) => {
    const data = getAxiosClient().get(getAPIPath(serviceAlias, `/glossary/${glossaryID}/categories/headers`), {
        params,
        ...options,
    });
    const response = data as unknown as Components.Schemas.AtlasRelatedCategoryHeader[]
    return response;
}

const ListTermsForGlossary = (glossaryID: string, params?: any, options?: AxiosRequestConfig, config?: IConfig) => {
    const data = getAxiosClient().get(getAPIPath(serviceAlias, `/glossary/${glossaryID}/terms/optimized`), {
        params,
        ...options,
    });
    const response = data as unknown as Components.Schemas.AtlasGlossaryTerm[]
    return response;
};

const ListTermsForCategory = (categoryId: string, params?: any, options?: AxiosRequestConfig, config?: IConfig) => {
    const data = getAxiosClient().get(getAPIPath(serviceAlias, `/glossary/category/${categoryId}/terms/full`), {
        params,
        ...options,
    });
    const response = data as unknown as Components.Schemas.AtlasGlossaryTerm[]
    return response;
};


export const Glossary = {
    List,
    ListCategoryHeadersForGlossary,
    ListTermsForGlossary,
    ListTermsForCategory
};