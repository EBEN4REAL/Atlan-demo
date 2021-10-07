import { AssetTypeList } from '~/constant/assetType';

const inApplicableTypeName = ['Connection']
const otherTypes = [{ title: 'Glossary Term', value: 'AtlasGlossaryTerm', key: 'AtlasGlossaryTerm' }]


export const customEntityTypes = [
  ...otherTypes,
  ...AssetTypeList.map(t => ({ title: t.label, value: t.id, key: t.id })).filter(type => !inApplicableTypeName.includes(type.key))
]

export const applicableEntityTypes = ['Catalog']

/**
 * @desc default template for new BM attribute
 */
export const DEFAULT_ATTRIBUTE = {
  cardinality: "SINGLE",
  includeInNotification: false,
  isIndexable: true,
  isOptional: true,
  isUnique: false,
  name: "",
  options: {
    /* applicableEntityTypes's value needs to be send stringified when adding/updating in Atlas */
    applicableEntityTypes: JSON.stringify(applicableEntityTypes),
    customEntityTypes: [],
    maxStrLength: "50",
    displayName: "",
    isBadge: false,
    isFacet: true,
    isEnum: false,
    image: null,
    enumType: "",

  },
  typeName: "string",
  valuesMaxCount: 1,
  valuesMinCount: 0,
  isNew: true
};

export const DEFAULT_BM = {
  name: "",
  options: { displayName: "New Business Metadata" },
  description: "",
  guid: "new",
  attributeDefs: [],
};

/**
 * @desc rules for BM attribute card form fields,
 */
export const ATTRIBUTE_INPUT_VALIDATION_RULES = {
  options: {
    displayName: [
      {
        required: true,
        message: "Please provide attribute name",
        trigger: "change"
      }
    ],
    enumType: [
      {
        required: true,
        message: "Please select Enum type",
        trigger: "change"
      }
    ],
    maxStrLength: [
      {
        required: true,
        type: 'integer',
        message: "Please add attribute max length",
        trigger: "change"
      },
      {
        min: 1,
        message: "Max String Length must be greater than 0",
        trigger: "change"
      }
    ],
    applicableEntityTypes: [
      {
        required: true,
        type: 'array',
        message: "Please add applicable asset types for this attribute.",
        trigger: "change"
      }
    ],
  },
  typeName: [
    {
      required: true,
      message: "Please select attribute type",
      trigger: "change"
    }
  ],
};

/**
 * @desc all supported BM attribute types defined
 */
export const ATTRIBUTE_TYPES = [
  {
    label: "String",
    id: "string",
    extraAttributeOptions: {
      maxStrLength: "50"
    }
  },
  {
    label: "Integer",
    id: "int",
  },
  {
    label: "Float",
    id: "float",
  },
  {
    label: "Double",
    id: "double",
  },
  {
    label: "Long",
    id: "long",
  },
  {
    label: "Short",
    id: "short",
  },
  {
    label: "Date",
    id: "date",
  },
  {
    label: "Boolean",
    id: "boolean",
  },
  {
    label: "Enum",
    id: "enum",
  }
];

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
};

