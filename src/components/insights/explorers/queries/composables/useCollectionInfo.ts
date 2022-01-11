import { Ref, ref, watch, ComputedRef, toRaw, computed } from 'vue'

import { useAPI } from '~/services/api/useAPI'
import { map } from '~/services/meta/search/key'

const useCollectionInfo = (
    
) => {

    const selectedCollectionLoading = ref(false)
    const selectedCollectionData = ref({})
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
    ]

    let body = ref({})

    const refreshBody = (asset) => {
        body.value = {
            dsl: {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    qualifiedName:
                                    asset?.value?.attributes?.collectionQualifiedName
                                },
                            },
                        ],
                    },
                },
            },
            attributes,
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

    const fetchCollectionInfo = (asset) => {
        refreshBody(asset)
       
        const { data, error, isLoading } = useAPI(
            map.INDEX_SEARCH,
            'POST',
            {
                body,
            },
            {}
        )

        return {data, error, isLoading}
           
    }

    // const collectionInfo = computed(() => {
    //     // Viewer
    //     if(selectedCollectionData?.value) {
    //         return selectedCollectionData.value
    //     } else {
    //         return {}
    //     }
    // })

    // watch(
    //     ()=>selectedAsset?.value?.attributes?.collectionQualifiedName,
    //     async () => {
    //         await fetchSelectedCollectionData()
    //     },
    //     { deep: true }
    // )
    

    
    return {
        fetchCollectionInfo
        // selectedCollectionLoading
    }
}

export default useCollectionInfo
