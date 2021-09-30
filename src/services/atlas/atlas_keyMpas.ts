import { getAPIPath, PathParams } from '~/api'

export const KeyMaps = {
    insights: {
        BASIC_SEARCH: () => getAPIPath('auth/atlas', '/search/basic'),
        CREATE_SAVED_QUERY: () => getAPIPath('auth/atlas', '/entity'),
        GET_SAVED_QUERY: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/entity/guid/${guid}`),
        UPDATE_SAVED_QUERY: () => getAPIPath('auth/atlas', `/entity`),
    },
}
