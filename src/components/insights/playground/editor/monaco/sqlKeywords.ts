import * as monaco from 'monaco-editor'
import { languageTokens } from './sqlTokens'
import { suggestionKeywordInterface } from '~/components/insights/playground/editor/common/composables/useAutoCompletion'

const sqlKeywords = (): suggestionKeywordInterface[] => {
    const keywordsList = languageTokens.keywords.map((keyword) => ({
        label: keyword,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: keyword,
    }))
    return keywordsList
}

export default sqlKeywords
