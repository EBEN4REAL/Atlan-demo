import { computed } from 'vue'
// import scopeAPI from '../apis/scopes'

const scopeList = [
    {
        scopes: [
            {
                value: 'entity-read',
                label: 'read',
            },
            {
                value: 'entity-update',
                label: 'update',
            },
            {
                value: 'entity-create',
                label: 'create',
            },
            {
                value: 'entity-delete',
                label: 'delete',
            },
        ],
        type: 'Asset management',
        label: 'Asset',
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
        label: 'Classifications',
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
        label: 'Metadata',
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

export default function scopeService() {
    function listScopes() {
        // const { data, error, isLoading } = scopeAPI.getScopes()
        // const scopeList = computed(() => data.value?.scopes)

        // return { scopeList, error, isLoading }

        // FIXME: Remove these hardcoded mappings and
        //  use then API service when they are ready

        return { scopeList }
    }
    function findActions(actions: string[]) {
        let res = [
            { label: 'Asset', action: [] },
            { label: 'Classifications', action: [] },
            { label: 'Metadata', action: [] },
        ]
        actions.forEach((action) => {
            scopeList.forEach((scope) => {
                scope.scopes.forEach((s) => {
                    if (s.value === action) {
                        if (scope.label === 'Asset') {
                            res[0].action.push(s.label)
                        } else if (scope.label === 'Classifications') {
                            res[1].action.push(s.label)
                        } else if (scope.label === 'Metadata') {
                            res[2].action.push(s.label)
                        }
                    }
                })
            })
        })
        return res
    }

    return { listScopes, findActions }
}
