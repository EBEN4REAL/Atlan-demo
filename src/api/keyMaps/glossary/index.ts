import { getAPIPath } from "~/api";

export const CREATE_GLOSSARY = 'CREATE_GLOSSARY';
export const CREATE_GLOSSARY_CATEGORY = 'CREATE_GLOSSARY_CATEGORY';
export const CREATE_GLOSSARY_TERM = 'CREATE_GLOSSARY_TERM';

export const GET_GTC_ENTITY = 'GET_GTC_ENTITY';
export const GET_GLOSSARY = 'GET_GLOSSARY';
export const GET_CATEGORY = 'GET_CATEGORY';
export const GET_TERM = 'GET_TERM';

export const DELETE_GLOSSARY = 'DELETE_GLOSSARY';
export const DELETE_GLOSSARY_CATEGORY = 'DELETE_GLOSSARY_CATEGORY';
export const DELETE_GLOSSARY_TERM = 'DELETE_GLOSSARY_TERM';

export const UPDATE_GLOSSARY = 'UPDATE_GLOSSARY';
export const UPDATE_GLOSSARY_CATEGORY = 'UPDATE_GLOSSARY_CATEGORY';
export const UPDATE_GLOSSARY_TERM = 'UPDATE_GLOSSARY_TERM';

export const GET_GLOSSARY_TERMS = 'GET_GLOSSARY_TERMS';
export const GET_GLOSSARY_CATEGORIES = 'GET_GLOSSARY_CATEGORIES';

export const GET_CATEGORY_TERMS = 'GET_CATEGORY_TERMS';

export const GET_TERM_LINKED_ASSETS = 'GET_TERM_LINKED_ASSETS';

const groupsMap: Record<string, (...params:any) => string> = {
    [CREATE_GLOSSARY]: () => getAPIPath('auth/atlas', "/glossary"),
    [CREATE_GLOSSARY_CATEGORY]: () => getAPIPath('auth/atlas', "/glossary/category"),
    [CREATE_GLOSSARY_TERM]: () => getAPIPath('auth/atlas', "/glossary/term"),
    
    [GET_GTC_ENTITY]: () => getAPIPath('auth/atlas', `/search/basic`),
    [GET_GLOSSARY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/${guid}`),
    [GET_CATEGORY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/category/${guid}`),
    [GET_TERM]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/term/${guid}`),
  
    [DELETE_GLOSSARY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/${guid}`),
    [DELETE_GLOSSARY_CATEGORY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/category/${guid}`),
    [DELETE_GLOSSARY_TERM]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/term/${guid}`),

    [UPDATE_GLOSSARY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/${guid}`),
    [UPDATE_GLOSSARY_CATEGORY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/category/${guid}`),
    [UPDATE_GLOSSARY_TERM]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/term/${guid}`),

    [GET_GLOSSARY_CATEGORIES]: ({ guid, limit, offset, searchText }: Record<string, any>) => getAPIPath('auth/atlas', `/glossary/${guid}/categories?limit=${limit ?? -1}${offset  ? `&offset=${offset}` : ''}${searchText ? `&searchText=${searchText}` : ''}`),
    [GET_GLOSSARY_TERMS]: ({ guid, limit, offset, searchText }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/${guid}/terms?limit=${limit ?? -1}${offset  ? `&offset=${offset}` : ''}${searchText ? `&searchText=${searchText}` : ''}`),

    [GET_CATEGORY_TERMS]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/category/${guid}/terms`),

    [GET_TERM_LINKED_ASSETS]: () => getAPIPath('auth/atlas', `/search/basic`),

}

export default groupsMap;