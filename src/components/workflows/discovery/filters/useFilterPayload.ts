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
              if (usrPld.criterion?.length) pl.push(usrPld)
            }
            break
          }
          // for BM
          default: {
            console.log("At DEFAULT", fltrObj);

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
