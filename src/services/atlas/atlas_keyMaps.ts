import { getAPIPath, PathParams } from '~/api'

export const KeyMaps = {
    insights: {
        BASIC_SEARCH: () => getAPIPath('metastore', '/search/basic'),
        CREATE_SAVED_QUERY: () => getAPIPath('metastore', '/entity'),
        CREATE_QUERY_FOLDER: () => getAPIPath('metastore', '/entity'),
        GET_SAVED_QUERY: ({ guid }: PathParams) => getAPIPath('auth/atlas', `/entity/guid/${guid}`),
        UPDATE_SAVED_QUERY: () => getAPIPath('auth/atlas', `/entity`),
        DELETE_ENTITY: ({ guid }: Record<string, any>) => getAPIPath('auth/atlas', `/entity/bulk?guid=${guid}`),
    },
}
