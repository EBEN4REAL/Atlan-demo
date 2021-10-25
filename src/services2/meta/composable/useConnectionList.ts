import { ref } from 'vue'

import useIndexSearch from './useIndexSearch'

export const MAX_CONNECTIONS = 100
export const CONNECTION_ASSET_TYPE = 'Connection'
export const CONNECTION_ATTRIBUTES = [
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

export default function useConnectionList() {
    return useIndexSearch(
        {
            dsl: {
                size: MAX_CONNECTIONS,
                query: {
                    bool: {
                        filter: [
                            {
                                terms: {
                                    '__typeName.keyword': [
                                        CONNECTION_ASSET_TYPE,
                                    ],
                                },
                            },
                        ],
                    },
                },
            },
            attributes: [...CONNECTION_ATTRIBUTES],
        },
        ref('DEFAULT_CONNECTIONS'),
        null,
        true
    )
}
