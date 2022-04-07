import { watch } from 'vue'
import Qs from 'qs'
import { Purpose } from '~/services/service/purpose'
import { usePurposeStore } from '~/store/purpose'

export default function usePurpose(immediate = true) {

    const { data, isLoading, isReady, error, mutate } = Purpose.List({
        columns: ['attributes', 'readme', 'createdAt', 'createdBy', 'dataPolicies', 'description', 'displayName', 'enabled', 'id', 'isActive', 'level', 'metadataPolicies', 'name', 'resources', 'tags', 'updatedAt', 'version']
    }, {
        asyncOptions: { immediate },
        options: {
            paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'repeat' })
        }
    }
    )
    const purposeStore = usePurposeStore()
    watch(data, () => {
        purposeStore.setList(data.value?.records)
        // console.log(tenantStore.tenantRaw)
    })
    watch(error, () => {
        if(error.value){
            purposeStore.setList([])
        }
 
    })
    return {
        data, isLoading, isReady, error, mutate
    }
}
