import { fetcher, fetcherPost, getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import useSWRV, { IConfig } from "swrv";
import { GlossaryType } from "~/types/atlas/glossary";
import { ref, Ref, toRefs } from "vue";
import { Components } from "./client";

import { CREATE_GLOSSARY, CREATE_GLOSSARY_CATEGORY, CREATE_GLOSSARY_TERM, GET_CATEGORY } from "~/api/keyMaps/glossary"
import { useAPI } from "../useAPI";

const serviceAlias = "auth/atlas";

const GetCategory = (guid: string, dependantFetchingKey?: Ref) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossaryCategory>(GET_CATEGORY, "GET", {
        cache: false,
        pathVariables: {
            guid
        },
        dependantFetchingKey
    })
    return { data, error, isLoading }
}

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

const CreateGlossary = (body: Record<string, any>) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossary>(CREATE_GLOSSARY, "POST", {
        cache: false,
        body
    })
    return { data, error, isLoading }
}

const CreateGlossaryCategory = (body: Record<string, any>, dependantFetchingKey?: Ref) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossary>(CREATE_GLOSSARY_CATEGORY, "POST", {
        cache: false,
        body,
        dependantFetchingKey
    })
    return { data, error, isLoading }
}

const CreateGlossaryTerm = (body: Record<string, any>, dependantFetchingKey?: Ref) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossary>(CREATE_GLOSSARY_TERM, "POST", {
        cache: false,
        body,
        dependantFetchingKey
    })
    return { data, error, isLoading }
}


export const Glossary = {
    GetCategory,
    List,
    ListCategoryHeadersForGlossary,
    ListTermsForGlossary,
    ListTermsForCategory,
    CreateGlossary,
    CreateGlossaryCategory,
    CreateGlossaryTerm
};