import { ref } from 'vue'

import useIndexSearch from '~/composables/discovery/useIndexSearch'

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

export default function useGlossary() {
    return useIndexSearch(
        {
            dsl: {
                size: MAX_GLOSSARY,
                query: {
                    bool: {
                        filter: [
                            {
                                terms: {
                                    '__typeName.keyword': [GLOSSARY_ASSET_TYPE],
                                },
                            },
                        ],
                    },
                },
            },
            attributes: [...GLOSSARY_ATTRIBUTES],
        },
        ref('DEFAULT_GLOSSARY'),
        null,
        true
    )
}
