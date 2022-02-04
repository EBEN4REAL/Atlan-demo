import { watch } from 'vue'
import Qs from 'qs'
import { Purpose } from '~/services/service/purpose'
import { usePurposeStore } from '~/store/purpose'

export default function usePurpose() {
    const { data } = Purpose.List({
        columns: ["displayName", "name", "createdAt", "createdBy", "updatedAt", "updatedBy", "type", "level", "description", "metadataPolicies", "dataPolicies", "users", "groups", "version", "enabled", "resources", "attributes"]
    }, { 
        options: {
            paramsSerializer:  (params) => Qs.stringify(params, {arrayFormat: 'repeat'})

            }
        }
    )
    const purposeStore = usePurposeStore()
    watch(data, () => {
        purposeStore.setList(data.value?.records)
        // console.log(tenantStore.tenantRaw)
    })
    return {
        data,
    }
}
