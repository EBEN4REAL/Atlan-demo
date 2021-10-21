import { onMounted, ref} from "vue"
import bodybuilder from 'bodybuilder'
import useIndexSearch from '~/services/atlas/discovery/useIndexSearch'


export default function useRecenlyData() {
    const query = bodybuilder().aggregation("term", "__typeName.keyword", {size: 10}).size(10).build()
    const { replaceBody, body, isReady, error, data } = useIndexSearch(
      {dsl: query},
      '',
      true
    )
    onMounted(() => {
      replaceBody({dsl: { query }})
      console.log('RUNNNNNNNNN')
    })

  return {
        data
    }
}