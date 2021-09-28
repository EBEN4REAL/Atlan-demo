import { watch } from 'vue'
import { useClassificationStore } from '~/components/admin/classifications/_store'
import { Classification } from '~/api/atlas/classification'
import { typedefsInterface } from '~/types/typedefs/typedefs.interface'

export function useClassifications() {
    const classificationsStore = useClassificationStore()
    function isClassificationInitializedInStore() {
        return classificationsStore.fetchClassificationsStatus !== ''
    }
    function initializeClassificationsInStore() {
        classificationsStore.setClassificationsStatus('loading')
        const { data: classificationData, error: classificationError } =
            Classification.getClassificationList<typedefsInterface>({
                cache: false,
            })

        watch([classificationData, classificationError], () => {
            if (classificationData.value) {
                const classifications =
                    classificationData.value.classificationDefs || []

                classificationsStore.setClassifications(classifications ?? [])
                classificationsStore.initializeFilterTree()
                classificationsStore.setClassificationsStatus('success')
            } else {
                classificationsStore.setClassificationsStatus('error')
            }
        })
    }
    return {
        isClassificationInitializedInStore,
        initializeClassificationsInStore,
    }
}
