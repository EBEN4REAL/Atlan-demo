import { Ref, ref, watch, computed } from 'vue'

import { useAPI } from '~/services/api/useAPI'
import { map } from '~/services/meta/search/key'
import whoami from '~/composables/user/whoami'

const useCollectionInfo = (selectedAsset, collectionGuid) => {
    const selectedCollectionLoading = ref(false)
    const selectedCollectionData = ref({})
    const selectedCollectionError = ref()

    const { username: currentUser, groups: userGroups } = whoami()

    const attributes = [
        'name',
        'displayName',
        'typeName',

        'description',
        'userDescription',
        'certificateStatus',

        'ownerUsers',
        'ownerGroups',
        'adminUsers',
        'adminGroups',
        '__createdBy',
        '__state',
        '__guid',
        '__labels',
        'description',
        'displayDescription',
        'userDescription',
        'tenantId',
        'readme',
        'isDiscoverable',
        'alias',
        'isPrivate',
        'collectionQualifiedName',
        'viewerUsers',
        'viewerGroups',
        'icon',
        'iconType',
    ]

    let body = ref({})

    const refreshBody = () => {
        if (collectionGuid?.value) {
            body.value = {
                dsl: {
                    query: {
                        bool: {
                            must: [
                                {
                                    term: {
                                        __guid: collectionGuid?.value,
                                    },
                                },
                            ],
                        },
                    },
                },
                attributes,
                suppressLogs: true,
            }
        } else {
            body.value = {
                dsl: {
                    query: {
                        bool: {
                            must: [
                                {
                                    term: {
                                        qualifiedName:
                                            selectedAsset?.value?.attributes
                                                ?.collectionQualifiedName,
                                    },
                                },
                            ],
                        },
                    },
                },
                attributes,
                suppressLogs: true,
            }
        }
    }

    const getSelectedCollectionData = () => {
        // refreshBody()
        return useAPI(
            map.INDEX_SEARCH,
            'POST',
            {
                body,
            },
            {}
        )
    }

    const fetchCollectionInfo = () => {
        refreshBody()

        const { data, error, isLoading } = getSelectedCollectionData()
        selectedCollectionLoading.value = true

        watch([data, error, isLoading], () => {
            selectedCollectionLoading.value = true

            if (isLoading.value === false) {
                selectedCollectionLoading.value = false
                if (error.value === undefined) {
                    if (data?.value) {
                        selectedCollectionData.value = data?.value
                        if (data?.value?.entities?.length) {
                            selectedCollectionData.value =
                                data?.value?.entities[0]
                        }
                    } else {
                        selectedCollectionData.value = {}
                    }
                    selectedCollectionError.value = undefined
                    // message.success('collection fetched')
                } else {
                    selectedCollectionLoading.value = false
                    selectedCollectionError.value = error.value
                }
            }
        })
    }
    const hasCollectionReadPermission = computed(() => {
        // Viewer

        let viewerUsers = selectedCollectionData?.value?.attributes?.viewerUsers
            ? selectedCollectionData?.value?.attributes?.viewerUsers
            : []
        let viewerGroups = selectedCollectionData?.value?.attributes
            ?.viewerGroups
            ? selectedCollectionData?.value?.attributes?.viewerGroups
            : []

        // console.log('permission: ',toRaw(viewerUsers))

        if (viewerUsers?.length) {
            let v1 = viewerUsers.find((el) => el === currentUser.value)
            if (v1) {
                return true
            }
        }

        if (viewerGroups?.length) {
            let filteredArray = viewerGroups.filter((value) =>
                userGroups.value.includes(value)
            )
            return filteredArray.length > 0
        }
        return false
    })

    const hasCollectionWritePermission = computed(() => {
        let adminUsers = selectedCollectionData?.value?.attributes?.adminUsers
            ? selectedCollectionData?.value?.attributes?.adminUsers
            : []
        let adminGroups = selectedCollectionData.value?.attributes?.adminGroups
            ? selectedCollectionData.value?.attributes?.adminGroups
            : []

        if (adminUsers?.length) {
            let v1 = adminUsers.find((el) => el === currentUser.value)
            if (v1) {
                return true
            }
        }
        if (adminGroups?.length) {
            let filteredArray = adminGroups.filter((value) =>
                userGroups.value.includes(value)
            )
            return filteredArray.length > 0
        }
        return false
    })

    const isCollectionCreatedByCurrentUser = computed(() => {
        if (selectedCollectionData?.value) {
            return (
                currentUser.value ===
                selectedCollectionData?.value?.attributes?.__createdBy
            )
        } else {
            return false
        }
    })

    watch(
        () => selectedAsset?.value?.attributes?.collectionQualifiedName,
        async () => {
            if (
                selectedAsset?.value?.typeName === 'Query' ||
                collectionGuid?.value
            )
                await fetchCollectionInfo()
        },
        { deep: true, immediate: true }
    )

    return {
        collectionInfo: selectedCollectionData,
        hasCollectionReadPermission,
        hasCollectionWritePermission,
        isCollectionCreatedByCurrentUser,
    }
}

export default useCollectionInfo
