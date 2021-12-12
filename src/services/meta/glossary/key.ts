import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'

// creation
export const CREATE_GLOSSARY = 'CREATE_GLOSSARY'
export const CREATE_GLOSSARY_CATEGORY = 'CREATE_GLOSSARY_CATEGORY'
export const CREATE_GLOSSARY_TERM = 'CREATE_GLOSSARY_TERM'

// deletion
export const DELETE_GTC = 'DELETE_GTC'

// link and unlink
export const ASSIGN_TERM_LINKED_ASSETS = 'ASSIGN_TERM_LINKED_ASSETS'
export const UNLINK_TERM_ASSETS = 'UNLINK_TERM_ASSETS'

export const map = {
    [CREATE_GLOSSARY]: () => getAPIPath(BASE_PATH, '/glossary'),
    [CREATE_GLOSSARY_CATEGORY]: () =>
        getAPIPath(BASE_PATH, '/glossary/category'),
    [CREATE_GLOSSARY_TERM]: () => getAPIPath(BASE_PATH, '/glossary/term'),

    [DELETE_GTC]: ({ guid }: Record<string, string>) =>
        getAPIPath('meta', `/entity/guid/${guid}`),

    [ASSIGN_TERM_LINKED_ASSETS]: ({ guid }: Record<string, string>) =>
        getAPIPath('meta', `/glossary/terms/${guid}/assignedEntities`),
    [UNLINK_TERM_ASSETS]: ({ guid }: Record<string, string>) =>
        getAPIPath('meta', `/glossary/terms/${guid}/assignedEntities`),
}
