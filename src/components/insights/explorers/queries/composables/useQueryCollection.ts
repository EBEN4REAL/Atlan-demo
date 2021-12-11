// FIXME: CHANGE BASIC -> INDEX
import { Ref, ref } from 'vue'

// import { QueryFolderNamespace } from '~/types/insights/savedQuery.interface'
// import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'

import { useAPI } from '~/services/api/useAPI'
// import { map } from '~/services/meta/insights/key'
import { map } from '~/services/meta/search/key'
import {
    InternalAttributes,
} from '~/constant/projection'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

const useQueryCollection = () => {

    const { modifyActiveInlineTab } = useInlineTab()

    const attributes = [
        'name',
        'displayName',
        'typeName',
        'dataType',
        'description',
        'userDescription',
        'certificateStatus',
        'ownerUsers',
        'ownerGroups',
        'viewerUsers',
        'viewerGroups',
        'classifications',
        ...InternalAttributes,
    ]
    const body = ref()

    const refreshBody = () => {
        body.value = {
            dsl: {
                size: 100,
                query: {
                    bool: {
                        filter: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            "__typeName.keyword": "QueryCollection"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            attributes
        }
    }

    refreshBody()
    const getQueryCollections = () => {
        refreshBody()
        return useAPI(map.INDEX_SEARCH,
            'POST',
            {
                body,
            },
            {}
        )
    }

    const setCollectionsDataInInlineTab = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        qualifiedName: string,
        guid: string
    ) => {
        console.log("setCollectionsDataInInlineTab", qualifiedName, guid)
        // eslint-disable-next-line prefer-object-spread
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        activeInlineTabCopy.explorer.queries.collection = {
            qualifiedName,
            guid,
        }
        modifyActiveInlineTab(
            activeInlineTabCopy,
            tabs,
            activeInlineTabCopy.isSaved
        )

    }

    return {
        getQueryCollections,
        setCollectionsDataInInlineTab
    }
}

export default useQueryCollection
