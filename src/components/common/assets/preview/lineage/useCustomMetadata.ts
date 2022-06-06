import { computed } from 'vue'
import useTypedefData from '~/composables/typedefs/useTypedefData'
import dayjs, { Dayjs } from 'dayjs'

const { customMetadataList } = useTypedefData()

export default function useCustomMetadata(assets) {
    const dataArr = assets
        .map((a) => {
            const newObj = {}
            Object.entries(a.attributes).forEach(([k, v]) => {
                const exists = Array.isArray(v) ? v.length : true
                if (k.includes('.') && exists) newObj[k] = v
            })
            return { [a.guid]: newObj }
        })
        .filter((a) => Object.keys(Object.values(a)[0]).length)

    const assetGuidAttributesMap = Object.assign({}, ...dataArr)
    const cmNameArr = []

    Object.values(assetGuidAttributesMap).forEach((x) => {
        Object.keys(x).forEach((y) => {
            const cmName = y.split('.')[0]
            cmNameArr.push(cmName)
        })
    })

    const filteredCML = computed(() =>
        customMetadataList.value.filter((cm) => cmNameArr.includes(cm.name))
    )

    const assetGuidCMMap = {}

    Object.entries(assetGuidAttributesMap).forEach(([k, v]) => {
        const res = []
        Object.entries(v).forEach(([k, v]) => {
            const [cmName, cmAttribute] = k.split('.')

            const cmData = filteredCML.value.find((x) => x.name === cmName)
            const cmAttributeData = cmData.attributeDefs.find(
                (x) => x.name === cmAttribute
            )
            const { multiValueSelect, customType, primitiveType } =
                cmAttributeData.options

            const cmNameDN = cmData.displayName
            const cmAttributeDN = cmAttributeData.displayName
            const isSQL = customType === 'SQL'
            const isMultiValue = multiValueSelect === 'true'
            const isEmojiIcon = cmData.options.logoType === 'emoji'
            const isImageIcon = cmData.options.logoType === 'image'
            const cmIcon = isEmojiIcon
                ? cmData.options.emoji
                : cmData.options.imageId || ''

            let cmValueDN = v

            if (isMultiValue) cmValueDN = v.join(', ')

            switch (primitiveType) {
                case 'boolean':
                    cmValueDN = v ? 'Yes' : 'No'
                    break
                case 'date':
                    cmValueDN = dayjs(v).format('DD/MM/YYYY')
                    break
                default:
                    break
            }

            const datObj = {
                cmName,
                cmNameDN,
                cmIcon,
                cmAttribute,
                cmAttributeDN,
                cmValueDN,
                isSQL,
                isEmojiIcon,
                isImageIcon,
                isMultiValue,
            }
            res.push(datObj)
        })
        assetGuidCMMap[k] = res
    })

    return { assetGuidCMMap }
}
