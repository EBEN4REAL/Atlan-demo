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

    const getGlossaryByGuid = (guid: string) => {
        const found = glossaryStore.list.find((i) => i?.guid === guid)
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
        glossaryList.value.find((i) => i.attributes.qualifiedName === qf)

    const getFirstGlossaryQF = () =>
        glossaryList.value.length > 0
            ? glossaryList.value[0].attributes.qualifiedName
            : ''

    const handleSelectedGlossary = (item) => {
        glossaryStore.setSelectedGTC(item)
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

    const selectedGlossary = computed(() => glossaryStore.selectedGTC)

    return {
        glossaryList,
        list: glossaryStore.list,
        getGlossary,
        getEntityStatusIcon,
        handleSelectedGlossary,
        selectedGlossary,
        getGlossaryByQF,
        getFirstGlossaryQF,
        getGlossaryByGuid,
    }
}
