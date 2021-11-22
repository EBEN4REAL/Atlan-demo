import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'

// creation
export const CREATE_GLOSSARY = 'CREATE_GLOSSARY'
export const CREATE_GLOSSARY_CATEGORY = 'CREATE_GLOSSARY_CATEGORY'
export const CREATE_GLOSSARY_TERM = 'CREATE_GLOSSARY_TERM'

// deletion
export const DELETE_GLOSSARY = 'DELETE_GLOSSARY'
export const DELETE_GLOSSARY_CATEGORY = 'DELETE_GLOSSARY_CATEGORY'
export const DELETE_GLOSSARY_TERM = 'DELETE_GLOSSARY_TERM'

// link and unlink
export const ASSIGN_TERM_LINKED_ASSETS = 'ASSIGN_TERM_LINKED_ASSETS'
export const UNLINK_TERM_ASSETS = 'UNLINK_TERM_ASSETS'

export const map = {
    [CREATE_GLOSSARY]: () => getAPIPath(BASE_PATH, '/glossary'),
    [CREATE_GLOSSARY_CATEGORY]: () =>
        getAPIPath(BASE_PATH, '/glossary/category'),
    [CREATE_GLOSSARY_TERM]: () => getAPIPath(BASE_PATH, '/glossary/term'),

    [DELETE_GLOSSARY]: ({ guid }: Record<string, string>) =>
        getAPIPath('meta', `/glossary/${guid}`),
    [DELETE_GLOSSARY_CATEGORY]: ({ guid }: Record<string, string>) =>
        getAPIPath('meta', `/glossary/category/${guid}`),
    [DELETE_GLOSSARY_TERM]: ({ guid }: Record<string, string>) =>
        getAPIPath('meta', `/glossary/term/${guid}`),

    [ASSIGN_TERM_LINKED_ASSETS]: ({ guid }: Record<string, string>) =>
        getAPIPath('meta', `/glossary/terms/${guid}/assignedEntities`),
    [UNLINK_TERM_ASSETS]: ({ guid }: Record<string, string>) =>
        getAPIPath('meta', `/glossary/terms/${guid}/assignedEntities`),
}
