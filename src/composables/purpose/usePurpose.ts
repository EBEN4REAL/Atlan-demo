import { watch } from 'vue'

import { Purpose } from '~/services/service/purpose'
import { usePurposeStore } from '~/store/purpose'

export default function usePurpose() {
    const { data } = Purpose.List()
    const purposeStore = usePurposeStore()
    watch(data, () => {
        purposeStore.setList(data.value?.records)
        // console.log(tenantStore.tenantRaw)
    })
    return {
        data,
    }
}
