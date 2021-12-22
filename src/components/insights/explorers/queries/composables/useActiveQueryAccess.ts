import { Ref, ref, watch, ComputedRef, toRaw, computed } from 'vue'

import { useAPI } from '~/services/api/useAPI'
import { map } from '~/services/meta/search/key'
import whoami from '~/composables/user/whoami'
// import { message } from 'ant-design-vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

const useActiveQueryAccess = (
    activeInlineTab: ComputedRef<activeInlineTabInterface>
) => {
    const { username: currentUser, groups: userGroups } = whoami()

    const selectedCollectionLoading = ref(false)
    const selectedCollectionData = ref()
    const selectedCollectionError = ref()

    const attributes = [
        'name',
        'displayName',
        'typeName',

        'description',
        'userDescription',
        'certificateStatus',
        'ownerUsers',
        'ownerGroups',
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
    ]

    let body = ref({})

    const refreshBody = () => {
        let queryQualifiedName
        let parentQualifiedName = ''

        if (activeInlineTab?.value?.qualifiedName?.length) {
            queryQualifiedName =
                activeInlineTab?.value?.qualifiedName?.split('/')
            parentQualifiedName = `/${queryQualifiedName[1]}/${queryQualifiedName[2]}/${queryQualifiedName[3]}/${queryQualifiedName[4]}`
        }
        // console.log('queryQualifiedName: ', parentQualifiedName)

        body.value = {
            dsl: {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    qualifiedName: parentQualifiedName,
                                },
                            },
                        ],
                    },
                },
            },
            attributes,
        }

        // console.log('coll body: ', body.value)
    }

    const getSelectedCollectionData = () => {
        return useAPI(
            map.INDEX_SEARCH,
            'POST',
            {
                body,
            },
            {}
        )
    }

    const fetchSelectedCollectionData = () => {
        refreshBody()
        if (activeInlineTab?.value?.qualifiedName?.length) {
            const { data, error, isLoading } = getSelectedCollectionData()
            selectedCollectionLoading.value = true

            watch([data, error, isLoading], () => {
                selectedCollectionLoading.value = true

                if (isLoading.value === false) {
                    selectedCollectionLoading.value = false
                    if (error.value === undefined) {
                        if (data?.value) {
                            selectedCollectionData.value = data?.value
                        } else {
                            selectedCollectionData.value = {}
                        }
                        selectedCollectionError.value = undefined
                        // message.success('collection fetched')
                    } else {
                        selectedCollectionLoading.value = false
                        selectedCollectionError.value = error.value

                        // message.error('Error in fetching collection data')
                    }
                }
            })
        }
    }

    const hasQueryReadPermission = computed(() => {
        // Viewer

        if (
            selectedCollectionData?.value &&
            activeInlineTab?.value?.qualifiedName?.length
        ) {
            let viewerUsers =
                selectedCollectionData?.value?.entities?.length &&
                selectedCollectionData?.value?.entities[0]?.attributes
                    ?.viewerUsers
                    ? selectedCollectionData?.value?.entities[0]?.attributes
                          ?.viewerUsers
                    : []
            let viewerGroups =
                selectedCollectionData?.value?.entities?.length &&
                selectedCollectionData?.value?.entities[0]?.attributes
                    ?.viewerGroups
                    ? selectedCollectionData?.value?.entities[0]?.attributes
                          ?.viewerGroups
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
        } else {
            return true
        }
    })

    const hasQueryWritePermission = computed(() => {
        if (
            selectedCollectionData?.value &&
            activeInlineTab?.value?.qualifiedName?.length
        ) {
            let ownerUsers =
                selectedCollectionData?.value?.entities?.length &&
                selectedCollectionData?.value?.entities[0]?.attributes
                    ?.ownerUsers
                    ? selectedCollectionData?.value?.entities[0]?.attributes
                          ?.ownerUsers
                    : []
            let ownerGroups =
                selectedCollectionData?.value?.entities?.length &&
                selectedCollectionData?.value?.entities[0]?.attributes
                    ?.ownerGroups
                    ? selectedCollectionData.value?.entities[0].attributes
                          ?.ownerGroups
                    : []

            if (ownerUsers?.length) {
                let v1 = ownerUsers.find((el) => el === currentUser.value)
                if (v1) {
                    return true
                }
            }
            if (ownerGroups?.length) {
                let filteredArray = ownerGroups.filter((value) =>
                    userGroups.value.includes(value)
                )
                return filteredArray.length > 0
            }
            return false
        } else {
            return true
        }
    })

    const isQueryCreatedByCurrentUser = computed(() => {
        if (
            selectedCollectionData?.value &&
            activeInlineTab?.value?.qualifiedName?.length
        ) {
            let creator = selectedCollectionData?.value?.entities?.length
                ? selectedCollectionData?.value?.entities[0]?.attributes
                      ?.__createdBy
                : ''
            console.log('creator: ', {
                creator,
                currentUser: currentUser.value,
            })

            if (creator == currentUser.value) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    })

    watch(
        activeInlineTab,
        () => {
            fetchSelectedCollectionData()
        },
        { immediate: true }
    )

    return {
        isQueryCreatedByCurrentUser,
        hasQueryReadPermission,
        hasQueryWritePermission,
    }
}

export default useActiveQueryAccess
