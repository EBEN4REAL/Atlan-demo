import { dataTypeCategoryList } from '~/constant/dataType'

export function useColumn() {
    const getDataTypeImage = (dataType) => {
        const found = dataTypeCategoryList.find((d) =>
            d.type.find(
                (type) => type.toLowerCase() === dataType?.toLowerCase()
            )
        )
        return found?.image
    }
    return {
        getDataTypeImage,
    }
}
