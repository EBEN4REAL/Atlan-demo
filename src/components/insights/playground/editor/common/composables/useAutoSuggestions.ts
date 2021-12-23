import { unref, ref, Ref } from 'vue'
import getSqlKeywords from '~/components/insights/playground/editor/monaco/sqlKeywords'
import * as monaco from 'monaco-editor'
import { useMapping, nextKeywords } from './useMapping'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { triggerCharacters } from '~/components/insights/playground/editor/monaco/triggerCharacters'
// import HEKA_SERVICE_API from '~/services/heka/index'
import { Insights } from '~/services/sql/query'
import {
    autosuggestionEntityColumn,
    autosuggestionResponse,
} from '~/types/insights/autosuggestionEntity.interface'
import axios from 'axios'
import TurndownService from 'turndown'
export interface suggestionKeywordInterface {
    label: string
    detail: string
    kind: monaco.languages.CompletionItemKind.Field
    documentation: string
    insertText: string
}

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
            keyword.label.includes(currentWord?.toUpperCase())
        )
        resolve({
            suggestions: [...words, ...s],
            incomplete: true,
        })
    })
}
function getAssetProfileURL(entity: any) {
    const URL = `https://${String(location.hostname)}/${
        entity.metadata.guid
    }/overview`
    return URL
}

function generateMarkdown(
    turndownService: any,
    entity: any,
    assetType: string
) {

    let qualifiedName = entity?.attributes?.qualifiedName?.split('/')
    let db = qualifiedName[3]
    let schema = qualifiedName[4]
    let table = qualifiedName[5]
    let name = entity?.attributes?.name
    let description =
        entity.attributes.userDescription || entity.attributes.description

    let certificateStatus = entity?.attributes?.certificateStatus ? entity?.attributes?.certificateStatus : 'no_certificate'
    let descriptionHTML = `<div></p><h6>Description:</h6></br>${description}</p></div>`
    let typeHTML=`<div><h5>${name}</h5></div><div>Status: <h5>${certificateStatus}</h5></div>`
    let ownerString = entity.attributes.ownerUsers.join(', ')
    let ownersHTML = `<div></p> Owned by: <h5>${ownerString}<h5></p></div>`
    console.log('asset here: ', entity)

    let rowCount, columnCount,rowCountHTML, isPrimaryHTML

    if (assetType === 'TABLE') {
        rowCount = entity?.attributes?.rowCount
        columnCount = entity?.attributes?.columnCount
        
        rowCountHTML = `<div>
            <h5>${db} / ${schema}</h5><h5>${rowCount} Rows / ${columnCount} Columns</h5>
        </div>`
        
    } else {
        rowCountHTML = `<div>
            <h5>${db} / ${schema} / ${table}</h5>
        </div>`

        isPrimaryHTML = `<div>
            <div>isPrimary: <h5>${entity?.attributes?.isPrimary ? entity?.attributes?.isPrimary : 'false'}</h5></div>
        </div>`
    }

    return turndownService.turndown(
        `
        <div>
        ${typeHTML}
        ${description ? descriptionHTML : ''}
        ${ownerString ? ownersHTML : ''}
        ${rowCountHTML}
        ${assetType==='COLUMN' ? isPrimaryHTML : ''}
        </div>
        
        `
    )

    // return `![bears](http://placebear.com/200/200) The end ...`
}

export function entitiesToEditorKeyword(
    response: Promise<autosuggestionResponse>,
    type: string,
    currentWord: string,
    connectorsInfo: {
        connectionQualifiedName: string | undefined
        databaseName: string | undefined
        schemaName: string | undefined
    }
) {
    const sqlKeywords = getSqlKeywords()
    const turndownService = new TurndownService()
    return new Promise((resolve) => {
        response.then((res) => {
            const entities = res.entities ?? []
            let words: suggestionKeywordInterface[] = []
            let len = entities.length
            // console.log('suggestion: ', {
            //     entities
            // })
            for (let i = 0; i < len; i++) {
                // console.log('su counter: ', i)
                let keyword
                switch (type) {
                    case 'TABLE': {
                        // console.log('su type: ', 'table')
                        /* When Schema Or database not selected TableQN will be used */
                        let entityType = `${type}`
                        let insertText = entities[i].attributes.name
                        let label = entities[i].attributes.name

                        let qualifiedName =
                            entities[i].attributes.qualifiedName.split('/')
                        let tableQN = `${qualifiedName[3]}.${qualifiedName[4]}.${qualifiedName[5]}`

                        // if (!connectorsInfo.schemaName) {
                        //     insertText = tableQN as string
                        //     const spilltedVal = insertText.split('.')
                        //     // insertText = tableQN as string
                        //     /* database name is selected */
                        //     if (connectorsInfo.databaseName) {
                        //         insertText = `${spilltedVal[1]}.${spilltedVal[2]}`
                        //         entityType = `${type}: ${insertText}`
                        //     } else {
                        //         entityType = `${type}: ${tableQN}`
                        //     }
                        // } else if (!connectorsInfo.databaseName) {
                        //     insertText = tableQN as string
                        //     entityType = `${type}: ${insertText}`
                        // }

                        if (connectorsInfo.schemaName) {
                            var spilltedVal = tableQN.split('.')
                            insertText = spilltedVal[2] as string
                            entityType = `${type}: ${spilltedVal[1]}`

                            // }
                        } else {
                            if (connectorsInfo.databaseName) {
                                insertText = tableQN as string
                                var spilltedVal = tableQN.split('.')
                                insertText = `${spilltedVal[1]}.${spilltedVal[2]}`
                                entityType = `${type}: ${insertText}`
                            } else {
                                insertText = tableQN as string
                                entityType = `${type}: ${insertText}`
                            }
                        }

                        keyword = {
                            label: label,
                            detail: `${entityType}`, // TABLE,
                            kind: monaco.languages.CompletionItemKind.Field,
                            documentation: {
                                value: generateMarkdown(
                                    turndownService,
                                    entities[i],
                                    `${type}`
                                ),
                            },
                            insertText: insertText,
                        }
                        // console.log('su push cn: ', words.length )
                        words.push(keyword)
                        break
                    }
                    case 'COLUMN': {
                        // console.log('su type: ', 'col')
                        let qualifiedName =
                            entities[i].attributes.qualifiedName.split('/')
                        let tableName = qualifiedName[qualifiedName.length - 2]

                        keyword = {
                            label: entities[i].attributes.name,
                            detail: `${type}: ${tableName}`, // COLUMN - TABLE_NAME,
                            kind: monaco.languages.CompletionItemKind.Field,
                            documentation: {
                                value: generateMarkdown(
                                    turndownService,
                                    entities[i],
                                    `${type}`
                                ),
                            },
                            insertText: `${entities[i].attributes.name}`,
                        }
                        words.push(keyword)
                        // }
                    }
                }
            }
            // console.log('suhhestions: ', words)
            // console.log('suggest keywords:', sqlKeywords)
            const s = sqlKeywords.filter((keyword) =>
                keyword.label.includes(currentWord?.toUpperCase())
            )
            // console.log('suggest: ', s)
            resolve({
                suggestions: [...words, ...s],
                incomplete: true,
            })
        })
    })
}

function getLocalSQLSugggestions(currWrd: string) {
    let currentWord = currWrd?.toUpperCase()
    const sqlKeywords = getSqlKeywords()
    let suggestions = sqlKeywords.filter((keyword) =>
        keyword.label.includes(currentWord?.toUpperCase())
    )
    return Promise.resolve({
        suggestions: suggestions,
        incomplete: true,
    })
}
export function getLastMappedKeyword(
    token_param: string[],
    mappingKeywords,
    mappingKeywordsKeys
) {
    // console.log(tokens)
    let tokens = token_param.map((token) => token?.toUpperCase())
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

const attributes = [
    'name',
    'displayName',
    'typeName',
    'dataType',
    'description',
    'userDescription',
    'ownerUsers',
    'ownerGroups',
    'isPrimary',
    'connectorName',
    'connectionId',
    'connectionQualifiedName',
    'parentQualifiedName',
    'defaultSchemaQualifiedName',
    'rowCount',
    'columnCount',
    'tableCount',
    'certificateStatus',
    '__guid',
    'qualifiedName',
    'connectionName',
]
const body = ref()

const refreshBody = () => {
    body.value = {
        dsl: {
            from: 0,
            size: 100,
            sort: [
                {
                    'name.keyword': {
                        order: 'asc',
                    },
                },
            ],
            query: {
                bool: {
                    filter: {
                        bool: {
                            must: [],
                        },
                    },
                },
            },
        },
        attributes,
    }
}
async function getSuggestionsUsingType(
    type: string = 'TABLE',
    token: string,
    currentWord: string,
    connectorsInfo: {
        connectionQualifiedName: string | undefined
        databaseName: string | undefined
        schemaName: string | undefined
    },
    cancelTokenSource: Ref<any>
) {
    refreshBody()
    if (connectorsInfo.schemaName) {
        body.value.dsl.query.bool.filter.bool.must.push({
            term: {
                schemaQualifiedName: `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}/${connectorsInfo.schemaName}`,
            },
        })
    } else if (connectorsInfo.databaseName) {
        body.value.dsl.query.bool.filter.bool.must.push({
            term: {
                databaseQualifiedName: `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}`,
            },
        })
    } else {
        body.value.dsl.query.bool.filter.bool.must.push({
            term: {
                connectionQualifiedName: `${connectorsInfo.connectionQualifiedName}`,
            },
        })
    }

    body.value.dsl.query.bool.filter.bool.must.push({
        regexp: {
            'name.keyword': `${currentWord}.*`,
        },
    })

    switch (type) {
        case 'TABLE': {
            body.value.dsl.query.bool.filter.bool.must.push({
                terms: {
                    '__typeName.keyword': ['Table', 'View'],
                },
            })

            if (cancelTokenSource.value !== undefined) {
                cancelTokenSource.value.cancel()
            }
            /* Current Word Should be greater than 1char */
            if (
                currentWord.length > 1 &&
                connectorsInfo.connectionQualifiedName
            ) {
                cancelTokenSource.value = axios.CancelToken.source()
                const entitiesResponsPromise = Insights.GetAutoSuggestions(
                    body,
                    cancelTokenSource
                )

                let suggestionsPromise = entitiesToEditorKeyword(
                    entitiesResponsPromise,
                    type,
                    currentWord,
                    connectorsInfo
                )
                // console.log('connector: ', connectorsInfo)

                return suggestionsPromise
            }

            return getLocalSQLSugggestions(currentWord)
        }
        case 'COLUMN': {
            body.value.dsl.query.bool.filter.bool.must.push({
                terms: {
                    '__typeName.keyword': ['Column'],
                },
            })

            if (cancelTokenSource.value !== undefined) {
                cancelTokenSource.value.cancel()
            }
            if (
                currentWord.length > 1 &&
                connectorsInfo.connectionQualifiedName
            ) {
                cancelTokenSource.value = axios.CancelToken.source()
                const entitiesResponsPromise = Insights.GetAutoSuggestions(
                    body,
                    cancelTokenSource
                )
                let suggestionsPromise = entitiesToEditorKeyword(
                    entitiesResponsPromise,
                    type,
                    currentWord,
                    connectorsInfo
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
    activeInlineTab: Ref<activeInlineTabInterface>,
    cancelTokenSource: Ref<any>
) {
    // console.log(changes, 'changes')
    const changedText = changes.text
    /* -------_EXITING CONDITIONS-------------- */
    if (!triggerCharacters.includes(changedText))
        return Promise.resolve({ suggestions: [], incomplete: true })
    if (changedText.length > 2)
        return Promise.resolve({ suggestions: [], incomplete: true })
    /* ------------------------------------------------------------- */
    const { getConnectionQualifiedName, getDatabaseName, getSchemaName } =
        useConnector()
    const { mappingKeywordsKeys, mappingKeywords } = useMapping()
    const endColumn = changes.range.endColumn
    const endLineNumber = changes.range.endLineNumber

    /* Connectors Info */
    const attributeValue =
        activeInlineTab.value?.playground?.editor?.context.attributeValue
    const connectionQualifiedName = getConnectionQualifiedName(attributeValue)
    const databaseName = getDatabaseName(attributeValue)
    const schemaName = getSchemaName(attributeValue)
    /* ------------For BETA----------- */
    // const connectionQualifiedName =
    //     'default/snowflake/atlan-snowflake-crawler-wpwvc'
    // const databaseName = 'SNOWFLAKE_SAMPLE_DATA'
    // const schemaName = 'TPCDS_SF10TCL'
    /* ------------------- */
    const connectorsInfo = {
        connectionQualifiedName,
        databaseName,
        schemaName,
    }
    // console.log(connectorsInfo, 'connectorsInfo')

    const editorText: string = editorInstance?.getValue()
    /* Getting the text till cursor pos because we hav to generate the tokens */
    const textTillChangedIndex = editorInstance
        ?.getModel()
        .getOffsetAt({ lineNumber: endLineNumber, column: endColumn })
    const editorTextTillCursorPos = editorText.slice(
        0,
        textTillChangedIndex + 1
    )

    let tokens = editorTextTillCursorPos.split(/[ ,\n;"')(]+/gm)
    // console.log(tokens, 'tokk')
    /* Remove tokens which are special characters */
    tokens = tokens.filter((token) => {
        let t = true
        t = !token.match(/[-[\]{};/\n()*+?'."\\/^$|#\s\t]/g) && token !== ''
        return t
    })
    // tokens.push(' ')
    let currentWord = tokens[tokens.length - 1]
    /* If it is a first/nth character of first word */
    if (tokens.length < 2) {
        return getLocalSQLSugggestions(currentWord)
    } else {
        const lastMatchedKeyword:
            | undefined
            | { token: string; index: number; type: string } =
            getLastMappedKeyword(tokens, mappingKeywords, mappingKeywordsKeys)
        // console.log('inside', lastMatchedKeyword, tokens)

        if (lastMatchedKeyword) {
            return getSuggestionsUsingType(
                lastMatchedKeyword.type,
                lastMatchedKeyword.token,
                currentWord,
                connectorsInfo,
                cancelTokenSource
            )
        }
    }

    // console.log(suggestions, 'suggestions')
    // console.log(changedText, 'changesTExt')
}
