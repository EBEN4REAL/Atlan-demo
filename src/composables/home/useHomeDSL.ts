import { onMounted } from "vue"
import bodybuilder from 'bodybuilder'
import useIndexSearch from '~/services/atlas/discovery/useIndexSearch'
import { getRecentTimestamp } from '~/utils/date'

export function useRecentTerms() {
    const query = bodybuilder()
      .filter("term", "__typeName.keyword", "AtlasGlossaryTerm")
      .filter("range", "__timestamp", {
        gte: getRecentTimestamp().lastSevenDaysTimestamp,
        lt: getRecentTimestamp().currentTimestamp
      })
      .sort("__timestamp").build()

    const { replaceBody, body, isReady, error, data } = useIndexSearch(
      {dsl: query},
      '',
      false
    )
    onMounted(() => {
      replaceBody({dsl: query, "attributes":["_modificationTimestamp", "_timestamp"]})
    })

  return {
    data
  }
}

export function useRecentAssets() {
  const query = bodybuilder()
  .agg("date_histogram", "group_by_date", {
    field: '__timestamp.date',
    calendar_interval: 'day',
    offset: '-7d',
    time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
  .build()

  const { replaceBody, body, isReady, error, data } = useIndexSearch(
    {dsl: query},
    '',
    false
  )
  onMounted(() => {
    replaceBody({dsl: query})
  })

  return {
    data
  }
}
