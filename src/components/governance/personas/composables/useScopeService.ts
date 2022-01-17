import { computed } from 'vue'
// import scopeAPI from '../apis/scopes'

const purposeScopeList = [
    {
        scopes: [
            {
                value: 'entity-read',
                label: 'read',
                desc: 'Read access to private attributes',
            },
            {
                value: 'entity-update',
                label: 'update',
                desc: 'Access to update asset metadata',
            },
            {
                value: 'entity-create',
                label: 'create',
                desc: 'Create entities within selected assets',
            },
            {
                value: 'entity-delete',
                label: 'delete',
                desc: 'Permission to delete selected assets',
            },
        ],
        type: 'Assets',
        label: 'Assets',
    },
    {
        scopes: [
            {
                value: 'entity-update-business-metadata',
                label: 'update: Custom Metadata',
                desc: 'Update classifications for selected assets',
            },
            // {
            //     value: 'entity-add-classification',
            //     label: 'add: Classifications',
            //     desc: 'Add classifications for selected assets'
            // },
            // {
            //     value: 'entity-remove-classification',
            //     label: 'remove: Classifications',
            //     desc: 'Remove classifications for selected assets'
            // },
            {
                value: 'entity-update-classification',
                label: 'update: Classifications',
                desc: 'Update values for BM attributes for selected assets',
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
                value: 'entity-create',
                label: 'create',
                desc: 'Create entities',
            },
            {
                value: 'entity-read',
                label: 'read',
                desc: 'Read access to private attributes',
            },
            {
                value: 'entity-update',
                label: 'update',
                desc: 'Update asset metadata',
            },

            {
                value: 'entity-delete',
                label: 'delete',
                desc: 'Delete/Archive assets',
            },
            {
                value: 'link-assets',
                label: 'Link other assets',
                desc: 'Link other assets like readme, resources.',
            },
        ],
        type: 'Assets',
        label: 'Assets',
    },
    {
        scopes: [
            {
                value: 'entity-update-business-metadata',
                label: 'Update Custom Metadata',
                desc: 'Update values for BM attributes',
            },
            // {
            //     value: 'entity-add-classification',
            //     label: 'add: Classifications',
            // },
            // {
            //     value: 'entity-remove-classification',
            //     label: 'remove: Classifications',
            // },
            {
                value: 'entity-update-classification',
                label: 'Update Classifications',
                desc: 'Update classifications',
            },

            {
                value: 'add-terms',
                label: 'Add Terms',
                desc: 'Link terms',
            },
            {
                value: 'remove-terms',
                label: 'Remove Terms',
                desc: 'Unlink terms',
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
        if (type === 'purpose')
            return {
                scopeList: purposeScopeList,
            }
    }
    function findActions(actions: string[], type: string) {
        const scopeList =
            type === 'persona' ? personaScopeList : purposeScopeList
        const res = [
            { label: 'Asset', action: [] },
            { label: 'Governance', action: [] },
            // { label: 'Metadata', action: [] },
        ]
        actions.forEach((action) => {
            scopeList.forEach((scope) => {
                scope.scopes.forEach((s) => {
                    if (s.value === action) {
                        if (scope.label === 'Assets') {
                            res[0].action.push(s.label)
                        } else if (scope.label === 'Governance') {
                            res[1].action.push(s.label)
                        }
                        // else if (scope.label === 'Metadata') {
                        //     res[2].action.push(s.label)
                        // }
                    }
                })
            })
        })
        return res
    }

    return { listScopes, findActions }
}
