const getEntityStatusIcon = (
    type: String,
    assetStatus: String
): String => {
    if (
        assetStatus === undefined ||
        assetStatus === '' ||
        assetStatus === 'is_null'
    )
        return `${type?.charAt(0).toUpperCase()}${type?.slice(1)}`

    return `${type?.charAt(0).toUpperCase()}${type?.slice(
        1
    )}${assetStatus?.charAt(0).toUpperCase()}${assetStatus?.slice(
        1
    )}`
}

export default getEntityStatusIcon;