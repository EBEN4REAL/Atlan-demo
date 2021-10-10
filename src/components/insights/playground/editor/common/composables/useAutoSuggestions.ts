import { unref, ref, Ref } from 'vue'
import getSqlKeywords from '~/components/insights/playground/editor/monaco/sqlKeywords'
import * as monaco from 'monaco-editor'
import { useMapping, nextKeywords } from './useMapping'
import { KeyMaps } from '~/services/atlas/atlas_keyMaps'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { triggerCharacters } from '~/components/insights/playground/editor/monaco/triggerCharacters'
import { HEKA_SERVICE_API } from '~/services/heka/index'
import {
    autosuggestionEntityColumn,
    autosuggestionEntity,
    autosuggestionResponse,
} from '~/types/insights/autosuggestionEntity.interface'

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

export function wordToEditorKeyword(
    word: string | string[],
    type: string,
    currentWord: string
) {
    const sqlKeywords = getSqlKeywords()
    return new Promise((resolve) => {
        let words: suggestionKeywordInterface[] = []
        if (Array.isArray(word)) {
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
            words.push(keyword)
        }
        const s = sqlKeywords.filter((keyword) =>
            keyword.label.includes(currentWord.toUpperCase())
        )
        resolve({
            suggestions: [...words, ...s],
            incomplete: true,
        })
    })
}

export function entitiesToEditorKeyword(
    response: Promise<autosuggestionResponse>,
    type: string,
    currentWord: string
) {
    const sqlKeywords = getSqlKeywords()
    return new Promise((resolve) => {
        response.then((res) => {
            const entities = res.entities
            let words: suggestionKeywordInterface[] = []
            let len = entities.length
            for (let i = 0; i < len; i++) {
                let keyword
                switch (type) {
                    case 'TABLE': {
                        keyword = {
                            label: entities[i].name,
                            detail: `${type}`, // TABLE,
                            kind: monaco.languages.CompletionItemKind.Field,
                            documentation: `Some descripiton for ${type}`,
                            insertText: `${entities[i].name}`,
                        }
                        words.push(keyword)
                    }
                    case 'COLUMN': {
                        let cols: autosuggestionEntityColumn[] =
                            entities[i]?.columns
                        for (let j = 0; j < cols?.length; j++) {
                            keyword = {
                                label: cols[j].name,
                                detail: `${type}: ${entities[i].name}`, // COLUMN - TABLE_NAME,
                                kind: monaco.languages.CompletionItemKind.Field,
                                documentation: `Some descripiton for ${type}`,
                                insertText: `${cols[j].name}`,
                            }
                            words.push(keyword)
                        }
                    }
                }
            }
            const s = sqlKeywords.filter((keyword) =>
                keyword.label.includes(currentWord.toUpperCase())
            )
            resolve({
                suggestions: [...words, ...s],
                incomplete: true,
            })
        })
    })
}

function getLocalSQLSugggestions(currentWord: string) {
    const sqlKeywords = getSqlKeywords()
    let suggestions = sqlKeywords.filter((keyword) =>
        keyword.label.includes(currentWord.toUpperCase())
    )
    return Promise.resolve({
        suggestions: suggestions,
        incomplete: true,
    })
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

async function getSuggestionsUsingType(
    type: string = 'TABLE',
    token: string,
    currentWord: string,
    connectorsInfo: {
        connectionQualifiedName: string | undefined
        databaseName: string | undefined
        schemaName: string | undefined
    }
) {
    const body = {
        dataSourceName: connectorsInfo.connectionQualifiedName,
        assetType: type === 'TABLE' ? 'Table' : 'Column',
        catalog: connectorsInfo.databaseName,
        schema: connectorsInfo.schemaName,
        prefix: currentWord,
    }

    switch (type) {
        case 'TABLE': {
            /* Make a network request  all tables starting with word/text for user typing right now */
            // let len = tokens.length
            // currentWord = tokens[len - 1]
            // fetchTables(currentWord)

            /* Current Word Should be greater than 1char */
            if (currentWord.length > 1) {
                const entitiesResponsPromise =
                    HEKA_SERVICE_API.Insights.GetAutoSuggestions(body)
                let suggestionsPromise = entitiesToEditorKeyword(
                    entitiesResponsPromise,
                    type,
                    currentWord
                )
                return suggestionsPromise
            }

            return getLocalSQLSugggestions(currentWord)
        }
        case 'COLUMN': {
            if (currentWord.length > 1) {
                const entitiesResponsPromise =
                    HEKA_SERVICE_API.Insights.GetAutoSuggestions(body)
                let suggestionsPromise = entitiesToEditorKeyword(
                    entitiesResponsPromise,
                    type,
                    currentWord
                )
                return suggestionsPromise
            }
            return getLocalSQLSugggestions(currentWord)
        }
        case 'NEXT_KEYWORD': {
            let suggestionsPromise = wordToEditorKeyword(
                nextKeywords[token],
                type,
                currentWord
            )
            return suggestionsPromise
        }
        default:
            return []
    }
}

export async function useAutoSuggestions(
    changes: any,
    editorInstance: any,
    activeInlineTab: Ref<activeInlineTabInterface>
) {
    console.log(changes, 'changes')
    const changedText = changes.text
    if (!triggerCharacters.includes(changedText)) return []
    const { getConnectionQualifiedName, getDatabaseName, getSchemaName } =
        useConnector()
    const { mappingKeywordsKeys, mappingKeywords } = useMapping()
    const endColumn = changes.range.endColumn
    const endLineNumber = changes.range.endLineNumber
    let suggestions: suggestionKeywordInterface[] = []

    /* Connectors Info */
    const attributeValue =
        activeInlineTab.value.explorer.schema.connectors.attributeValue
    const connectionQualifiedName = getConnectionQualifiedName(attributeValue)
    const databaseName = getDatabaseName(attributeValue)
    const schemaName = getSchemaName(attributeValue)
    // const connectionQualifiedName =
    //     'default/snowflake/atlan-snowflake-crawler-wpwvc'
    // const databaseName = 'SNOWFLAKE_SAMPLE_DATA'
    // const schemaName = 'TPCDS_SF10TCL'
    const connectorsInfo = {
        connectionQualifiedName,
        databaseName,
        schemaName,
    }

    const editorText: string = editorInstance?.getValue()
    /* Getting the text till cursor pos because we hav to generate the tokens */
    const textTillChangedIndex = editorInstance
        ?.getModel()
        .getOffsetAt({ lineNumber: endLineNumber, column: endColumn })
    const editorTextTillCursorPos = editorText.slice(
        0,
        textTillChangedIndex + 1
    )

    let tokens = editorTextTillCursorPos.split(/[ ,]+/gm)
    /* Remove tokens which are special characters */
    tokens = tokens.filter((token) => {
        let t = true
        t = !token.match(/[-[\]{}()*+?'."\\/^$|#\s]/g) && token !== ''
        return t
    })
    // tokens.push(' ')
    console.log(tokens, 'tokens')
    let currentWord = tokens[tokens.length - 1]
    /* If it is a first/nth character of first word */
    if (tokens.length < 2) {
        return getLocalSQLSugggestions(currentWord)
    } else {
        const lastMatchedKeyword:
            | undefined
            | { token: string; index: number; type: string } =
            getLastMappedKeyword(tokens, mappingKeywords, mappingKeywordsKeys)
        console.log('inside', lastMatchedKeyword, tokens)

        if (lastMatchedKeyword) {
            if (Array.isArray(lastMatchedKeyword.type)) {
                lastMatchedKeyword.type.forEach(async (type) => {
                    let s =
                        (await getSuggestionsUsingType(
                            type,
                            lastMatchedKeyword.token,
                            currentWord,
                            connectorsInfo
                        )) ?? []
                    suggestions = [...suggestions, ...s]
                })
            } else {
                console.log('else')
                return getSuggestionsUsingType(
                    lastMatchedKeyword.type,
                    lastMatchedKeyword.token,
                    currentWord,
                    connectorsInfo
                )
            }
        }
    }

    // console.log(suggestions, 'suggestions')
    console.log(changedText, 'changesTExt')
}
