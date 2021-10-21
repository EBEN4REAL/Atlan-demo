import { onMounted, ref} from "vue"
import bodybuilder from 'bodybuilder'
import useIndexSearch from '~/services/atlas/discovery/useIndexSearch'


export default function useRecentlyData() {
    // const query = bodybuilder().sort("__timestamp", {sort: "asc"}).build()
    const query = bodybuilder().filter("term", "__typeName.keyword", "AtlasGlossaryTerm").sort("__timestamp").build()
    // const query = bodybuilder().sort("__timestamp", {sort: "asc"}).size(20).build()
    const { replaceBody, body, isReady, error, data } = useIndexSearch(
      {dsl: query},
      '',
      true
    )
    onMounted(() => {
      replaceBody({dsl: query, "attributes":["_modificationTimestamp","_timestamp"]})
      // replaceBody({dsl: {
      //   size: 2,
      //   query: {
      //     bool: {
      //       filter: [
      //         {
      //           terms: {
      //             "__typeName.keyword": ["Table"]
      //           }
      //         }
      //       ]
      //     }
      //   }
      // } })
      console.log('RUNNNNNNNNN')
    })

  return {
      data
    }
}