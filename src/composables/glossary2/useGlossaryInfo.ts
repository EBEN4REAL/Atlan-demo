export default function useGlossaryInfo() {
    const getEntityStatusIcon = (
        type: String,
        certificateStatus: String
    ): String => {
        if (type === 'AtlasGlossary') return `Glossary`

        if (
            certificateStatus === undefined ||
            certificateStatus === '' ||
            certificateStatus === 'is_null' ||
            certificateStatus === null
        )
            return `${type?.charAt(0).toUpperCase()}${type?.slice(1)}`

        return `${type?.charAt(0).toUpperCase()}${type?.slice(
            1
        )}${certificateStatus?.charAt(0).toUpperCase()}${certificateStatus
            ?.slice(1)
            .toLowerCase()}`
    }

    return { getEntityStatusIcon }
}
