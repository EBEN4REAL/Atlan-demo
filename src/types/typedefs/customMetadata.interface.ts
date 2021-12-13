export interface CUSTOM_METADATA_ATTRIBUTE {
    cardinality: string,
    includeInNotification: boolean,
    isIndexable: boolean,
    isOptional: boolean,
    isUnique: boolean,
    name: string,
    displayName: string,
    enumValues?: string
    options: {
        applicableEntityTypes: string,
        customApplicableEntityTypes: string | string[],
        maxStrLength: string,
        isEnum: string | boolean,
        enumType: string,
        multiValueSelect: string | boolean,
        allowFiltering: string | boolean,
        allowSearch: string | boolean,
        primitiveType: string,
        customType?: string
        description?: string
    },
    typeName: string,
    valuesMaxCount: number,
    valuesMinCount: number,
    isNew: boolean,
}