import { useAPI, useAPIPromise } from '~/services/api/useAPI'
import { KeyMaps } from '~/services/atlas/atlas_keyMaps'

import {
    ASSIGN_TERM_LINKED_ASSETS,
    UNLINK_TERM_ASSETS,
} from '~/api/keyMaps/glossary'
import { watch } from 'vue'

import { Components } from '~/api/atlas/client'
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
        } = useAPI(ASSIGN_TERM_LINKED_ASSETS, 'POST', {
            cache: false,
            body: assets,
            pathVariables: {
                guid: termGuid,
            },
        })
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
            useAPIPromise(KeyMaps.assets.GET_ENTITY(assetGuid), 'GET', {})

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
        } = useAPI(UNLINK_TERM_ASSETS, 'PUT', {
            cache: false,
            body,
            pathVariables: {
                guid: termGuid,
            },
        })

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
