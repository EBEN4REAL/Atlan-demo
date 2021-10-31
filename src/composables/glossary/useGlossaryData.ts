import { useGlossaryStore } from '~/store/glossary'

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

export default function useGlossaryData() {
    const glossaryStore = useGlossaryStore()

    const getGlossary = (qfName) => {
        const found = glossaryStore.list.find((i) => {
            if (i.attributes?.qualifiedName === qfName) {
                return true
            }
            return false
        })
        return found
    }

    return {
        list: glossaryStore.list,
        getGlossary,
    }
}
