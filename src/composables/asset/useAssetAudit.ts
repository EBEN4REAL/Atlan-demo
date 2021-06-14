import { useAPI } from "~/api/useAPI"

import { GET_ASSET_AUDIT } from "~/api/keyMaps/asset/index";

const useAssetAudit = (guid: string) => {
    console.log("GUID", guid)
    const { data: audit, error, isLoading } = useAPI(GET_ASSET_AUDIT, 'GET', { pathVariables: { guid } })
    return {
        audit,
        error,
        isLoading,
    }
}

export default useAssetAudit;