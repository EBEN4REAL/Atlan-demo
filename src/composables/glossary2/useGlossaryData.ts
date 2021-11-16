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

    const glossaryList = computed(() =>
        glossaryStore.list.sort((a, b) =>
            a.attributes.name > b.attributes.name
                ? 1
                : b.attributes.name > a.attributes.name
                ? -1
                : 0
        )
    )

    const getGlossaryByQF = (qf) =>
        glossaryStore.list.find((i) => i.attributes.qualifiedName === qf)

    const handleSelectedGlossary = (item) => {
        glossaryStore.setSelectedGlossary(item)
    }

    const getEntityStatusIcon = (
        type: String,
        certificateStatus: String
    ): String => {
        let typeName = ''

        if (type === 'AtlasGlossary') {
            typeName = 'Glossary'
        } else if (type === 'AtlasGlossaryTerm') {
            typeName = 'Term'
        } else if (type === 'AtlasGlossaryCategory') {
            typeName = 'Category'
        }

        let status = ''
        if (certificateStatus === 'VERIFIED') {
            status = 'Verified'
        } else if (certificateStatus === 'DRAFT') {
            status = 'Draft'
        } else if (certificateStatus === 'DEPRECATED') {
            status = 'Deprecated'
        }

        if (
            certificateStatus === undefined ||
            certificateStatus === '' ||
            certificateStatus === 'is_null' ||
            certificateStatus === null
        )
            return typeName

        return `${typeName}${status}`
    }

    const selectedGlossary = computed(() => {
        return glossaryStore.selectedGlossary
    })

    return {
        glossaryList,
        list: glossaryStore.list,
        getGlossary,
        getEntityStatusIcon,
        handleSelectedGlossary,
        selectedGlossary,
        getGlossaryByQF,
    }
}
