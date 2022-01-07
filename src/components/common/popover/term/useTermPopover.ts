import { ref, watch } from "vue"
import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
import {
    AssetAttributes,
    InternalAttributes,
    SQLAttributes,
    AssetRelationAttributes,
    GlossaryAttributes,
} from '~/constant/projection'
import { Term } from '~/types/glossary/glossary.interface'

const useTermPopover = () => {
    /**
    * * OPTMIZING THE TERMS POPOVER vvvvv
    */


    const limit = ref(1)
    const offset = ref(0)
    const facets = ref({
        guid: '',
    })

    const dependentKey = ref(facets.value.guid)

    const defaultAttributes = ref([
        ...InternalAttributes,
        ...AssetAttributes,
        ...GlossaryAttributes,
    ])
    const relationAttributes = ref([...AssetRelationAttributes])

    const {
        list: fetchTermArr,
        isLoading: termLoading,
        fetch,
        isReady,
        error: termError,
        quickChange,
    } = useDiscoverList({
        isCache: false,
        dependentKey,
        facets,
        limit,
        offset,
        attributes: defaultAttributes,
        relationAttributes,
    })

    const fetchedTerms = ref<Term[]>([])

    const getFetchedTerm = (guid) =>
        fetchedTerms.value.find((t) => t.guid === guid)

    watch([fetchTermArr, isReady], () => {
        if (fetchTermArr.value.length && isReady?.value) {
            const term: Term = fetchTermArr.value[0]
            const index = fetchedTerms.value.findIndex(
                (t) => t.guid === term.guid
            )
            if (index > -1) fetchedTerms.value[index] = term
            else fetchedTerms.value.push(term)
        }
    })

    const handleTermPopoverVisibility = (v, term) => {
        if (getFetchedTerm(term.guid || term.termGuid)) return
        if (v) {
            facets.value.guid = term.guid ?? term.termGuid
            quickChange()
        }
    }

    /**
     * * OPTMIZING THE TERMS POPOVER ^^^^^
     */

    return {
        isReady,
        getFetchedTerm,
        handleTermPopoverVisibility,
        termLoading,
        termError

    }
}

export default useTermPopover