import { computed } from 'vue'
// import scopeAPI from '../apis/scopes'

const purposeScopeList = [
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
        type: 'Asset',
        label: 'Asset',
    },
    {
        scopes: [
            {
                value: 'entity-update-business-metadata',
                label: 'update: Custom Metadata',
            },
            {
                value: 'entity-add-classification',
                label: 'add: Classifications',
            },
            {
                value: 'entity-remove-classification',
                label: 'remove: Classifications',
            },
            {
                value: 'entity-update-classification',
                label: 'update: Classifications',
            },

            // {
            //     value: 'add-terms',
            //     label: 'Add: Terms',
            // },
            // {
            //     value: 'remove-terms',
            //     label: 'Remove: Terms',
            // },
        ],
        type: 'Governance',
        label: 'Governance',
    },
    // {
    //     scopes: ['entity-add-label', 'entity-remove-label'],
    //     type: 'Labels',
    // },
    // {
    //     scopes: [
    //         {
    //             value: 'entity-update-business-metadata',
    //             label: 'update',
    //         },
    //     ],
    //     type: 'Custom Metadata',
    //     label: 'Metadata',
    // },
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
const personaScopeList = [
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
                value: 'link-assets',
                label: 'update: Linked assets',
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
        type: 'Asset',
        label: 'Asset',
    },
    {
        scopes: [
            {
                value: 'entity-update-business-metadata',
                label: 'update: Custom Metadata',
            },
            {
                value: 'entity-add-classification',
                label: 'add: Classifications',
            },
            {
                value: 'entity-remove-classification',
                label: 'remove: Classifications',
            },
            {
                value: 'entity-update-classification',
                label: 'update: Classifications',
            },

            {
                value: 'add-terms',
                label: 'Add: Terms',
            },
            {
                value: 'remove-terms',
                label: 'Remove: Terms',
            },
        ],
        type: 'Governance',
        label: 'Governance',
    },
]

export default function scopeService() {
    // purposes | persona
    function listScopes(type: string) {
        // const { data, error, isLoading } = scopeAPI.getScopes()
        // const scopeList = computed(() => data.value?.scopes)

        // return { scopeList, error, isLoading }

        // FIXME: Remove these hardcoded mappings and
        //  use then API service when they are ready
        if (type === 'persona')
            return {
                scopeList: personaScopeList,
            }
        else if (type === 'purpose')
            return {
                scopeList: purposeScopeList,
            }
    }
    function findActions(actions: string[], type: string) {
        let scopeList = type === 'persona' ? personaScopeList : purposeScopeList
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
