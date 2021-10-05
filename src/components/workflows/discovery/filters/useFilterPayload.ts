import { Components } from '~/api/atlas/client'
import { Ref, computed, ComputedRef } from 'vue'

export default function useFilterPayload(filters: Ref<Record<string, any>>) {
    const payload: ComputedRef<Components.Schemas.FilterCriteria[]> = computed(
        () => {
            const pl: Components.Schemas.FilterCriteria[] = []
            Object.keys(filters.value).forEach((mkey) => {
                const fltrObj = filters.value[mkey]
                switch (mkey) {
                    case 'connector': {
                        if (fltrObj.attributeName && fltrObj.attributeValue)
                            pl.push({
                                ...fltrObj,
                                operator: 'eq',
                            })
                        break
                    }
                    case 'status': {
                        fltrObj?.checked?.forEach((facetFilterValue) => {
                            if (facetFilterValue !== 'is_null')
                                pl.push({
                                    attributeName: 'assetStatus',
                                    attributeValue: facetFilterValue,
                                    operator: 'eq',
                                })
                            else {
                                const subCriterion: Components.Schemas.FilterCriteria[] =
                                    [
                                        {
                                            condition: 'OR',
                                            criterion: [
                                                {
                                                    attributeName:
                                                        'assetStatus',
                                                    attributeValue: 'is_null',
                                                    operator: 'eq',
                                                },
                                                {
                                                    attributeName:
                                                        'assetStatus',
                                                    attributeValue: '',
                                                    operator: 'isNull',
                                                },
                                            ] as Components.Schemas.FilterCriteria[],
                                        },
                                    ]
                                pl.push(...subCriterion)
                            }
                        })
                        break
                    }
                }
            })

            return pl
        }
    )
    return { payload }
}
