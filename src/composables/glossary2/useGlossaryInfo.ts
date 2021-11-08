export default function useGlossaryInfo() {
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

    return { getEntityStatusIcon }
}
