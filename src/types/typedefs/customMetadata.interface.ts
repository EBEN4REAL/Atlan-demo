export interface CUSTOM_METADATA_ATTRIBUTE {
    cardinality: string,
    includeInNotification: boolean,
    isIndexable: boolean,
    isOptional: boolean,
    isUnique: boolean,
    name: string,
    displayName: string,
    options: {
        applicableEntityTypes: string,
        customApplicableEntityTypes: string | string[],
        maxStrLength: string,
        isBadge: string | boolean,
        isFacet: string | boolean,
        isEnum: string | boolean,
        enumType: string,
        multiValueSelect: string | boolean,
        allowFiltering: string | boolean,
        allowSearch: string | boolean,
        primitiveType: string,
        customType?: string
    },
    typeName: string,
    valuesMaxCount: number,
    valuesMinCount: number,
    isNew: boolean,
}