import useTypedefData from '../typedefs/useTypedefData'
import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'
import { formatDate } from '../../utils/date'

const numberTypes = ['int', 'double', 'byte', 'short', 'long']

export default function useCustomMetadataHelpers() {
    const { enumList } = useTypedefData()

    const getDatatypeOfAttribute = (a: CMA) => {
        const parsedType = a.options.primitiveType || (a.typeName.includes('array') ? a.typeName.split('<')[1]?.split('>')[0] : a.typeName)
        if (parsedType && typeof parsedType !== 'undefined') {
            if (numberTypes.includes(parsedType)) return 'number'
            if (a?.options?.isEnum === 'true' || a?.options?.isEnum === true) return 'enum'

            if (parsedType?.includes('string')) {
                if (a?.options?.customType?.includes('users')) return 'users'
                if (a?.options?.customType?.includes('groups')) return 'groups'
                if (a?.options?.customType?.includes('url')) return `url`
                return 'text'
            }
        }
        return parsedType || ''
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
                    Number.isInteger(value) ? value : parseInt(value, 10)
                )
            }
            if (Array.isArray(value)) {
                if (!value.length) return `No value added`
                if (
                    typeof type !== 'object' &&
                    type.toLowerCase().includes('date')
                )
                    value = value.map((v) =>
                        formatDate(Number.isInteger(v) ? v : parseInt(v, 10))
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

    const getHumanTypeName = (tName) => {
        const t = tName.toLowerCase()
        if (t === 'url') return 'URL'
        if (['number', 'int', 'long'].includes(t))
            return 'Number'
        if (['float'].includes(t))
            return 'Decimal'
        return 'Text'
    }

    return {
        getHumanTypeName,
        getDatatypeOfAttribute,
        isLink,
        formatDisplayValue,
        getApplicableAttributes,
        getEnumOptions,
    }
}
