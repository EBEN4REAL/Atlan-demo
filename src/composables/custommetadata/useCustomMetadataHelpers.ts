import { formatDate } from '../../utils/date'

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
            name?.toLowerCase().includes('link') ||
            v?.toString().match(urlRegex)
        )
            return true
        return false
    }

    const formatDisplayValue = (v: any, type: string) => {
        if (v || v?.toString()) {
            let value = JSON.parse(JSON.stringify(v))
            if (type === 'boolean') {
                return JSON.parse(value.toString().toLowerCase())
                    ? 'True'
                    : 'False'
            }
            if (type === 'date') {
                return formatDate(
                    Number.isInteger(value) ? value : parseInt(value)
                )
            }
            if (Array.isArray(value)) {
                if (!value.length) return `No value added`
                if (
                    typeof type !== 'object' &&
                    type.toLowerCase().includes('date')
                )
                    value = value.map((v) =>
                        formatDate(Number.isInteger(v) ? v : parseInt(v))
                    )
                return value.join(', ')
            }
        }
        return v
    }

    const getApplicableAttributes = (BM, typeName) =>
        BM?.attributes.filter(
            (a) =>
                a.options.customApplicableEntityTypes &&
                JSON.parse(a.options.customApplicableEntityTypes).includes(
                    typeName
                )
        )

    return {
        getDatatypeOfAttribute,
        isLink,
        formatDisplayValue,
        getApplicableAttributes,
    }
}
