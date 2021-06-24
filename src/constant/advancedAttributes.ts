

export const AdvancedAttributeList = [
    {
        value: "__guid",
        label: "guid",
        type: "string",
        children: [],
    },
    {
        value: "__modifiedBy",
        label: "last updated by",
        type: "users",
        children: [],
    },
    {
        value: "__modificationTimestamp",
        label: "last updated at",
        type: "date",
        children: [],
    },
    {
        value: "__timestamp",
        label: "created at",
        type: "date",
        children: [],
    },
    {
        value: "__createdBy",
        label: "created by",
        type: "users",
        children: [],
    },
    {
        value: "name",
        label: "name",
        type: "string",
        children: [],
    },
    {
        value: "description",
        label: "description",
        type: "string",
        children: [],
    },
    {
        value: "userDescription",
        label: "user description",
        type: "string",
        children: [],
    },
];


export const OperatorList = [
    {
        value: "=",
        label: "=",
        allowedType: ["string", "enumeration"],
        isInput: true,
    },
    {
        value: "neq",
        label: "!=",
        allowedType: ["string", "enumeration"],
        isInput: true,
    },

    {
        value: "contains",
        label: "contains",
        allowedType: ["string", "users"],
        isInput: true,
    },
    {
        value: "startsWith",
        label: "begins with",
        allowedType: ["string"],
        isInput: true,
    },
    {
        value: "endsWith",
        label: "ends with",
        allowedType: ["string"],
        isInput: true,
    },
    {
        value: "gt",
        label: ">",
        allowedType: ["int", "float", "double", "long", "date"],
        isInput: true,
    },
    {
        value: "lt",
        label: "<",
        allowedType: ["int", "float", "double", "long", "date"],
        isInput: true,
    },
    {
        value: "gte",
        label: ">=",
        allowedType: ["int", "float", "double", "long"],
        isInput: true,
    },
    {
        value: "lte",
        label: "<=",
        allowedType: ["int", "float", "double", "long"],
        isInput: true,
    },
    {
        value: "timerange",
        label: "<>",
        allowedType: ["date"],
        isInput: true,
    },
    {
        value: "isNull",
        label: "is null",
        allowedType: [
            "string",
            "byte",
            "short",
            "int",
            "float",
            "double",
            "long",
            "date",
            "boolean",
            "enumeration",
            "users"
        ],
        isInput: false,
    },
    {
        value: "notNull",
        label: "is not null",
        allowedType: [
            "string",
            "byte",
            "short",
            "int",
            "float",
            "double",
            "long",
            "date",
            "boolean",
            "enumeration",
            "users"
        ],
        isInput: false,
    },
];
