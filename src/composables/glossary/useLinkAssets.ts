import { useAPI } from '~/api/useAPI'

import { ASSIGN_TERM_LINKED_ASSETS } from '~/api/keyMaps/glossary'

import { Components } from '~/api/atlas/client'

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

    return {
        assignLinkedAssets
    }
}

