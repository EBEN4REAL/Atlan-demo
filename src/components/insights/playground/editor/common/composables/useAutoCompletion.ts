import { unref, ref } from 'vue'
import savedQuery from '~/components/insights/playground/editor/monaco/savedQuery'
import getSqlKeywords from '~/components/insights/playground/editor/monaco/sqlKeywords'
import columnSuggestion from '~/components/insights/playground/editor/monaco/columnSuggestion'
import fetchColumnList from '~/components/insights/playground/editor/monaco/fetchColumnList'
import * as monaco from 'monaco-editor'
import { useMapping } from './useMapping'
//https://gist.github.com/mwrouse/05d8c11cd3872c19c684bd1904a2202e
const entityFilters = {
    condition: 'OR',
    criterion: [
        {
            attributeName: 'viewQualifiedName',
            operator: 'eq',
            attributeValue:
                'default/snowflake/shpllkz7g/SNOWFLAKE/ORGANIZATION_USAGE/RATE_SHEET_DAILY',
        },
        {
            attributeName: 'tableQualifiedName',
            operator: 'eq',
            attributeValue:
                'default/snowflake/shpllkz7g/SNOWFLAKE/ORGANIZATION_USAGE/RATE_SHEET_DAILY',
        },
    ],
}
export interface suggestionKeywordInterface {
    label: string
    detail: string
    kind: monaco.languages.CompletionItemKind.Field
    documentation: string
    insertText: string
}
const tableNames = [
    'instacart',
    'instacart_alcohol',
    'instacart_atlan',
    'instacart_insights',
]
const columnNames = ['indians', 'insights_india', 'inr_rupee', 'inventors']
// export function useAutoCompletion() {
//     const now = ref(true)
//     const { list } = fetchColumnList('', now, entityFilters, [
//         'Column.dataType.keyword',
//     ])

//     function randStr(len = 7) {
//         let s = ''
//         while (s.length < len)
//             s += Math.random()
//                 .toString(36)
//                 .substr(2, len - s.length)
//         return s
//     }

//     const generateKeywordSuggestions = (lastTypedCharacter: string) => {
//         const randomKeywords = []
//         Array(8)
//             .fill('')
//             .forEach(() => {
//                 const randomString = randStr()
//                 const keyword = {
//                     label: lastTypedCharacter + randomString,
//                     kind: monaco.languages.CompletionItemKind.Keyword,
//                     insertText: lastTypedCharacter + randomString,
//                 }
//                 randomKeywords.push(keyword)
//             })
//         return randomKeywords
//     }

//     function getAutoCompletionKeyWords(
//         monacoInstance: any,
//         lastTypedCharacter: string,
//         disposable: any
//     ) {
//         let randomKeywords: any = []
//         if (lastTypedCharacter !== '')
//             randomKeywords = generateKeywordSuggestions(lastTypedCharacter)
//         // clearing previous popover register data
//         if (disposable) disposable.value?.dispose()
//         console.log(randomKeywords)
//         disposable.value =
//             monacoInstance.languages.registerCompletionItemProvider(
//                 'atlansql',
//                 {
//                     provideCompletionItems() {
//                         // For object properties https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitem.html
//                         return {
//                             suggestions: [
//                                 ...randomKeywords,
//                                 ...savedQuery(),
//                                 ...sqlKeywords(),
//                                 ...columnSuggestion(unref(list.value)),
//                             ],
//                         }
//                     },
//                 }
//             )
//     }
//     return {
//         getAutoCompletionKeyWords,
//     }
// }

export function wordToEditorKeyword(word: string | string[], type: string) {
    if (Array.isArray(word)) {
        let words: suggestionKeywordInterface[] = []
        let len = word.length
        for (let i = 0; i < len; i++) {
            let keyword = {
                label: word[i],
                detail: type,
                kind: monaco.languages.CompletionItemKind.Keyword,
                documentation: `Some descripiton for ${type}`,
                insertText: `${word[i]}`,
            }
            words.push(keyword)
        }
        return words
    } else {
        const keyword = {
            label: word,
            detail: type,
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: `Some descripiton for ${type}`,
            insertText: `'${word}'`,
        }
        return keyword
    }
}

function getLastMappedKeyword(
    tokens: string[],
    mappingKeywords,
    mappingKeywordsKeys
) {
    console.log(tokens)
    for (let i = tokens.length - 1; i >= 0; i--) {
        /* type- TABLE/COLUMN/SQL keyword */
        if (mappingKeywordsKeys.includes(tokens[i])) {
            return {
                token: tokens[i],
                index: i,
                type: mappingKeywords[tokens[i]],
            }
        }
    }
    return undefined
}
export function useAutoCompletion(changes: any, editorInstance: any) {
    const { mappingKeywordsKeys, mappingKeywords } = useMapping()
    const startColumn = changes.range.startColumn
    const startLineNumber = changes.range.startLineNumber
    const changedText = changes.text
    const sqlKeywords = getSqlKeywords()
    let suggestions: suggestionKeywordInterface[] = []

    const editorText: string = editorInstance?.getValue()
    let tokens = editorText.split(/\s/gm)
    /* Remove tokens which are special characters */
    tokens = tokens.filter((token) => {
        let t = true
        t = !token.match(/[-[\]{}()*+?'.,"\\/^$|#\s]/g) && token !== ''
        return t
    })
    // tokens.push(' ')
    let currentWord = tokens[tokens.length - 1]
    currentWord = currentWord.toUpperCase()
    /* If it is a first/nth character of first word */
    if (tokens.length < 1) {
        suggestions = sqlKeywords.filter((keyword) =>
            keyword.label.includes(currentWord)
        )
        return suggestions
    }

    const lastMatchedKeyword:
        | undefined
        | { token: string; index: number; type: string } = getLastMappedKeyword(
        tokens,
        mappingKeywords,
        mappingKeywordsKeys
    )

    if (lastMatchedKeyword) {
        if (lastMatchedKeyword.type === 'TABLE') {
            /* Make a network request  all tables starting with word/text for user typing right now */
            let len = tokens.length
            const currentWord = tokens[len - 1]
            // fetchTables(currentWord)
            const type = 'TABLE'
            const s = wordToEditorKeyword(tableNames, type)
            suggestions = [...s, ...suggestions]
        } else if (lastMatchedKeyword.type === 'COLUMN') {
            /* Make a network request  all tables starting with word/text for user typing right now */
            let len = tokens.length
            const currentWord = tokens[len - 1]
            // fetchTables(currentWord)
            const type = 'COLUMN'
            const c = wordToEditorKeyword(columnNames, type)
            suggestions = [...c, ...suggestions]
        }
    }
    let s = sqlKeywords.filter((keyword) => keyword.label.includes(currentWord))
    suggestions = [...suggestions, ...s]
    return suggestions
}
