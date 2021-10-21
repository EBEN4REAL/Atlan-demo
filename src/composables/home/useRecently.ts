import { onMounted, ref} from "vue"
import bodybuilder from 'bodybuilder'
import useIndexSearch from '~/services/atlas/discovery/useIndexSearch'


export default function useRecentlyData() {
    const query = bodybuilder().filter("term", "__typeName.keyword", "AtlasGlossaryTerm").sort("__timestamp").build()
    const { replaceBody, body, isReady, error, data } = useIndexSearch(
      {dsl: query},
      '',
      true
    )
    onMounted(() => {
      replaceBody({dsl: query, "attributes":["_modificationTimestamp","_timestamp"]})
      
      console.log('RUNNNNNNNNN')
    })

  return {
      data
    }
}