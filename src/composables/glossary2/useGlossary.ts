import { ref, watch } from 'vue'

import useIndexSearch from '~/composables/discovery/useIndexSearch'
import useGlossaryStore from '~/store/glossary'

import { AssetRelationAttributes, AssetAttributes } from '~/constant/projection'
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
    'readme',
]
export const GLOSSARY_RELATION_ATTRIBUTES = ['categories']
const GROUP_TERM_AGGREATION = 'group_by_terms'
const GROUP_CATEGORY_AGGREATION = 'group_by_category'

export default function useGlossary(immediate = true) {
    const dependentKey = ref('DEFAULT_GLOSSARY')

    if (!immediate) {
        dependentKey.value = ''
    }

    const { data, aggregationMap, mutate } = useIndexSearch(
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
                        must: [
                            {
                                term: {
                                    __state: 'ACTIVE',
                                },
                            },
                        ],
                    },
                },
                aggs: {
                    [GROUP_TERM_AGGREATION]: {
                        filter: {
                            bool: {
                                filter: [
                                    {
                                        terms: {
                                            '__typeName.keyword': [
                                                'AtlasGlossaryTerm',
                                            ],
                                        },
                                    },
                                ],
                                must: [
                                    {
                                        term: {
                                            __state: 'ACTIVE',
                                        },
                                    },
                                ],
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
                            bool: {
                                filter: [
                                    {
                                        terms: {
                                            '__typeName.keyword': [
                                                'AtlasGlossaryCategory',
                                            ],
                                        },
                                    },
                                ],
                                must: [
                                    {
                                        term: {
                                            __state: 'ACTIVE',
                                        },
                                    },
                                ],
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
                sort: [{ 'name.keyword': { order: 'asc' } }],
            },
            attributes: [...GLOSSARY_ATTRIBUTES, ...AssetAttributes],
            relationAttributes: [
                ...GLOSSARY_RELATION_ATTRIBUTES,
                ...AssetRelationAttributes,
            ],
            suppressLogs: true,
        },
        dependentKey,
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

    return { mutate }
}
