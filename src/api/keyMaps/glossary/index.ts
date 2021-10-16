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

export const UPDATE_GLOSSARY_CATEGORY_FULL = 'UPDATE_GLOSSARY_CATEGORY_FULL';
export const UPDATE_GLOSSARY_TERM_FULL = 'UPDATE_GLOSSARY_TERM_FULL';

export const GET_GLOSSARY_TERMS = 'GET_GLOSSARY_TERMS';
export const GET_GLOSSARY_CATEGORIES = 'GET_GLOSSARY_CATEGORIES';

export const GET_CATEGORY_TERMS = 'GET_CATEGORY_TERMS';

export const GET_TERM_LINKED_ASSETS = 'GET_TERM_LINKED_ASSETS';
export const ASSIGN_TERM_LINKED_ASSETS = 'ASSIGN_TERM_LINKED_ASSETS';
export const BULK_LINK_TERMS = 'BULK_LINK_TERMS';
export const UNLINK_TERM_ASSETS = 'UNLINK_TERM_ASSETS';
export const GTC_SEARCH = 'GTC_SEARCH';
export const GLOSSARY_LIST = 'GLOSSARY_LIST';

const groupsMap: Record<string, (...params:any) => string> = {
    [CREATE_GLOSSARY]: () => getAPIPath('meta', "/glossary"),
    [CREATE_GLOSSARY_CATEGORY]: () => getAPIPath('meta', "/glossary/category"),
    [CREATE_GLOSSARY_TERM]: () => getAPIPath('meta', "/glossary/term"),
    
    [GET_GTC_ENTITY]: () => getAPIPath('meta', `/search/basic`),
    [GET_GLOSSARY]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/${guid}`),
    [GET_CATEGORY]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/category/${guid}`),
    [GET_TERM]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/term/${guid}`),
  
    [DELETE_GLOSSARY]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/${guid}`),
    [DELETE_GLOSSARY_CATEGORY]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/category/${guid}`),
    [DELETE_GLOSSARY_TERM]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/term/${guid}`),

    [UPDATE_GLOSSARY]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/${guid}`),
    [UPDATE_GLOSSARY_CATEGORY]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/category/${guid}/partial`),
    [UPDATE_GLOSSARY_TERM]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/term/${guid}/partial`),

    [UPDATE_GLOSSARY_CATEGORY_FULL]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/category/${guid}`),
    [UPDATE_GLOSSARY_TERM_FULL]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/term/${guid}`),


    [GET_GLOSSARY_CATEGORIES]: ({ guid, limit, offset, searchText }: Record<string, any>) => getAPIPath('meta', `/glossary/${guid}/categories?limit=${limit ?? -1}${offset  ? `&offset=${offset}` : ''}${searchText ? `&searchText=${searchText}` : ''}`),
    [GET_GLOSSARY_TERMS]: ({ guid, limit, offset, searchText }: Record<string, string>) => getAPIPath('meta', `/glossary/${guid}/terms?limit=${limit ?? -1}${offset  ? `&offset=${offset}` : ''}${searchText ? `&searchText=${searchText}` : ''}`),

    [GET_CATEGORY_TERMS]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/category/${guid}/terms`),

    [GET_TERM_LINKED_ASSETS]: () => getAPIPath('meta', `/search/basic`),
    [ASSIGN_TERM_LINKED_ASSETS]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/terms/${guid}/assignedEntities`),
    [BULK_LINK_TERMS]: () => getAPIPath('meta', `/glossary/terms/assignedEntities`),
    [UNLINK_TERM_ASSETS]: ({ guid }: Record<string, string>) => getAPIPath('meta', `/glossary/terms/${guid}/assignedEntities`),
    [GTC_SEARCH]: () => getAPIPath('meta', `/search/basic`),
    [GLOSSARY_LIST]: () => getAPIPath('meta', `/search/basic`),

}

export default groupsMap;