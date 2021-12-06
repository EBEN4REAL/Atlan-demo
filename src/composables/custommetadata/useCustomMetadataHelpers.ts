import useTypedefData from '../typedefs/useTypedefData'
import { formatDate } from '../../utils/date'

const numberTypes = ['int', 'double', 'byte', 'short', 'long']

export default function useCustomMetadataHelpers() {
    const { enumList } = useTypedefData()

    const getDatatypeOfAttribute = (a) => {
        if (a?.typeName && typeof a.typeName !== 'undefined') {
            if (numberTypes.includes(a?.typeName)) return 'number'
            if (a?.options?.isEnum?.includes('true')) return 'enum'

            if (a?.typeName?.includes('string')) {
                if (a?.options?.customType?.includes('users')) return 'users'
                if (a?.options?.customType?.includes('groups')) return 'groups'
                if (a?.options?.customType?.includes('url')) return `url`

                return 'text'
            }
        }
        return a?.typeName || ''
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
            let value
            if (v?.value) {
                value = JSON.parse(JSON.stringify(v.value))
            } else {
                value = JSON.parse(JSON.stringify(v))
            }
            if (type === 'boolean') {
                return JSON.parse(value.toString().toLowerCase()) ? 'Yes' : 'No'
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
        JSON.parse(JSON.stringify(BM?.attributes.filter(
            (a) =>
                a.options.customApplicableEntityTypes &&
                JSON.parse(a.options.customApplicableEntityTypes).includes(
                    typeName
                )
        )))

    const getEnumOptions = (enumName: string) => {
        if (enumList.value.length) {
            return (
                enumList.value
                    .find((e) => e.name === enumName)
                    ?.elementDefs.map((a) => ({
                        label: a.value,
                        value: a.value,
                    })) || []
            )
        }
        return []
    }

    return {
        getDatatypeOfAttribute,
        isLink,
        formatDisplayValue,
        getApplicableAttributes,
        getEnumOptions,
    }
}
