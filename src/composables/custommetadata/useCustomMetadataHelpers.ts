import useTypedefData from '../typedefs/useTypedefData'
import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'
import { formatDate } from '../../utils/date'
import { data } from 'autoprefixer'
import { Ref } from 'vue'

const numberTypes = ['int', 'double', 'byte', 'short', 'long']

export default function useCustomMetadataHelpers() {
    const { enumList } = useTypedefData()

    const getDatatypeOfAttribute = (a: CMA) => {
        const parsedType =
            a.options.primitiveType ||
            (a.typeName.includes('array')
                ? a.typeName.split('<')[1]?.split('>')[0]
                : a.typeName)
        if (parsedType && typeof parsedType !== 'undefined') {
            if (numberTypes.includes(parsedType)) return 'number'
            if (a?.options?.isEnum === 'true' || a?.options?.isEnum === true)
                return 'enum'

            if (parsedType?.includes('string')) {
                if (a?.options?.customType?.includes('users')) return 'users'
                if (a?.options?.customType?.includes('groups')) return 'groups'
                if (a?.options?.customType?.includes('url')) return `url`
                if (a?.options?.customType?.includes('SQL')) return `SQL`
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
                if (value.includes('-'))
                    // if value is ISO '2022-02-22 12:31:23' call directly.
                    return formatDate(value)
                // else unix timestamp gets coverted into string, eg. "1646386649281"
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
                    value = value.map((v) => {
                        if (value.includes('-'))
                            // if value is ISO '2022-02-22 12:31:23' call directly.
                            return formatDate(value)
                        // else unix timestamp gets coverted into string, eg. "1646386649281"
                        return formatDate(
                            Number.isInteger(v) ? v : parseInt(v, 10)
                        )
                    })
                return value.join(', ')
            }
        }
        return v
    }

    const getApplicableAttributes = (BM, typeName) =>
        JSON.parse(
            JSON.stringify(
                (BM?.attributes || BM?.attributeDefs).filter(
                    (a) =>
                        a.options.customApplicableEntityTypes &&
                        JSON.parse(
                            a.options.customApplicableEntityTypes
                        ).includes(typeName) &&
                        a.options?.isDeprecated !== 'true'
                )
            )
        )

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
        if (['number', 'int', 'long'].includes(t)) return 'Number'
        if (['float'].includes(t)) return 'Decimal'
        if (['text', 'string'].includes(t)) return 'Text'
        if (['enum'].includes(t)) return 'Options'
        return tName
    }

    /**
     * 
     * @param attributeList final attribute list applicable to the asset
     * @param asset asset object where values will be parse
     * @desc extracts bm values from the asset and attaches to the provided attribute list
     */
    const parseAttributeValueHelper = (attributeList: Ref, asset: Ref, metadata: Ref) => {
        if (asset.value?.attributes) {
            const bmAttributes = Object.keys(
                asset.value.attributes
            ).filter((attr) => attr.split('.').length > 1)

            if (bmAttributes.length)
                bmAttributes.forEach((ab) => {
                    // TODO ? @abstrekt BM object where modified when using in discover, id is present there not in admin,
                    // !Refactor - @abstrekt all the bm in helper function to support unmodified object, and refactor discover to have fallback keys
                    if ((metadata.value.id || metadata.value.name) === ab.split('.')[0]) {
                        const attribute = ab.split('.')[1]

                        const value = asset.value.attributes[ab]
                        const attrIndex =
                            attributeList.value.findIndex(
                                (a) => a.name === attribute
                            )
                        const options =
                            attributeList.value[attrIndex]?.options

                        if (attrIndex > -1) {
                            if (options?.multiValueSelect === 'true') {
                                // value = JSON.parse(value)
                            }

                            attributeList.value[attrIndex].value =
                                value
                        }
                    }
                })
        }
    }

    /**
     * 
     * @param a attribute object after parsing through @function parseAttributeValueHelper
     * @returns {Boolean} if a value exists for this attribute 
     */
    const attributeHasValue = (a) => {
        const isMultivalued =
            a?.options?.multiValueSelect === 'true' ||
            a?.options?.multiValueSelect === true
        const dataType = getDatatypeOfAttribute(a)

        if (
            [
                'url',
                'text',
                'int',
                'float',
                'number',
                'decimal',
                'users',
                'groups',
                'enum',
            ].includes(dataType) &&
            isMultivalued
        )
            return !!a.value?.length
        if (
            ['url', 'text', 'users', 'groups', 'enum'].includes(
                dataType
            )
        )
            return !!a.value
        return !!formatDisplayValue(a.value?.toString() || '', dataType)
    }



    return {
        attributeHasValue,
        parseAttributeValueHelper,
        getHumanTypeName,
        getDatatypeOfAttribute,
        isLink,
        formatDisplayValue,
        getApplicableAttributes,
        getEnumOptions,
    }
}
