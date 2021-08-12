import { computed } from 'vue'
import { dataTypeList } from '~/constant/datatype'

export default function useColumnsFilters(columnList, searchTerm, filters) {
    const filteredList = computed(() => {
        const allowedTypes = dataTypeList
            .filter((typeList) => filters.value.includes(typeList.id))
            .reduce((acc: string[], dt) => [...acc, ...dt.type], [])
            .map((type) => type.toLowerCase())

        const keyword = searchTerm.value.toLowerCase()

        return (
            columnList?.entities?.filter(
                (item) =>
                    (keyword
                        ? item.displayText.toLowerCase().includes(keyword)
                        : true) &&
                    (filters.value.length
                        ? allowedTypes.includes(
                              item.attributes.dataType.toLowerCase()
                          )
                        : true)
            ) || []
        )
    })

    return {
        filteredList,
    }
}
