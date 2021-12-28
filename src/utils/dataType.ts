// as per AtlanIcon źrequirement
export const getDataTypeIcon = (typeName) => {
    switch (typeName) {
        case 'enum':
            return 'EnumType'
        case 'url':
            return 'Geography'
        case 'user':
        case 'users':
            return 'User'
        case 'group':
        case 'groups':
            return 'Group'
        case 'number':
        case 'integer':
        case 'int':
            return 'Number'
        case 'float':
        case 'decimal':
            return 'Float'
        default: return 'String'
    }
}