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
                    case 'saved': {
                        /*  if (fltrObj.searchParameters?.entityFilters)
                             pl.push(
                                 fltrObj.searchParameters.entityFilters
                             )
                         break */
                        /* fltrObj?.checked?.forEach((facetFilterValue) => {
                            facetFilterValue?.searchParameters?.entityFilters?.criterion?.forEach(criteria => pl.push(criteria))
                        }) */
                        console.log(fltrObj)
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
                    case 'classifications': {
                        const clsfPld: Components.Schemas.FilterCriteria = {
                            condition: fltrObj?.operator || 'OR',
                            criterion: [],
                        }
                        if (fltrObj?.noClassificationsAssigned) {
                            clsfPld.condition = 'OR'
                            clsfPld.criterion?.push({
                                attributeName: '__classificationNames',
                                attributeValue: '-',
                                operator: 'is_null',
                            })
                            clsfPld.criterion?.push({
                                attributeName:
                                    '__propagatedClassificationNames',
                                attributeValue: '-',
                                operator: 'is_null',
                            })
                        } else {
                            const addedBy = fltrObj?.addedBy || 'all'
                            switch (addedBy) {
                                case 'all': {
                                    // Case `all` will always be a OR bw __classificationNames and __propagatedClassificationNames
                                    fltrObj?.checked?.forEach((val) => {
                                        const subFilter: Components.Schemas.FilterCriteria =
                                        {
                                            condition: 'OR',
                                            criterion:
                                                [] as Components.Schemas.FilterCriteria[],
                                        }
                                        const subFilterCriterion: Components.Schemas.FilterCriteria[] =
                                            []
                                        subFilterCriterion.push({
                                            attributeName:
                                                '__classificationNames',
                                            attributeValue: val,
                                            operator: 'eq',
                                        })
                                        subFilterCriterion.push({
                                            attributeName:
                                                '__propagatedClassificationNames',
                                            attributeValue: val,
                                            operator: 'eq',
                                        })
                                        subFilter.criterion = subFilterCriterion
                                        clsfPld.criterion?.push(subFilter)
                                    })
                                    break
                                }
                                case 'users': {
                                    fltrObj?.checked?.forEach((val) => {
                                        clsfPld.criterion?.push({
                                            attributeName:
                                                '__classificationNames',
                                            attributeValue: val,
                                            operator: 'eq',
                                        })
                                    })
                                    break
                                }
                                case 'propagation':
                                    fltrObj?.checked?.forEach((val) => {
                                        clsfPld.criterion?.push({
                                            attributeName:
                                                '__propagatedClassificationNames',
                                            attributeValue: val,
                                            operator: 'eq',
                                        })
                                    })
                                    break
                            }
                        }

                        if (clsfPld.criterion?.length) pl.push(clsfPld)
                        break
                    }
                    case 'owners': {
                        if (fltrObj?.noOwnerAssigned) {
                            pl.push({
                                condition: 'AND',
                                criterion: [
                                    {
                                        attributeName: 'ownerUsers',
                                        attributeValue: '-',
                                        operator: 'is_null',
                                    },
                                    {
                                        attributeName: 'ownerGroups',
                                        attributeValue: '-',
                                        operator: 'is_null',
                                    },
                                ],
                            })
                        } else {
                            const usrPld: Components.Schemas.FilterCriteria = {
                                condition: 'OR',
                                criterion: [],
                            }

                            fltrObj?.userValue?.forEach((user) => {
                                usrPld.criterion?.push({
                                    attributeName: 'ownerUsers',
                                    attributeValue: user,
                                    operator: 'contains',
                                })
                            })
                            fltrObj?.groupValue?.forEach((group) => {
                                usrPld.criterion?.push({
                                    attributeName: 'ownerGroups',
                                    attributeValue: group,
                                    operator: 'contains',
                                })
                            })
                            if (usrPld.criterion?.length) pl.push(usrPld)
                        }
                        break
                    }
                    case 'advanced': {
                        const advPld: Components.Schemas.FilterCriteria = {
                            condition: 'AND',
                            criterion: [],
                        }
                        Object.keys(fltrObj?.applied || {})?.forEach((key) => {
                            const fl = fltrObj?.applied[key]
                            Object.keys(fl).forEach((flk) => {
                                advPld.criterion?.push({
                                    attributeName: key,
                                    attributeValue:
                                        fl[flk] === '-' &&
                                            ['isNull', 'notNull'].includes(flk)
                                            ? ''
                                            : fl[flk],
                                    operator: flk,
                                })
                            })
                        })
                        if (advPld.criterion?.length) pl.push(advPld)
                        break
                    }
                    // for BM
                    default: {
                        const bmPld: Components.Schemas.FilterCriteria = {
                            condition: 'AND',
                            criterion: [],
                        }
                        Object.keys(fltrObj?.applied || {})?.forEach((key) => {
                            const fl = fltrObj?.applied[key]
                            Object.keys(fl).forEach((flk) => {
                                bmPld.criterion?.push({
                                    attributeName: `${mkey}.${key}`,
                                    attributeValue: fl[flk],
                                    operator: flk,
                                })
                            })
                        })
                        if (bmPld.criterion?.length) pl.push(bmPld)
                    }
                }
            })

            return pl
        }
    )
    return { payload }
}
