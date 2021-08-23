// * Composables
import { computed } from 'vue'
import { useBusinessMetadataStore } from '~/store/businessMetadata'

export default function useBusinessMetadataHelper() {
    const businessMetadataStore = useBusinessMetadataStore()

    // * Computed
    const businessMetadataList = computed(
        () => businessMetadataStore.getBusinessMetadataList
    )

    function createDebounce() {
        let timeout = null
        return function (fnc: () => void, delayMs: number) {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                fnc()
            }, delayMs || 500)
        }
    }

    const getDatatypeOfAttribute = (typeName: string | string[]) => {
        if (typeName && typeof typeName !== 'undefined') {
            if (
                typeName.includes('int') ||
                typeName.includes('double') ||
                typeName.includes('float') ||
                typeName.includes('byte') ||
                typeName.includes('short') ||
                typeName.includes('long')
            ) {
                if (typeName.includes('array')) {
                    return `array<number>`
                }
                return `number`
            }
            if (typeName.includes('date')) {
                if (typeName.includes('array')) {
                    return `array<date>`
                }
                return `date`
            }
            if (typeName.includes('boolean')) {
                return `boolean`
            }
            if (typeName.includes('string')) {
                if (typeName.includes('array')) {
                    return `array<text>`
                }
                return `text`
            }
        }

        // return ['enum', typeName] || typeName
        return typeName || ''
    }

    /**
     * @desc mapped BM object that has filter support
     * */
    const bmFiltersList = computed(() => {
        if (businessMetadataStore.getBusinessMetadataList?.length) {
            const bmFiltersList = businessMetadataStore.getBusinessMetadataList
                .filter((bm) =>
                    bm.attributeDefs.some((a) => a.options?.isFacet === 'true')
                )
                .map((bm) => ({
                    id: bm.name,
                    label: bm.options.displayName,
                    component: 'businessMetadata',
                    image: bm.options.image || '',
                    overallCondition: 'OR',
                    isDeleted: false,
                    isDisabled: false,
                    exclude: false,
                }))
            return [...bmFiltersList]
        }
        return []
    })

    /**
     * @desc consist of BM objects items with isFacet set to true, excluding isFacet false attribtues
     * */
    const bmDataMap = computed(() => {
        if (businessMetadataStore.getBusinessMetadataList?.length) {
            const filterableList = businessMetadataStore.getBusinessMetadataList
                .filter((bm) =>
                    bm.attributeDefs.some((a) => a.options?.isFacet === 'true')
                )
                .map((bm) => ({
                    [bm.name]: {
                        applied: {},
                        list: {
                            ...bm,
                            attributeDefs: bm.attributeDefs.filter(
                                (a) => a.options?.isFacet === 'true'
                            ),
                        },
                    },
                }))
            return Object.assign({}, ...filterableList)
        }
        return {}
    })

    const getApplicableBmGroups = (typeName: string) => {
        if (businessMetadataStore.getBusinessMetadataList?.length) {
            return businessMetadataStore.getBusinessMetadataList.filter(
                (bm) => {
                    const applicable = bm.attributeDefs.some((a) => {
                        if (
                            a.options.customEntityTypes &&
                            JSON.parse(a.options.customEntityTypes).includes(
                                typeName
                            )
                        )
                            return true
                        return false
                    })
                    if (applicable) return true
                    return false
                }
            )
        }
        return []
    }

    /**
     * Find the required from the BM List and return
     * @param  {String} name Name of the required BM
     * @return {Object}  The required BM or null
     */
    const getBMbyName = (name: string) => {
        const requiredBM = businessMetadataList.value.find(
            (bm: object) => name === bm.name
        )
        return JSON.parse(JSON.stringify(requiredBM)) || null
    }

    const getApplicableAttributes = (BMname, typeName) =>
        getBMbyName(BMname).attributeDefs.filter(
            (a) =>
                a.options.customEntityTypes &&
                JSON.parse(a.options.customEntityTypes).includes(typeName)
        )
    return {
        getDatatypeOfAttribute,
        businessMetadataStore,
        bmFiltersList,
        bmDataMap,
        getApplicableBmGroups,
        getApplicableAttributes,
        createDebounce,
    }
}
