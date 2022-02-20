import { SourceList } from '~/constant/source'

export function getDialectInfo(selectedSourceId: string) {
    const sourceInfo = SourceList.find(
        (source) => source.id?.toLowerCase() === selectedSourceId?.toLowerCase()
    )
    if (sourceInfo?.hasOwnProperty('dialectConfig')) {
        if (sourceInfo.dialectConfig?.assetQuoteType) {
            return sourceInfo.dialectConfig?.assetQuoteType
        }
    }
    return ''
}
export function canQueryAbort(selectedSourceId: string) {
    const sourceInfo = SourceList.find(
        (source) => source.id?.toLowerCase() === selectedSourceId?.toLowerCase()
    )
    if (sourceInfo?.hasOwnProperty('dialectConfig')) {
        if (sourceInfo.dialectConfig?.abortQuery) {
            return sourceInfo.dialectConfig?.abortQuery
        }
    }
    return false
}
export function isSelectFirstDefault(selectedSourceId: string) {
    const sourceInfo = SourceList.find(
        (source) => source.id?.toLowerCase() === selectedSourceId?.toLowerCase()
    )
    if (sourceInfo?.hasOwnProperty('selectFirstAsDefault')) {
        if (sourceInfo.selectFirstAsDefault) {
            return sourceInfo.selectFirstAsDefault
        }
    }
    return false
}
