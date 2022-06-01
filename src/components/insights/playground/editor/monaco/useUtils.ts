import { capitalizeFirstLetter } from '~/utils/string'
import useAssetInfo from '~/composables/discovery/useAssetInfo'
import * as monaco from 'monaco-editor'

const {
    assetType,
    certificateStatus,
    dataTypeCategoryImage,
    announcementType,
} = useAssetInfo()

const getAssetIconWithCertification = (asset) => {
    if (!asset) return ''
    const type =
        capitalizeFirstLetter(
            assetType(asset)?.toLowerCase() ||
                asset.typeName.toLowerCase() ||
                ''
        ) || ''
    const certification =
        capitalizeFirstLetter(certificateStatus(asset)?.toLowerCase() || '') ||
        ''

    if (type && certification) return `${type}${certification}`
    if (type) return `${type}`
    return ''
}

export function getSuggestionsListIcon(suggestion: any) {
    const keys = Object.keys(monaco.languages.CompletionItemKind)
    const values = Object.values(monaco.languages.CompletionItemKind)
    const index = values.findIndex((val) => val === suggestion.kind)
    let type = null
    if (index > -1 && !suggestion.documentation?.entity) {
        type = keys[index]
    }
    let icon
    debugger
    if (suggestion.kind === 'snippet') {
        return 'Snippet'
    }
    if (type) {
        if (type === 'Function') {
            icon = type
        } else {
            // for other keyword
            icon = 'Nut'
        }
        return icon
    }
    if (suggestion?.documentation?.entity) {
        if (suggestion.documentation.entity?.typeName == 'Column') {
            return dataTypeCategoryImage(suggestion.documentation.entity)
        } else
            return getAssetIconWithCertification(
                suggestion.documentation.entity
            )
    }

    return 'Vqb24'
}
export function getSuggestionsListType(suggestion: any) {
    const keys = Object.keys(monaco.languages.CompletionItemKind)
    const values = Object.values(monaco.languages.CompletionItemKind)
    const index = values.findIndex((val) => val === suggestion.kind)
    let type = null
    if (index > -1 && !suggestion.documentation?.entity) {
        type = keys[index]
    }
    if (type) {
        if (type === 'Function') {
            return 'Function'
        } else {
            // for other keyword
            return 'Block'
        }
    }
    if (suggestion.kind === 'snippet') {
        return 'Snippet'
    }
    return ''
}

export function getAnnouncementIcon(suggestion: any) {
    if (!announcementType(suggestion.documentation?.entity)) {
        return ''
    }
    switch (announcementType(suggestion.documentation?.entity)?.toLowerCase()) {
        case 'information':
            return 'InformationAnnouncement'
        case 'issue':
            return 'IssuesAnnouncement'
        case 'warning':
            return 'WarningAnnouncement'
        default:
            return 'InformationAnnouncement'
    }
}

export function getTableNameFromColumnQualifiedName(
    columnQualifiedName: string
) {
    const spiltArray = columnQualifiedName?.split('/')
    if (spiltArray?.length > 5) {
        return `${spiltArray[5]}`
    }
    return ''
}
