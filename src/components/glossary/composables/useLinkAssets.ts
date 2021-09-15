import { useAPI } from '~/api/useAPI'

import { ASSIGN_TERM_LINKED_ASSETS, UNLINK_TERM_ASSETS } from '~/api/keyMaps/glossary'

import { Components } from '~/api/atlas/client'
import { assetInterface } from '~/types/assets/asset.interface'

export default function useLinkAssets() {
    const assignLinkedAssets = (termGuid: string, assets: Components.Schemas.AtlasEntityHeader[]) => {
        const {
            data: response,
            error: linkError,
            isValidating: loading,
        } = useAPI(
            ASSIGN_TERM_LINKED_ASSETS,
            'POST',
            {
                cache: false,
                body: assets,
                pathVariables: {
                    guid: termGuid
                }
            }
        );
    
        return { response, linkError, loading}
    }

    const unLinkAssets = (termGuid: string, assets: assetInterface[]) => {
        const body = assets.map((asset) => 
            ({
                relationshipGuid: asset.meanings.find((terms) => terms.termGuid === termGuid)?.relationGuid,
                guid: asset.guid,
                typeName: asset.typeName,
                displayText: asset.displayText,
                entityStatus: asset.status
            })
        )
        const {
            data: response,
            error: linkError,
            isValidating: loading,
        } = useAPI(
            UNLINK_TERM_ASSETS,
            'PUT',
            {
                cache: false,
                body,
                pathVariables: {
                    guid: termGuid
                }
            }
        );
    
        return { response, linkError, loading}
    }

    return {
        assignLinkedAssets,
        unLinkAssets
    }
}

