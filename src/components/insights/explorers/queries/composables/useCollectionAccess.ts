import { Ref, ref, watch, ComputedRef, toRaw, computed } from 'vue'

import { useAPI } from '~/services/api/useAPI'
import { map } from '~/services/meta/search/key'
import whoami from '~/composables/user/whoami'
// import { message } from 'ant-design-vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

const useCollectionAccess = (
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
        body.value = {
            dsl: {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    qualifiedName:
                                        activeInlineTab?.value?.explorer
                                            ?.queries?.collection
                                            ?.qualifiedName,
                                },
                            },
                        ],
                    },
                },
            },
            attributes,
        }

        console.log('coll body: ', body.value)
    }

    const getSelectedCollectionData = () => {
        // refreshBody()

        console.log('coll body2: ', body.value)
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

    const hasCollectionReadPermission = computed(() => {
        // Viewer

        let viewerUsers = selectedCollectionData?.value?.entities[0].attributes
            ?.viewerUsers
            ? selectedCollectionData?.value?.entities[0].attributes?.viewerUsers
            : []
        let viewerGroups = selectedCollectionData?.value?.entities[0].attributes
            ?.viewerGroups
            ? selectedCollectionData?.value?.entities[0].attributes
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
    })

    const hasCollectionWritePermission = computed(() => {
        let ownerUsers = selectedCollectionData?.value?.entities[0].attributes
            ?.ownerUsers
            ? selectedCollectionData?.value?.entities[0].attributes?.ownerUsers
            : []
        let ownerGroups = selectedCollectionData.value?.entities[0].attributes
            ?.ownerGroups
            ? selectedCollectionData.value?.entities[0].attributes?.ownerGroups
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
    })

    const isCollectionCreatedByCurrentUser = computed(() => {
        if (selectedCollectionData?.value) {
            console.log('curr: ', {
                currentUser: currentUser.value,
                curr: selectedCollectionData?.value?.entities[0].attributes,
            })
            return (
                currentUser.value ===
                selectedCollectionData?.value?.entities[0].attributes
                    ?.__createdBy
            )
        } else {
            return false
        }
    })
    

    watch(
        activeInlineTab,
        async () => {
            console.log('activeInlineTab: ', activeInlineTab.value)

            await fetchSelectedCollectionData()
        },
        { immediate: true }
    )

    return {
        isCollectionCreatedByCurrentUser,
        hasCollectionReadPermission,
        hasCollectionWritePermission,
    }
}

export default useCollectionAccess
