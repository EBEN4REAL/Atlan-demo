import { AssetTypeList } from '~/constant/assetType'
import assetCategories from '~/constant/assetCategories'
import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'

const inApplicableTypeName = ['Connection']
const otherTypes = [
    {
        title: 'Glossary Term',
        value: 'AtlasGlossaryTerm',
        key: 'AtlasGlossaryTerm',
    },
]

export const applicableEntityTypesOptions = [
    ...assetCategories.map((t) => ({
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
        customApplicableEntityTypes: applicableEntityTypesOptions.reduce((acc, item) => [...acc, ...(item?.children?.map(v => v.value) ?? [])], []),
        maxStrLength: '100000000',
        isBadge: false,
        isFacet: true,
        isEnum: false,
        enumType: '',
        // new options
        multiValueSelect: false,
        allowFiltering: true,
        allowSearch: true,
        primitiveType: 'string'
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
            trigger: 'change',
        },
    ],
    options: {
        enumType: [
            {
                required: true,
                message: 'Please select Enum type',
                trigger: 'change',
            },
        ],
        maxStrLength: [
            {
                required: true,
                type: 'integer',
                message: 'Please add attribute max length',
                trigger: 'change',
            },
            {
                min: 1,
                message: 'Max String Length must be greater than 0',
                trigger: 'change',
            },
        ],
        // customApplicableEntityTypes: [
        //   {
        //     required: true,
        //     type: 'array',
        //     message: "Please add applicable asset types for this attribute.",
        //     trigger: "change"
        //   }
        // ],
    },
    typeName: [
        {
            required: true,
            message: 'Please select attribute type',
            trigger: 'change',
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
        label: 'Boolean',
        id: 'boolean',
        icon: 'Boolean',
    },
    {
        label: 'Date and Time',
        id: 'date',
        icon: 'DateTime',
    },
    {
        label: 'Decimal',
        id: 'float',
        icon: 'Number',
    },
    {
        label: 'Enum',
        id: 'enum',
        icon: 'Enum',
    },
    {
        label: 'Groups',
        id: 'groups',
        icon: 'Group',
    },
    {
        label: 'Integer',
        id: 'int',
        icon: 'Number',
    },
    {
        label: 'Url',
        id: 'url',
        icon: 'Link',
    },
    {
        label: 'Users',
        id: 'users',
        icon: 'User',
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
