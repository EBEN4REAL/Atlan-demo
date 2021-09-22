import { AxiosRequestConfig } from "axios";
import useSWRV, { IConfig } from "swrv";
import { Ref, toRefs } from "vue";
import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import { Components } from "./client";

import { CREATE_GLOSSARY, CREATE_GLOSSARY_CATEGORY, CREATE_GLOSSARY_TERM, DELETE_GLOSSARY, DELETE_GLOSSARY_CATEGORY, DELETE_GLOSSARY_TERM, GET_CATEGORY, UPDATE_GLOSSARY, UPDATE_GLOSSARY_CATEGORY_FULL, UPDATE_GLOSSARY_TERM_FULL } from "~/api/keyMaps/glossary"
import { useAPI } from "../useAPI";

const serviceAlias = "auth/atlas";

const GetGlossary = (guid: string, params?: any, options?: AxiosRequestConfig) => {
    const data = getAxiosClient().get(getAPIPath(serviceAlias, `/glossary/${guid}`), {
        params,
        ...options,
    })
    return data as unknown as Components.Schemas.AtlasGlossary
}

const GetCategory = (guid: string, params?: any, options?: AxiosRequestConfig) => {
    const data = getAxiosClient().get(getAPIPath(serviceAlias, `/glossary/category/${guid}`), {
        params,
        ...options,
    })
    return data as unknown as Components.Schemas.AtlasGlossaryCategory
}

const GetTerm = (guid: string, params?: any, options?: AxiosRequestConfig) => {
    const data = getAxiosClient().get(getAPIPath(serviceAlias, `/glossary/term/${guid}`), {
        params,
        ...options,
    })
    return data as unknown as Components.Schemas.AtlasGlossaryTerm
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

const ListCategoryForGlossary = (glossaryID: string, params?: any, options?: AxiosRequestConfig, config?: IConfig) => {
    const data = getAxiosClient().get(getAPIPath(serviceAlias, `/glossary/${glossaryID}/categories`), {
        params,
        ...options,
    });
    const response = data as unknown as Components.Schemas.AtlasGlossaryCategory[]
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

const DeleteGlossary = (guid: string) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossary>(DELETE_GLOSSARY, "DELETE", {
        cache: false,
        pathVariables: {
            guid
        },
    })
    return { data, error, isLoading }
}

const DeleteGlossaryCategory = (guid: string) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossary>(DELETE_GLOSSARY_CATEGORY, "DELETE", {
        cache: false,
        pathVariables: {
            guid
        }, 
    })
    return { data, error, isLoading }
}

const DeleteGlossaryTerm = (guid: string) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossary>(DELETE_GLOSSARY_TERM, "DELETE", {
        cache: false,
        pathVariables: {
            guid
        }
    })
    return { data, error, isLoading }
}


const UpdateGlossary = (guid: string, body: Record<string, any>) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossary>(UPDATE_GLOSSARY, "PUT", {
        cache: false,
        pathVariables: {
            guid
        },
        body
    })
    return { data, error, isLoading }
}

const UpdateGlossaryCategory = (guid: string, body: Record<string, any>) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossary>(UPDATE_GLOSSARY_CATEGORY_FULL, "PUT", {
        cache: false,
        pathVariables: {
            guid
        }, 
        body
    })
    return { data, error, isLoading }
}

const UpdateGlossaryTerm = (guid: string, body: Record<string, any>) => {
    const { data, error, isLoading } = useAPI<Components.Schemas.AtlasGlossary>(UPDATE_GLOSSARY_TERM_FULL, "PUT", {
        cache: false,
        pathVariables: {
            guid
        },
        body
    })
    return { data, error, isLoading }
}
export const Glossary = {
    GetGlossary,
    GetCategory,
    GetTerm,
    List,
    ListCategoryHeadersForGlossary,
    ListCategoryForGlossary,
    ListTermsForGlossary,
    ListTermsForCategory,
    CreateGlossary,
    CreateGlossaryCategory,
    CreateGlossaryTerm,
    DeleteGlossary,
    DeleteGlossaryCategory,
    DeleteGlossaryTerm,
    UpdateGlossary,
    UpdateGlossaryCategory,
    UpdateGlossaryTerm,
};