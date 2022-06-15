
import { ref, computed } from 'vue'
import { Types } from '~/services/meta/types/index'


export const removeProperty = (asset, metadata) => {

    const payload = ref({ [metadata.name]: {} }) // * If we want to clear all property, then jut add this empty payload & overwrite = true
    // ? also attach all other CM to not remove them with isOverwrite true
    const allAttributes = computed(() => {
        if (!asset) return []
        return Object.entries(asset.attributes).filter(
            ([key, val]) => key.split('.').length === 2
        )
    })

    allAttributes.value.forEach(attr => {
        const [attributeKey, value] = attr
        const [bmName, attributeName] = attributeKey.split(".")
        if (bmName !== metadata.name) {
            payload.value[bmName] = payload.value[bmName] || {}
            payload.value[bmName][attributeName] = value
        }
    })

    const assetID = () => asset?.guid

    const { error, isReady, isLoading, mutate } = Types.updateAssetBMChanges(assetID(), payload, {
        asyncOptions: {
            immediate: false, onError: (e) => {
                throw e
            }
        }
    }, true)


    return {
        error, isReady, isLoading, mutate
    }
}

