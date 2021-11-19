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
                    {
                        value: 'entity-read',
                        label: 'read',
                    },
                    {
                        value: 'entity-create',
                        label: 'create',
                    },
                    {
                        value: 'entity-update',
                        label: 'update',
                    },
                    {
                        value: 'entity-delete',
                        label: 'delete',
                    },
                ],
                type: 'Asset management',
            },
            {
                scopes: [
                    {
                        value: 'entity-add-classification',
                        label: 'add',
                    },
                    {
                        value: 'entity-update-classification',
                        label: 'update',
                    },
                    {
                        value: 'entity-remove-classification',
                        label: 'remove',
                    },
                ],
                type: 'Classifications',
            },
            // {
            //     scopes: ['entity-add-label', 'entity-remove-label'],
            //     type: 'Labels',
            // },
            {
                scopes: [
                    {
                        value: 'entity-update-business-metadata',
                        label: 'update',
                    },
                ],
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
