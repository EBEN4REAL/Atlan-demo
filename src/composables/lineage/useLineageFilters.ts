import { Ref } from 'vue'

export default function useLineageFilters(
    lineageList: {},
    filters: Ref<string[]>,
    query: Ref<string>,
    direction: Ref<string>
) {
    if (!lineageList.value[direction.value]) return { data: [], l: {} }

    const lineageListValue = JSON.parse(JSON.stringify(lineageList.value))
    const assetTypes: [] = []
    const assetTypesLengthMap = {}

    lineageListValue[direction.value] = lineageListValue[direction.value]
        .filter((asset) =>
            filters.value.some((filter) => asset.typeName === filter)
        )
        .filter((asset) => {
            if (query.value)
                return asset.displayText
                    .toLowerCase()
                    .includes(query.value.toLowerCase())
            return asset
        })

    lineageList.value[direction.value].forEach((asset) => {
        assetTypes.push(asset.typeName)
    })

    assetTypes.forEach((i) => {
        const x = assetTypesLengthMap
        if (x[i]) x[i].push(i)
        else x[i] = [i]
        x[i] = x[i].length
    })

    return { data: lineageListValue, l: assetTypesLengthMap }
}
