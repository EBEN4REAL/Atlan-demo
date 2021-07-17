
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
    applicableEntityTypes: [],
    maxStrLength: "50",
    displayName: "",
    isEnum: false,
    isMultiValued: false,
    enumType: ""
  },
  searchWeight: 3,
  typeName: "string",
  valuesMaxCount: 1,
  valuesMinCount: 0,
  isNew: true
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

  searchWeight: [
    {
      required: true,
      type: 'integer',
      message: "Please select search weight",
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
    multiValueType: "array<boolean>"
  },
  {
    label: "Enum",
    id: "enum",
  }
];
