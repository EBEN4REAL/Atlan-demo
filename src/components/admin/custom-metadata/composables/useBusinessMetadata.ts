import { ref, watch, toRaw, computed } from 'vue'
import { DEFAULT_ATTRIBUTE, DEFAULT_BM } from '~/constant/business_metadata'
// import { generateUUID } from '~/utils/helper/generator'
import useBusinessMetadataStore from '~/store/businessMetadata'
import { BusinessMetadataService } from '~/api/atlas/businessMetadata'

interface attributeDefs {
    name: string
    options: { displayName: string }
}
interface BMObject {
    error?: null | object
    data?: {
        attributeDefs: attributeDefs[]
        name: string
    } | null
}

export default function useBusinessMetadata() {
    const getDefaultAttributeTemplate = () =>
        // const uuid4 = generateUUID()
        // TODO changes when UUID4 support
        ({ ...DEFAULT_ATTRIBUTE })
    // return { ...DEFAULT_ATTRIBUTE, name: uuid4 };


    /**
     * @param {Object} BmObject - BM object to be edited
     * @return returns modfied ref object as per api format
     */
    const getUpdatePayload = (BmObject: {
        attributeDefs: []
        description: string
        name: string
        options: []
        guid: string
    }) => {
        const tempBm = JSON.parse(JSON.stringify(BmObject))
        const payload = {
            businessMetadataDefs: [
                {
                    ...(tempBm.guid === 'new'
                        ? {
                            category: 'BUSINESS_METADATA',
                            typeVersion: '1.1',
                            version: 1,
                            attributeDefs: tempBm.attributeDefs,
                            description: tempBm.description,
                            name: tempBm.name,
                            options: tempBm.options,
                        }
                        : tempBm),
                },
            ],
            classificationDefs: [],
            entityDefs: [],
            enumDefs: [],
            structDefs: [],
        }
        return ref(payload)
    }

    // * Get all available BMs and save on store
    const store = useBusinessMetadataStore()

    const fetchBMonStore = () => {
        console.log('fetching BM list...')
        const {
            data: BMResponse,
            error: BMListError,
            isLoading: BMListLoading,
        } = BusinessMetadataService.getBMList()

        // FIXME debug this
        watch(
            [BMListLoading, BMListError],
            (n) => {
                console.log([BMListLoading, BMListError])
                const error = toRaw(BMListError.value)
                console.log(error)
                store.setBusinessMetadataListLoading(n[0].value)
                // store.setBusinessMetadataListError(
                //     error.response.data.errorMessage
                // );
            },
            { deep: true }
        )

        watch(
            () => BMResponse?.value?.businessMetadataDefs,
            (n) => {
                if (n) {
                    const list = n.map(
                        (bm: {
                            options: { displayName: string }
                            name: string
                            attributeDefs: [
                                {
                                    name: string
                                    options: { displayName: string }
                                }
                            ]
                        }) => ({
                            ...bm,
                            options: {
                                ...bm?.options,
                                displayName: bm?.options?.displayName
                                    ? bm.options.displayName
                                    : bm.name,
                            },
                            attributeDefs: bm.attributeDefs.map((a) => {
                                if (a.options?.displayName?.length) return a
                                return {
                                    ...a,
                                    options: {
                                        ...a.options,
                                        displayName: a.name,
                                    },
                                }
                            }),
                        })
                    )
                    store.setData(list)
                    store.setBusinessMetadataListLoaded(true);
                }
            }
        )
    }

    // * Data
    const selectedBm = ref(null)
    const searchText = ref('')
    const newBm = ref(null)
    const updatedBm = ref(null)

    const businessMetadataList = computed(() => store.getBusinessMetadataList)

    const businessMetadataListError = computed(
        () => store.businessMetadataListError
    )


    const finalBusinessMetadataList = computed(() => [
        ...(newBm.value ? [newBm.value] : []),
        ...(businessMetadataList.value ? businessMetadataList.value : []),
    ])



    const handleSelectBm = (item: any) => {
        selectedBm.value = item
        updatedBm.value = null
    }

    const getNewBmTemplate = () =>
        // const uuid4 = generateUUID()
        // TODO changes when UUID4 support
        // return { ...DEFAULT_BM, name: uuid4 };
        ({ ...DEFAULT_BM })

    const clearSearchText = () => {
        searchText.value = ''
    }
    const discardNewBm = () => {
        const reqIndex = finalBusinessMetadataList.value.findIndex(
            (bm) => bm.guid === 'new'
        )
        if (reqIndex !== -1) {
            newBm.value = null
            selectedBm.value = finalBusinessMetadataList.value.length
                ? JSON.parse(JSON.stringify(finalBusinessMetadataList.value[0]))
                : null
        }
    }
    /**
     * @desc if an existing bm is being updated, set updated bm to
     */
    const onUpdate = (bm: { guid: string } | null) => {
        if (bm.guid === 'new') {
            newBm.value = bm
        } else {
            updatedBm.value = bm
        }
    }

    const onCreateNewBmClick = () => {
        const reqIndex = finalBusinessMetadataList.value.findIndex(
            (bm) => bm.guid === 'new'
        )
        if (reqIndex === -1) {
            const newBmTemplate = getNewBmTemplate()
            newBm.value = JSON.parse(JSON.stringify(newBmTemplate))
            selectedBm.value = JSON.parse(JSON.stringify(newBmTemplate))
        } else {
            selectedBm.value = JSON.parse(
                JSON.stringify(finalBusinessMetadataList.value[reqIndex])
            )
        }
    }


    const handleAfterArchive = () => {
        console.log('handleAfterArchive')
    }
    const searchedBusinessMetadataList = computed(() => {
        if (searchText.value) {
            return finalBusinessMetadataList.value.filter((bm) =>
                bm.name.toUpperCase().includes(searchText.value.toUpperCase())
            )
        }
        return finalBusinessMetadataList
    })

    /**
     * @param {Object} BmObject -  final BM object ready for updating
     * @desc - checks for invalid/ missing data, also handles missing name key
     */
    const validatePayload = (BmObject: {
        name: string
        description: string
        options: { displayName: string }
        guid: string
        attributeDefs: object & {}
    }) => {
        const temp: BMObject = {
            error: null,
            data: null,
        }
        temp.data = JSON.parse(JSON.stringify(BmObject))
        if (!temp.data.description.length) temp.data.description = '-'
        if (!temp.data.options.displayName) {
            temp.error = {
                data: { errorMessage: 'Custom Metadata name cannot be empty' },
            }
            return temp
        }
        // * if creating new BM append displayName to name,
        if (!temp.data.name) temp.data.name = temp.data.options.displayName
        if (temp.data && temp.data.attributeDefs.length) {
            // eslint-disable-next-line
            for (let i = 0; i < temp.data.attributeDefs.length; i++) {
                delete temp.data.attributeDefs[i].id
                const attribute = temp.data.attributeDefs[i]
                if (!attribute.options.displayName) {
                    temp.error = {
                        data: {
                            errorMessage: 'Attribute names cannot be empty',
                        },
                    }
                    return temp
                }
                if (!attribute.name) {
                    // * if creating new BM attribtue <> append displayName to name,
                    temp.data.attributeDefs[i].name =
                        attribute.options.displayName
                }
                // eslint-disable-next-line no-prototype-builtins
                if (temp.data.attributeDefs[i].hasOwnProperty('isNew')) {
                    delete temp.data.attributeDefs[i].isNew
                }
                // if (temp.data.attributeDefs[i].hasOwnProperty("isEditing")) {
                //     delete temp.data.attributeDefs[i].isEditing;
                // }
            }
        }
        return temp
    }

    //* Hooks

    watch(finalBusinessMetadataList, (n) => {
        if (n.length && !selectedBm.value) {
            selectedBm.value = JSON.parse(
                JSON.stringify(finalBusinessMetadataList.value[0])
            )
        }
    })

    return {
        businessMetadataList,
        businessMetadataListError,
        clearSearchText,
        discardNewBm,
        fetchBMonStore,
        finalBusinessMetadataList,
        getDefaultAttributeTemplate,
        getUpdatePayload,
        handleAfterArchive,
        handleSelectBm,
        newBm,
        onCreateNewBmClick,
        onUpdate,
        searchText,
        searchedBusinessMetadataList,
        selectedBm,
        updatedBm,
        validatePayload,
    }
}
