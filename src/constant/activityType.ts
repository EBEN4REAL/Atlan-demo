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
        value: 'announcement',
        label: 'Announcement',
        action: 'ENTITY_UPDATE',
        exists: [
            'detail.attributes.announcementMessage',
            'detail.attributes.announcementTitle',
        ],
    },

    {
        value: 'terms-updated',
        label: 'Terms',
        action: 'ENTITY_UPDATE',
        excludes: [
            'AtlasGlossaryTerm',
            'AtlasGlossaryCategory',
            'AtlasGlossary',
        ],
        exists: ['detail.relationshipAttributes.meanings'],
    },
    {
        value: 'categories-updated',
        label: 'Categories',
        action: 'ENTITY_UPDATE',
        includes: [
            'AtlasGlossaryTerm',
            'AtlasGlossaryCategory',
            'AtlasGlossary',
        ],
        exists: [
            'detail.relationshipAttributes.parentCategory',
            'detail.relationshipAttributes.categories',
        ],
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
                excludes: [
                    'AtlasGlossaryCategory',
                    'AtlasGlossaryTerm',
                    'AtlasGlossary',
                ],
            },
            {
                value: 'classification-removed-propagation',
                label: 'Classification Removed(Propagation)',
                action: 'PROPAGATED_CLASSIFICATION_DELETE',
                exists: [],
                excludes: [
                    'AtlasGlossaryCategory',
                    'AtlasGlossaryTerm',
                    'AtlasGlossary',
                ],
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
        isGroup: true,
        value: 'term-group',
        label: 'Terms',
        includes: [
            'AtlasGlossary',
        ],
        excludes: [],
        children: [
            {
                value: 'term-created',
                label: 'Term Created',
                action: 'ENTITY_CREATE',
                typeName: 'AtlasGlossaryTerm',
                exists: [],
            },
            {
                value: 'term-deleted',
                label: 'Term Deleted',
                action: 'ENTITY_DELETE',
                typeName: 'AtlasGlossaryTerm',
                exists: [],
            },
            {
                value: 'term-updated',
                label: 'Term Updated',
                action: 'ENTITY_UPDATE',
                typeName: 'AtlasGlossaryTerm',
                exists: [],
            },
        ],
    },
  {
        isGroup: true,
        value: 'category-group',
        label: 'Category',
        includes: [
            'AtlasGlossary',
        ],
        excludes: [],
        children: [
            {
                value: 'category-created',
                label: 'Category Created',
                action: 'ENTITY_CREATE',
                typeName: 'AtlasGlossaryCategory',
                exists: [],
            },
            {
                value: 'category-deleted',
                label: 'Category Deleted',
                action: 'ENTITY_DELETE',
                typeName: 'AtlasGlossaryCategory',
                exists: [],
            },
            {
                value: 'category-updated',
                label: 'Category Updated',
                action: 'ENTITY_UPDATE',
                typeName: 'AtlasGlossaryCategory',
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
    }
]
