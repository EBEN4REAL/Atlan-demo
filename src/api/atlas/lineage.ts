import { useAPI as useAPIV2 } from '~/services/api/useAPI'

/**
 * @deprecated
 * @see /src/services/atlas/lineage/lineage_api.ts
 */
const getLineageAPI = ({
    cache,
    guid,
    depth,
    direction,
}: {
    cache: string | undefined
    guid: string
    depth: number
    direction: string
}) =>
    useAPIV2('GET_LINEAGE', 'GET', {
        cache,
        pathVariables: { guid, depth, direction },
    })

export const Lineage = {
    getLineageAPI,
}
