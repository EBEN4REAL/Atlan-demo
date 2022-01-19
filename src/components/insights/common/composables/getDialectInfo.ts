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
