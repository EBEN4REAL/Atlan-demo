import { getAPIPath, PathParams } from '~/api'

export const useSSEKeyMaps = {
    query: {
        RUN_QUERY: ({
            query,
            defaultSchema,
            dataSourceName,
            length,
        }: PathParams) => {
            return getAPIPath(
                'api/query',
                `/sql/stream?sql=${query}&defaultSchema=${defaultSchema}&dataSourceName=${dataSourceName}&length=${length}`
            )
        },
    },
}
