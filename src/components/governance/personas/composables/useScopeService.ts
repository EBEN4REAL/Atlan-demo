import { computed } from 'vue'
import updateAssetGif from '~/assets/gifts/Permissions_Popover_Gifs/Update_Assets.gif'
import updateBusinessMetaGif from '~/assets/gifts/Permissions_Popover_Gifs/Update_Business_Metadata.gif'
import updateClassificationGif from '~/assets/gifts/Permissions_Popover_Gifs/Update_Classification.gif'
import updateTermsGif from '~/assets/gifts/Permissions_Popover_Gifs/Update_Terms.gif'
import viewAssetGif from '~/assets/gifts/Permissions_Popover_Gifs/View_Assets.gif'
// import scopeAPI from '../apis/scopes'

export const purposeScopeList = [
    {
        scopes: [
            {
                value: 'entity-read',
                label: 'read',
                // desc: 'Read access to private attributes',
                desc: 'Gives permission to view Activity, Lineage, Custom metadata and sensitive info like SQL queries for processes in lineage or view defintions',
                gif: viewAssetGif
            },
            {
                value: 'entity-update',
                label: 'update',
                // desc: 'Access to update asset metadata',
                desc: "Update asset metatada including description, certification, owners, readme & resources",
                gif: updateAssetGif
            },
            {
                value: 'entity-create',
                label: 'create',
                // desc: 'Create entities within selected assets',
                desc: "Gives ability to create new assets within the selected connection or specified database/schema"
            },
            {
                value: 'entity-delete',
                label: 'delete',
                // desc: 'Permission to delete selected assets',
                desc: "Gives ability to delete assets within the selected connection or specified database/schema"
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
                desc: 'Update classifications for selected assets',
                gif: updateBusinessMetaGif
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
            // {
            //     value: 'entity-update-classification',
            //     label: 'Update Classifications',
            //     desc: 'Update values for BM attributes for selected assets',
            // },
               {
                value: 'entity-add-classification',
                label: 'Add Classifications',
                desc: 'Update values for BM attributes for selected assets',
                gif: updateClassificationGif
            },
               {
                value: 'entity-remove-classification',
                label: 'Remove Classifications',
                desc: 'Update values for BM attributes for selected assets',
                gif: updateClassificationGif
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
export const personaScopeList = [
    {
        scopes: [
            {
                value: 'entity-read',
                label: 'Read',
                filterLabel: 'Read asset',
                desc: 'Gives permission to view Activity, Lineage, Custom metadata and sensitive info like SQL queries for processes in lineage or view defintions',
                gif: viewAssetGif
            },
            {
                value: 'entity-update',
                label: 'Update',
                filterLabel: 'Update asset',
                // desc: 'Access to update asset metadata',
                desc: "Update asset metatada including description, certification, owners, readme & resources",
                gif: updateAssetGif
            },
            {
                value: 'entity-create',
                label: 'Create',
                filterLabel: 'Create asset',
                // desc: 'Create entities within selected assets',
                desc: "Gives ability to create new assets within the selected connection or specified database/schema"
            },
            {
                value: 'entity-delete',
                label: 'Delete',
                filterLabel: 'Delete asset',
                // desc: 'Permission to delete selected assets',
                desc: "Gives ability to delete assets within the selected connection or specified database/schema"
            },
            {
                value: 'link-assets',
                label: 'Link other assets',
                desc: 'Permission to link assets like readme, resources to this asset',
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
                // desc: 'Update values for BM attributes',
                desc: "Permission to update custom metadata attributes",
                gif: updateBusinessMetaGif
            },
            // {
            //     value: 'entity-add-classification',
            //     label: 'add: Classifications',
            // },
            // {
            //     value: 'entity-remove-classification',
            //     label: 'remove: Classifications',
            // },
            // {
            //     value: 'entity-update-classification',
            //     label: 'Update Classifications',
            //     // desc: 'Update classifications',
            //     desc: "Permission to add or remove classifications from assets",
            //     gif: updateClassificationGif
            // },
                {
                value: 'entity-add-classification',
                label: 'Add Classifications',
                // desc: 'Update classifications',
                desc: "Permission to add classifications from assets",
                gif: updateClassificationGif
            },
                {
                value: 'entity-remove-classification',
                label: 'Remove Classifications',
                // desc: 'Update classifications',
                desc: "Permission to remove classifications from assets",
                gif: updateClassificationGif
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
