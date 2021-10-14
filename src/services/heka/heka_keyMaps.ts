import { getAPIPath, PathParams } from '~/api'

export const KeyMaps = {
    insights: {
        GET_AUTO_SUGGESTIONS: () => 'query/info/suggest',
        RUN_QUERY: ({ params }: PathParams) =>
            getAPIPath('api/sql/query', `/stream?${params}`),
    },
}
