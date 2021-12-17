import { Ref, ref, watch, ComputedRef, toRaw } from 'vue'

import { useAPI } from '~/services/api/useAPI'
import { map } from '~/services/meta/search/key'
import { QueryCollection } from '~/types/insights/savedQuery.interface'
import whoami from '~/composables/user/whoami'
import { message } from 'ant-design-vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

const useCollectionAccess = (
    activeInlineTab: ComputedRef<activeInlineTabInterface>
) => {
    const { username: currentUser, groups: userGroups } = whoami()

    const selectedCollectionLoading = ref(false)
    const selectedCollectionData: Ref<QueryCollection | undefined> = ref()
    const selectedCollectionError: Ref<QueryCollection | undefined> = ref()

    const ownerUsers = ref()
    const ownerGroups = ref()
    const viewerUsers = ref()
    const viewerGroups = ref()

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
            dsl:  {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    qualifiedName: activeInlineTab?.value?.explorer?.queries?.collection?.qualifiedName
                                }
                            }
                        ]
                    }
                }
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
                    if (
                        data?.value?.entities &&
                        data?.value?.entities?.length > 0
                    ) {
                        selectedCollectionData.value = data?.value?.entities[0]
                        
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
    

    const hasCollectionReadPermission = () => {
        // Viewer

       
    let viewerUsers =
    toRaw(selectedCollectionData?.value?.attributes?.viewerUsers)
    let viewerGroups =
    toRaw(selectedCollectionData?.value?.attributes?.viewerGroups)

        // console.log('permission: ',toRaw(viewerUsers))
        if (viewerUsers?.length) {
            if (viewerUsers?.contains(currentUser?.value)) {
                return true
            }
        }
        if (viewerGroups?.length) {
            let filteredArray = viewerGroups?.filter((value) =>
                userGroups.value.includes(value)
            )
            return filteredArray.length > 0
        }
        return false
    }

    const hasCollectionWritePermission = () => {

        let ownerUsers =
        toRaw(selectedCollectionData?.value?.attributes?.ownerUsers)
    let ownerGroups =
    toRaw(selectedCollectionData.value?.attributes?.ownerGroups)

        console.log('permission: ',{
            ownerUsers: ownerUsers,
            ownerGroups: ownerGroups
        })
        if (ownerUsers?.length) {
            if (ownerUsers?.contains(currentUser.value)) {
                return true
            }
        }
        if (ownerGroups?.length) {
            let filteredArray = ownerGroups?.filter((value) =>
                userGroups.value.includes(value)
            )
            return filteredArray.length > 0
        }
        return false
    }

    const isCollectionCreatedByCurrentUser = () => {
        if (selectedCollectionData?.value) {
            return (
                currentUser.value ===
                selectedCollectionData?.value?.attributes?.__createdBy
            )
        } else {
            return false
        }
    }

    watch(activeInlineTab,  async()=> {
        console.log('activeInlineTab: ', activeInlineTab.value)

         await fetchSelectedCollectionData()


        console.log('permissions:', {
            isCollectionCreatedByCurrentUser: isCollectionCreatedByCurrentUser(),
            hasCollectionReadPermission: hasCollectionReadPermission(),
            hasCollectionWritePermission: hasCollectionWritePermission(),
        } )
    }, {immediate: true})

    return {
        isCollectionCreatedByCurrentUser,
        hasCollectionReadPermission,
        hasCollectionWritePermission,
    }
}

export default useCollectionAccess