import { computed } from 'vue'
// import scopeAPI from '../apis/scopes'

export default function scopeService() {
    function listScopes() {
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
            // {
            //     scopes: ['entity-add-label', 'entity-remove-label'],
            //     type: 'Labels',
            // },
            {
                scopes: ['entity-update-business-metadata'],
                type: 'Custom Metadata',
            },
            // {
            //     scopes: [
            //         'admin-purge',
            //         'admin-export',
            //         'admin-audits',
            //         'admin-import',
            //     ],
            //     type: 'Admin',
            // },
            // {
            //     scopes: [
            //         'add-relationship',
            //         'remove-relationship',
            //         'update-relationship',
            //     ],
            //     type: 'Relationship',
            // },
            // {
            //     scopes: [
            //         'type-delete',
            //         'type-update',
            //         'type-create',
            //         'type-read',
            //     ],
            //     type: 'Type',
            // },
        ]
        return { scopeList }
    }

    return { listScopes }
}