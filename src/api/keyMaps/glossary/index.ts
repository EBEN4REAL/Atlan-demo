import { getAPIPath } from "~/api";

export const CREATE_GLOSSARY = 'CREATE_GLOSSARY';
export const CREATE_GLOSSARY_CATEGORY = 'CREATE_GLOSSARY_CATEGORY';
export const CREATE_GLOSSARY_TERM = 'CREATE_GLOSSARY_TERM';
export const GET_CATEGORY = 'GET_CATEGORY';

export const DELETE_GLOSSARY = 'DELETE_GLOSSARY';
export const DELETE_GLOSSARY_CATEGORY = 'DELETE_GLOSSARY_CATEGORY';
export const DELETE_GLOSSARY_TERM = 'DELETE_GLOSSARY_TERM';

export const UPDATE_GLOSSARY = 'UPDATE_GLOSSARY';
export const UPDATE_GLOSSARY_CATEGORY = 'UPDATE_GLOSSARY_CATEGORY';
export const UPDATE_GLOSSARY_TERM = 'UPDATE_GLOSSARY_TERM';

const groupsMap: Record<string, (...params:any) => string> = {
    [CREATE_GLOSSARY]: () => getAPIPath('auth/atlas', "/glossary"),
    [CREATE_GLOSSARY_CATEGORY]: () => getAPIPath('auth/atlas', "/glossary/category"),
    [CREATE_GLOSSARY_TERM]: () => getAPIPath('auth/atlas', "/glossary/term"),
    [GET_CATEGORY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/category/${guid}`),
  
    [DELETE_GLOSSARY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/${guid}`),
    [DELETE_GLOSSARY_CATEGORY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/category/${guid}`),
    [DELETE_GLOSSARY_TERM]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/term/${guid}`),

    [UPDATE_GLOSSARY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/${guid}/partial`),
    [UPDATE_GLOSSARY_CATEGORY]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/category/${guid}/partial`),
    [UPDATE_GLOSSARY_TERM]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/glossary/term/${guid}/partial`),
}

export default groupsMap;