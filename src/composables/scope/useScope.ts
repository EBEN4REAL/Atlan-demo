import { computed } from 'vue'
import scopeAPI from '../apis/scopes'

export default function useScope() {
    // const { data, error, isLoading } = scopeAPI.getScopes()
    // const scopeList = computed(() => data.value?.scopes)

    // return { scopeList, error, isLoading }

    // FIXME: Remove these hardcoded mappings and
    //  use then API service when they are ready
    const scopeList = [
        {
            scopes: [
                'entity-create',
                'entity-update',
                'entity-delete',
                'entity-read',
            ],
            type: 'Asset management',
        },
        {
            scopes: [
                'entity-add-classification',
                'entity-remove-classification',
                'entity-update-classification',
            ],
            type: 'Classifications',
        },
        {
            scopes: [
                'entity-add-label',
                'entity-remove-label',
                'entity-update-label',
            ],
            type: 'Labels',
        },
        {
            scopes: ['entity-update-business-metadata'],
            type: 'Custom Metadata',
        },
    ]

    return { scopeList }
}
