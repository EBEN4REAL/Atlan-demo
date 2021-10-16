import { getAPIPath, PathParams } from '~/api'

export const KeyMaps = {
    insights: {
        GET_AUTO_SUGGESTIONS: () => getAPIPath('sql/info/suggest', ''),
        RUN_QUERY: ({ params }: PathParams) =>
            getAPIPath('api/sql/query', `/stream?${params}`),
    },
    asset: {
        PREVIEW_TABLE: () => 'query/preview',
    },
}
