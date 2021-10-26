import { ref, watch } from 'vue'
import { useConnectionStore } from '~/store/connection'

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

export default function useConnectionData() {
    const connectionStore = useConnectionStore()
    return {
        list: connectionStore.list,
        sourceList: connectionStore.getSourceList,
    }
}
