import { useAPI } from "~/api/useAPI"
import { Components } from '~/api/atlas/client';

import { GET_ASSET_AUDIT } from "~/api/keyMaps/asset/index";
import { reactive } from "vue";
import { toRefs } from "@vueuse/core";

const useAssetAudit = (guid: string) => {
    const response = reactive({
        audits: [] as Components.Schemas.EntityAuditEventV2[] | null,
        error: null as any,
        isLoading: false
    })

    const fetchAudits = (guid: string) => {
        const { data, error, isLoading } = useAPI<Components.Schemas.EntityAuditEventV2[]>(GET_ASSET_AUDIT, 'GET', { pathVariables: { guid }, cache: false })
        response.audits = data as unknown as Components.Schemas.EntityAuditEventV2[]
        response.error = error
        response.isLoading = isLoading.value;
    }

    fetchAudits(guid)
    return {
        ...toRefs(response),
        fetchAudits
    }
}

export default useAssetAudit;