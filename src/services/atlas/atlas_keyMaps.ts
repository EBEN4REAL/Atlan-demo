import { getAPIPath, PathParams } from '~/api'

export const KeyMaps = {
    insights: {
        BASIC_SEARCH: () => getAPIPath('meta', '/search/basic'),
        CREATE_SAVED_QUERY: () => getAPIPath('meta', '/entity'),
        CREATE_QUERY_FOLDER: () => getAPIPath('meta', '/entity'),
        GET_SAVED_QUERY: ({ guid }: PathParams) =>
            getAPIPath('meta', `/entity/guid/${guid}`),
        UPDATE_SAVED_QUERY: () => getAPIPath('meta', `/entity`),
        DELETE_ENTITY: ({ guid }: Record<string, any>) =>
            getAPIPath('meta', `/entity/bulk?guid=${guid}`),
    },
}
