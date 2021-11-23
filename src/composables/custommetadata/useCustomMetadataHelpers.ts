const numberTypes = ['int', 'double', 'float', 'byte', 'short', 'long']

export default function useCustomMetadataHelpers() {
    const getDatatypeOfAttribute = (typeName: string) => {
        if (typeName && typeof typeName !== 'undefined') {
            if (numberTypes.includes(typeName)) return `number`
            if (typeName.includes('string')) return `text`
        }
        return typeName || ''
    }
    const isLink = (v: any, name: string) => {
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
        if (
            name.toLowerCase().includes('link') ||
            v?.toString().match(urlRegex)
        )
            return true
        return false
    }

    return {
        getDatatypeOfAttribute,
        isLink,
    }
}
