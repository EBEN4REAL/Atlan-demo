const getEntityStatusIcon = (
    type: String,
    certificateStatus: String
): String => {
    if (
        certificateStatus === undefined ||
        certificateStatus === '' ||
        certificateStatus === 'is_null'
    )
        return `${type?.charAt(0).toUpperCase()}${type?.slice(1)}`

    return `${type?.charAt(0).toUpperCase()}${type?.slice(1)}${certificateStatus
        ?.charAt(0)
        .toUpperCase()}${certificateStatus?.slice(1)}`
}

export default getEntityStatusIcon
