import { useAPI } from "~/api/useAPI"
import { Components } from '~/api/atlas/client';

import { GET_ASSET_AUDIT } from "~/api/keyMaps/asset/index";

const useAssetAudit = (guid: string) => {
    const { data: audits, error, isLoading } = useAPI<Components.Schemas.EntityAuditEventV2[]>(GET_ASSET_AUDIT, 'GET', { pathVariables: { guid } })
    return {
        audits,
        error,
        isLoading,
    }
}

export default useAssetAudit;