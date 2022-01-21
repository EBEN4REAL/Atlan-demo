import * as monaco from 'monaco-editor'
import { languageTokens } from './sqlTokens'
export interface suggestionKeywordInterface {
    label: string
    detail: string
    kind: monaco.languages.CompletionItemKind.Field
    documentation: string
    insertText: string
}
const sqlKeywords = (): suggestionKeywordInterface[] => {
    const keywordsList = languageTokens.keywords.map((keyword) => ({
        label: keyword,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: keyword,
    }))
    return keywordsList
}

export default sqlKeywords
