import { getAPIPath } from "~/api";

export const CREATE_GLOSSARY = 'CREATE_GLOSSARY';
export const CREATE_GLOSSARY_CATEGORY = 'CREATE_GLOSSARY_CATEGORY';
export const CREATE_GLOSSARY_TERM = 'CREATE_GLOSSARY_TERM';

const groupsMap: Record<string, (...params:any) => string> = {
    [CREATE_GLOSSARY]: () => getAPIPath('auth/atlas', "/glossary"),
    [CREATE_GLOSSARY_CATEGORY]: () => getAPIPath('auth/atlas', "/glossary/category"),
    [CREATE_GLOSSARY_TERM]: () => getAPIPath('auth/atlas', "/glossary/term"),
}

export default groupsMap;