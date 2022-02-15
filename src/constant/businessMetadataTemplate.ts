import { assetTypeList } from '~/constant/assetType'
import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'


const customMetadataAssetCategories: {
    id: string
    label: string,
    children: {
        id: string
        label: string,
    }[]
}[] = [
        {
            id: 'SQL',
            label: 'SQL',
            children: [
                ...assetTypeList.filter(t => t.categoryType === 'SQL').map(c => ({
                    id: c.id, label: c.fullLabel ?? c.label
                }))
            ],
        },
        {
            id: 'BI',
            label: 'BI',
            children: [
                ...assetTypeList.filter(t => t.categoryType === 'BI').map(c => ({
                    id: c.id, label: c.fullLabel ?? c.label
                }))
            ],
        },
        {
            id: 'SaaS',
            label: 'SaaS',
            children: [
                ...assetTypeList.filter(t => t.categoryType === 'SaaS').map(c => ({
                    id: c.id, label: c.fullLabel ?? c.label
                }))
            ],
        },
        {
            id: 'Insights',
            label: 'Insights',
            children: [
                ...assetTypeList.filter(t => t.categoryType === 'Insights').map(c => ({
                    id: c.id, label: c.fullLabel ?? c.label
                }))
            ],
        },
        {
            id: 'Lineage',
            label: 'Lineage',
            children: [
                ...assetTypeList.filter(t => t.categoryType === 'Lineage').map(c => ({
                    id: c.id, label: c.fullLabel ?? c.label
                }))
            ],
        },
        {
            id: 'BusinessTerms',
            label: 'Business Terms',
            children: [
                ...assetTypeList.filter(t => t.categoryType === 'BusinessTerms').map(c => ({
                    id: c.id, label: c.fullLabel ?? c.label
                }))
            ],
        }
    ]



export const applicableEntityTypesOptions: any = [
    ...customMetadataAssetCategories.map((t) => ({
        title: t.label,
        value: t.id,
        key: t.id,
        children: t.children?.map((a) => ({
            title: a.label,
            value: a.id,
            key: a.id,
        })),
    })),
]

/**
 * @desc default template for new BM attribute
 */
export const DEFAULT_ATTRIBUTE: CMA = {
    cardinality: 'SINGLE',
    includeInNotification: false,
    isIndexable: true,
    isOptional: true,
    isUnique: false,
    name: '',
    displayName: '',
    options: {
        /* applicableEntityTypes's value needs to be send stringified when adding/updating in Atlas hold this here: [JSON.stringify(applicableEntityTypes)] */
        applicableEntityTypes: JSON.stringify(['Asset']),
        customApplicableEntityTypes: applicableEntityTypesOptions.reduce(
            (acc, item) => [
                ...acc,
                ...(item?.children?.map((v) => v.value) ?? []),
            ],
            []
        ),
        maxStrLength: '100000000',
        isEnum: false,
        enumType: '',
        // new options
        multiValueSelect: false,
        allowFiltering: true,
        allowSearch: false,
        primitiveType: 'string',
        // customType:'url' // added on submit for user, link or group
    },
    typeName: 'string',
    valuesMaxCount: 1,
    valuesMinCount: 0,
    isNew: true,
}

export const DEFAULT_BM = {
    name: '',
    options: {
        displayName: 'New Business Metadata',
        imageDetails: null,
        logoType: <'image' | 'emoji'>'',
        imagePath: '',
        emoji: '',
    },
    description: '',
    guid: 'new',
    attributeDefs: [],
}

/**
 * @desc rules for BM attribute card form fields,
 */
export const ATTRIBUTE_INPUT_VALIDATION_RULES = {
    displayName: [
        {
            required: true,
            message: 'Please provide attribute name',
            trigger: 'submit',
        },
    ],
    options: {
        enumType: [
            {
                required: true,
                message: 'Please select Enum type',
                trigger: 'submit',
            },
        ],
        maxStrLength: [
            {
                required: true,
                type: 'integer',
                message: 'Please add attribute max length',
                trigger: 'submit',
            },
            {
                min: 1,
                message: 'Max String Length must be greater than 0',
                trigger: 'submit',
            },
        ],
        // customApplicableEntityTypes: [
        //   {
        //     required: true,
        //     type: 'array',
        //     message: "Please add applicable asset types for this attribute.",
        //     trigger: "submit"
        //   }
        // ],
    },
    typeName: [
        {
            required: true,
            message: 'Please select attribute type',
            trigger: 'submit',
        },
    ],
}

/**
 * @desc all supported BM attribute types defined , might need to map out new array without icon
 */
export const ATTRIBUTE_TYPES = [
    {
        label: 'String',
        id: 'string',
        extraAttributeOptions: {
            maxStrLength: '50',
        },
        icon: 'String',
    },
    {
        label: 'Integer',
        id: 'int',
        icon: 'Number',
    },
    {
        label: 'Decimal',
        id: 'float',
        icon: 'Number',
    },
    {
        label: 'Boolean',
        id: 'boolean',
        icon: 'Boolean',
    },
    {
        label: 'Date',
        id: 'date',
        icon: 'DateTime',
    },
    {
        label: 'Enum',
        id: 'enum',
        icon: 'Enum',
    },
    {
        label: 'Users',
        id: 'users',
        icon: 'User',
    },
    {
        label: 'Groups',
        id: 'groups',
        icon: 'Group',
    },
    {
        label: 'URL',
        id: 'url',
        icon: 'Link',
    },
    {
        label: 'SQL',
        id: 'SQL',
        icon: 'Query',
    },

]

/**
 * @desc BM attribute based operatorsMap
 */
export const operatorsMap = {
    text: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Contains', value: 'contains' },
        { label: 'Begins with', value: 'startsWith' },
        { label: 'Ends with', value: 'endsWith' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is Not Null', value: 'notNull' },
    ],
    date: [
        { label: 'Greater than', value: 'gt' },
        { label: 'Less than', value: 'lt' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is Not Null', value: 'notNull' },
    ],
    boolean: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is not Null', value: 'notNull' },
    ],
    number: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Greater than', value: 'gt' },
        { label: 'Less than', value: 'lt' },
        { label: 'Greater than or equal to', value: 'gte' },
        { label: 'Less than or equal to', value: 'lte' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is not Null', value: 'notNull' },
    ],
    enum: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is not Null', value: 'notNull' },
    ],
}
