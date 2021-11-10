import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map as glossaryMap } from '~/services/meta/glossary/key'
import { map as entityMap } from '~/services/meta/entity/key'
import { Components } from '~/types/atlas/client'
import { assetInterface } from '~/types/assets/asset.interface'

export default function useLinkAssets() {
    const assignLinkedAssets = (
        termGuid: string,
        assets: Components.Schemas.AtlasEntityHeader[]
    ) => {
        const {
            data: response,
            error: linkError,
            isValidating: loading,
        } = useAPI(
            glossaryMap.ASSIGN_TERM_LINKED_ASSETS,
            'POST',
            {
                body: assets,
                pathVariables: {
                    guid: termGuid,
                },
            },
            {}
        )
        return { response, linkError, loading }
    }
    const getRelationGuid = async (assetGuid, termGuid, asset) => {
        if (
            asset.meanings.find((terms) => terms.termGuid === termGuid)
                ?.relationGuid
        ) {
            return asset.meanings.find((terms) => terms.termGuid === termGuid)
                ?.relationGuid
        }
        const getEntityData = (id) =>
            useAPIPromise(entityMap.GET_ENTITY(assetGuid), 'GET', {})

        const response = await getEntityData(assetGuid)
        const relationshipGuid =
            response?.entity?.relationshipAttributes?.meanings.find(
                (term) => term.guid === termGuid
            )?.relationshipGuid ??
            response?.entity?.relationshipAttributes?.meanings.find(
                (term) => term.guid === termGuid
            )?.relationGuid

        return relationshipGuid
    }
    const unlink = (termGuid: string, body) => {
        const {
            data: response,
            error: linkError,
            isValidating: loading,
        } = useAPI(
            glossaryMap.UNLINK_TERM_ASSETS,
            'PUT',
            {
                body,
                pathVariables: {
                    guid: termGuid,
                },
            },
            {}
        )

        return { response, linkError, loading }
    }
    const unlinkAsset = async (termGuid: string, asset: assetInterface) => {
        let relationshipGuid = await getRelationGuid(
            asset.guid,
            termGuid,
            asset
        )
        const body = [
            {
                relationshipGuid,
                guid: asset.guid,
                typeName: asset.typeName,
                displayText: asset.displayText,
                entityStatus: asset.status,
            },
        ]
        const { response, linkError, loading } = unlink(termGuid, body)
        return { response, linkError, loading }
    }
    const unLinkAssets = (termGuid: string, assets: assetInterface[]) => {
        const body = assets.map((asset) => ({
            relationshipGuid: asset.meanings.find(
                (terms) => terms.termGuid === termGuid
            )?.relationGuid,
            guid: asset.guid,
            typeName: asset.typeName,
            displayText: asset.displayText,
            entityStatus: asset.status,
        }))
        const { response, linkError, loading } = unlink(termGuid, body)
        return { response, linkError, loading }
    }

    return {
        assignLinkedAssets,
        unLinkAssets,
        unlinkAsset,
    }
}
