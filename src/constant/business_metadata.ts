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
    maxStrLength: "50"
  },
  searchWeight: 3,
  typeName: "string",
  valuesMaxCount: 1,
  valuesMinCount: 0,
  multiValueSelect: false,
  isNew: true
};

export const ATTRIBUTE_INPUT_VALIDATION_RULES = {
  name: [
    {
      required: true,
      message: "Please provide attribute name",
      trigger: "change"
    }
  ],
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
      message: "Please select search weight",
      trigger: "change"
    }
  ],
  "options.maxStrLength": [
    {
      required: true,
      message: "Please input attribute max length",
      trigger: "change"
    }
  ]
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
