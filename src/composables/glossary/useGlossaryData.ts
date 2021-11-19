import useGlossaryStore from '~/store/glossary'

import { computed } from 'vue'

export default function useGlossaryData() {
    const glossaryStore = useGlossaryStore()

    const getGlossary = (qfName: string) => {
        const found = glossaryStore.list.find((i) => {
            if (i.attributes?.qualifiedName === qfName) {
                return true
            }
            return false
        })
        return found
    }

    const glossaryList = computed(() => glossaryStore.list)

    return {
        glossaryList,
        list: glossaryStore.list,
        getGlossary,
    }
}
