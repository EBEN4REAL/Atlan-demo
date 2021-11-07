import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'


export const CREATE_GLOSSARY = 'CREATE_GLOSSARY'
export const CREATE_GLOSSARY_CATEGORY = 'CREATE_GLOSSARY_CATEGORY'
export const CREATE_GLOSSARY_TERM = 'CREATE_GLOSSARY_TERM'

export const map = {
    [CREATE_GLOSSARY]: () => getAPIPath(BASE_PATH, '/glossary'),
    [CREATE_GLOSSARY_CATEGORY]: () => getAPIPath(BASE_PATH, '/glossary/category'),
    [CREATE_GLOSSARY_TERM]: () => getAPIPath(BASE_PATH, '/glossary/term'),
}
