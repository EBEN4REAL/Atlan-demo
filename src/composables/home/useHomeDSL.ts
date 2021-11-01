import { computed, Ref, ref, watch, onMounted } from 'vue'
import bodybuilder from 'bodybuilder'
import dayjs from "dayjs"
import useIndexSearch from '~/services/atlas/discovery/useIndexSearch'
import { assetInterface } from '~/types/assets/asset.interface'
import {
  BaseAttributes,
  BasicSearchAttributes,
} from '~/constant/projection'

// import { getRecentTimestamp } from '~/utils/date'

export function useRecentTerms() {
  const lastSevenDaysTimestamp = dayjs().subtract(7, "day").valueOf()
  const currentTimestamp = dayjs().valueOf()
  const query = bodybuilder()
    .filter("term", "__typeName.keyword", "AtlasGlossaryTerm")
    .filter("range", "__timestamp", {
      gte: lastSevenDaysTimestamp,
      lt: currentTimestamp
    })
    .size(5)
    .sort("__timestamp").build()

  const { replaceBody, body, isReady, error, data } = useIndexSearch(
    { dsl: query },
    '',
    false
  )
  onMounted(() => {
    replaceBody({ dsl: query, "attributes": ["_modificationTimestamp", "_timestamp"] })
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
    .size(5)
    .build()

  const { replaceBody, body, isReady, error, data } = useIndexSearch(
    { dsl: query },
    '',
    false
  )
  onMounted(() => {
    replaceBody({ dsl: query })
  })

  return {
    data
  }
}

function generateQueryDSL(typeNames, username) {

  const query = bodybuilder()
  query.filter('terms', '__typeName.keyword', typeNames)
  if (username !== '') {
    query.filter('term', 'ownerUsers', username)
  }
  return query.build()

}

export function useAssetListing(
  typeNames?: string[],
  username?: string,
  immediate: boolean = true,
  cacheSuffx?: string | ''
) {

  const payload = computed(() => ({
    relationAttributes: [
      'readme',
      'displayText',
      'name',
      'description',
      'shortDescription',
    ],
    dsl: {
      size: 10,
      from: 0,
      ...generateQueryDSL(typeNames, username),
    },
    attributes: [
      ...BaseAttributes,
      ...BasicSearchAttributes,
    ],
  }))

  const list: Ref<assetInterface[]> = ref([])
  const { replaceBody, body, isReady, error, data } = useIndexSearch(
    {},
    '',
    immediate
  )

  const isLoading = computed(() => !isReady.value && !error.value)

  function reFetch() {
    replaceBody({ ...payload.value })
  }

  onMounted(() => {
    replaceBody({ ...payload.value })
  })

  watch(data, () => {
    if (data.value?.entities) {
      list.value = data.value?.entities
    } else {
      list.value = []
    }
  })

  return {
    list,
    isLoading,
    reFetch,
    body,
  }
}

