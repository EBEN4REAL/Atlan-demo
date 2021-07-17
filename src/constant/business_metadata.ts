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
    displayName: "New Attribute"
  },
  searchWeight: 3,
  typeName: "string",
  valuesMaxCount: 1,
  valuesMinCount: 0,
  multiValueSelect: false,
  isNew: true
};

export const ATTRIBUTE_INPUT_VALIDATION_RULES = {
  options: {
    displayName: [
      {
        required: true,
        message: "Please provide attribute name",
        trigger: "change"
      }
    ],
    maxStrLength: [
      {
        required: true,
        type: 'integer',
        message: "Please input attribute max length",
        trigger: "change"
      }
    ],
    applicableEntityTypes: [
      {
        required: true,
        type: 'array',
        message: "Please input applicable asset types for this attribute.",
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
  enumType: [
    {
      required: true,
      message: "Please select Enum type",
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

export const ATTRIBUTE_TYPES = [
  {
    label: "String",
    id: "string",
    multiValueType: "array<string>",
    extraAttributeOptions: {
      maxStrLength: "50"
    }
  },
  {
    label: "Integer",
    id: "int",
    multiValueType: "array<int>"
  },
  {
    label: "Float",
    id: "float",
    multiValueType: "array<float>"
  },
  {
    label: "Double",
    id: "double",
    multiValueType: "array<double>"
  },
  {
    label: "Long",
    id: "long",
    multiValueType: "array<long>"
  },
  {
    label: "Short",
    id: "short",
    multiValueType: "array<short>"
  },
  {
    label: "Date",
    id: "date",
    multiValueType: "array<date>"
  },
  {
    label: "Boolean",
    id: "boolean",
    multiValueType: "array<boolean>"
  },
  {
    label: "Enum",
    id: "enum",
    multiValueType: "array<enum>"
  }
];
