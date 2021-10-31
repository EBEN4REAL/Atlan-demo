import { ref, watch } from 'vue'

import useIndexSearch from '~/composables/discovery/useIndexSearch'
import { useGlossaryStore } from '~/store/glossary'

export const MAX_GLOSSARY = 100
export const GLOSSARY_ASSET_TYPE = 'AtlasGlossary'
export const GLOSSARY_ATTRIBUTES = [
    'connector',
    'allowQuery',
    'allowQueryPreview',
    'queryPreviewConfig',
    'queryConfig',
    'defaultCredentialGuid',
    'displayName',
    'certificateStatus',
    'certificateStatusMessage',
    'certificateUpdatedBy',
    'certificateUpdatedAt',
    'ownerUsers',
    'ownerGroups',
    'name',
    'displayName',
    'description',
    'userDescription',
]

const GROUP_TERM_AGGREATION = 'group_by_terms'
const GROUP_CATEGORY_AGGREATION = 'group_by_category'

export default function useGlossary() {
    const { data, aggregationMap } = useIndexSearch(
        {
            dsl: {
                size: MAX_GLOSSARY,
                post_filter: {
                    bool: {
                        filter: {
                            terms: {
                                '__typeName.keyword': [GLOSSARY_ASSET_TYPE],
                            },
                        },
                    },
                },
                aggs: {
                    [GROUP_TERM_AGGREATION]: {
                        filter: {
                            terms: {
                                '__typeName.keyword': ['AtlasGlossaryTerm'],
                            },
                        },
                        aggs: {
                            nested_group: {
                                terms: {
                                    field: '__glossary',
                                    size: 50,
                                },
                            },
                        },
                    },
                    [GROUP_CATEGORY_AGGREATION]: {
                        filter: {
                            terms: {
                                '__typeName.keyword': ['AtlasGlossaryCategory'],
                            },
                        },
                        aggs: {
                            nested_group: {
                                terms: {
                                    field: '__glossary',
                                    size: 50,
                                },
                            },
                        },
                    },
                },
            },
            attributes: [...GLOSSARY_ATTRIBUTES],
        },
        ref('DEFAULT_GLOSSARY'),
        false
    )
    const glossaryStore = useGlossaryStore()
    watch(data, () => {
        glossaryStore.setList(data?.value.entities || [])
        glossaryStore.setTermsCount(
            aggregationMap(GROUP_TERM_AGGREATION, true) || []
        )
        glossaryStore.setCategoryCount(
            aggregationMap(GROUP_CATEGORY_AGGREATION, true) || []
        )
    })
}
