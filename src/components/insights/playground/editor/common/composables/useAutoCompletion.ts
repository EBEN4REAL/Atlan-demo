import { unref, ref } from 'vue'
import savedQuery from '@/projects/monaco/savedQuery'
import sqlKeywords from '@/projects/monaco/sqlKeywords'
import columnSuggestion from '@/projects/monaco/columnSuggestion'
import fetchColumnList from '~/composables/columns/fetchColumnList'

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

export function useAutoCompletion() {
    const now = ref(true)
    const { list } = fetchColumnList('', now, entityFilters, [
        'Column.dataType.keyword',
    ])

    function randStr(len = 7) {
        let s = ''
        while (s.length < len)
            s += Math.random()
                .toString(36)
                .substr(2, len - s.length)
        return s
    }

    const generateKeywordSuggestions = (lastTypedCharacter: string) => {
        const randomKeywords = []
        Array(8)
            .fill('')
            .forEach(() => {
                const randomString = randStr()
                const keyword = {
                    label: lastTypedCharacter + randomString,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: lastTypedCharacter + randomString,
                }
                randomKeywords.push(keyword)
            })
        return randomKeywords
    }

    function getAutoCompletionKeyWords(
        monacoInstance: any,
        lastTypedCharacter: string,
        disposable: any
    ) {
        let randomKeywords: any = []
        if (lastTypedCharacter !== '')
            randomKeywords = generateKeywordSuggestions(lastTypedCharacter)
        // clearing previous popover register data
        if (disposable) disposable.value?.dispose()
        console.log(randomKeywords)
        disposable.value =
            monacoInstance.languages.registerCompletionItemProvider(
                'atlansql',
                {
                    provideCompletionItems() {
                        // For object properties https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitem.html
                        return {
                            suggestions: [
                                ...randomKeywords,
                                ...savedQuery(),
                                ...sqlKeywords(),
                                ...columnSuggestion(unref(list.value)),
                            ],
                        }
                    },
                }
            )
    }
    return {
        getAutoCompletionKeyWords,
    }
}
