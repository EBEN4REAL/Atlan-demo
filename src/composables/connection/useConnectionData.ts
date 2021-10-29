import { useConnectionStore } from '~/store/connection'

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

    const getConnection = (qfName) => {
        console.log(qfName)

        const found = connectionStore.list.find((i) => {
            if (i.attributes?.qualifiedName === qfName) {
                return true
            }

            return false
        })
        console.log(found)
        return found
    }

    return {
        getConnection,
        list: connectionStore.list,
        sourceList: connectionStore.getSourceList,
    }
}
