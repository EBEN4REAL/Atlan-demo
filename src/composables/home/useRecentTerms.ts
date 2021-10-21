import { onMounted, ref} from "vue"
import bodybuilder from 'bodybuilder'
import useIndexSearch from '~/services/atlas/discovery/useIndexSearch'


export default function useRecentTerms() {
    const currentDate = new Date();
    const sevenDaysAgo = currentDate.getDate() - 7;
    currentDate.setDate(sevenDaysAgo);
    const lastSevenDaysTimestamp = new Date(currentDate).getTime()
    const currentTimestamp = new Date().getTime()

    const query = bodybuilder().orFilter(
      'bool', 
      (b) => b
      .filter("term", "__typeName.keyword", "AtlasGlossaryTerm")
      .filter("range", "__timestamp", {
        gte: lastSevenDaysTimestamp,
        lt: currentTimestamp
      }))
      .sort("__timestamp").build()

    const { replaceBody, body, isReady, error, data } = useIndexSearch(
      {dsl: query},
      '',
      true
    )
    onMounted(() => {
      replaceBody({dsl: query, "attributes":["_modificationTimestamp", "_timestamp", "__createdBy"]})
    })

  return {
    data
  }
}