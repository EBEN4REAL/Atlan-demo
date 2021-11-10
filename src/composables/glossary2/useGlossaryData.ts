import { useGlossaryStore } from '~/store/glossary'

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

    const initTree = () => {
        return glossaryList.value.map((i) => {
            let isLeafFlag = false
            if (i.termsCount === 0 && i.categoryCount === 0) {
                isLeafFlag = true
            }
            return {
                ...i,
                id: i.attributes?.qualifiedName,
                key: i.attributes?.qualifiedName,
                isLeaf: isLeafFlag,
            }
        })
    }

    return {
        glossaryList,
        list: glossaryStore.list,
        getGlossary,
        getEntityStatusIcon,
        initTree,
    }
}
