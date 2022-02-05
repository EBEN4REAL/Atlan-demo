export const activityTypeMap = [
    {
        value: 'all',
        label: 'All',
    },
    {
        value: 'description',
        label: 'Description',
        action: 'ENTITY_UPDATE',
        exists: [
            'detail.attributes.userDescription.keyword',
            'detail.attributes.description.keyword',
        ],
    },
    {
        value: 'terms-updated',
        label: 'Terms',
        action: 'ENTITY_UPDATE',
        excludes: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
        exists: ['detail.relationshipAttributes.meanings'],
    },

    {
        isGroup: true,
        value: 'classification-group',
        label: 'Classification',
        includes: [],
        excludes: [],
        children: [
            {
                value: 'classification-added',
                label: 'Classification Added',
                action: 'CLASSIFICATION_ADD',
                exists: [],
            },
            {
                value: 'classification-removed',
                label: 'Classification Removed',
                action: 'CLASSIFICATION_DELETE',
                exists: [],
            },
            {
                value: 'classification-added-propagation',
                label: 'Classification Added(Propagation)',
                action: 'PROPAGATED_CLASSIFICATION_ADD',
                exists: [],
            },
            {
                value: 'classification-removed-propagation',
                label: 'Classification Removed(Propagation)',
                action: 'PROPAGATED_CLASSIFICATION_DELETE',
                exists: [],
            },
        ],
    },
    {
        isGroup: true,
        value: 'column-group',
        label: 'Columns',
        includes: ['Table', 'View'],
        excludes: [],
        children: [
            {
                value: 'column-added',
                label: 'Column Added',
                action: 'ENTITY_CREATE',
                typeName: 'Column',
                exists: [],
            },
            {
                value: 'column-deleted',
                label: 'Column Deleted',
                action: 'ENTITY_DELETE',
                typeName: 'Column',
                exists: [],
            },
            {
                value: 'column-updated',
                label: 'Column Updated',
                action: 'ENTITY_UPDATE',
                typeName: 'Column',
                exists: [],
            },
        ],
    },

    {
        value: 'certificate',
        label: 'Certificate',
        action: 'ENTITY_UPDATE',
        exists: [
            'detail.attributes.certificateStatusMessage.keyword',
            'detail.attributes.certificateStatus.keyword',
        ],
    },
    {
        value: 'owners',
        label: 'Owners',
        action: 'ENTITY_UPDATE',
        exists: [
            'detail.attributes.ownerUsers.keyword',
            'detail.attributes.ownerGroups.keyword',
        ],
    },
]
