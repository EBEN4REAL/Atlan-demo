import { unref, ref, Ref } from 'vue'
import getSqlKeywords from '~/components/insights/playground/editor/monaco/sqlKeywords'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useMapping, nextKeywords } from './useMapping'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { triggerCharacters } from '~/components/insights/playground/editor/monaco/triggerCharacters'
import { getDialectInfo } from '~/components/insights/common/composables/getDialectInfo'
import {
    extractTablesFromContext,
    getSchemaAndDatabaseFromSqlQueryText,
} from './autoSuggestionUtils'
import { contextStore } from './useMapping'

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

    let certificateStatus = entity?.attributes?.certificateStatus
        ? entity?.attributes?.certificateStatus
        : 'no_certificate'
    let descriptionHTML = `<div></p><h6>Description:</h6></br>${description}</p></div>`
    let typeHTML = `<div><h5>${name}</h5></div><div>Status: <h5>${certificateStatus}</h5></div>`
    let ownerString = entity.attributes.ownerUsers.join(', ')
    let ownersHTML = `<div></p> Owned by: <h5>${ownerString}<h5></p></div>`
    // console.log('asset here: ', entity)

    let rowCount, columnCount, rowCountHTML, isPrimaryHTML

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
            <div>isPrimary: <h5>${
                entity?.attributes?.isPrimary
                    ? entity?.attributes?.isPrimary
                    : 'false'
            }</h5></div>
        </div>`
    }

    return turndownService.turndown(
        `
        <div>
        ${typeHTML}
        ${description ? descriptionHTML : ''}
        ${ownerString ? ownersHTML : ''}
        ${rowCountHTML}
        ${assetType === 'COLUMN' ? isPrimaryHTML : ''}
        </div>
        
        `
    )

    // return `![bears](http://placebear.com/200/200) The end ...`
}

export function getContext(
    qualifiedName,
    assetQuoteType: string,
    context: {
        attributeName: string
        attributeValue: string
    },
    useSchemaExplorerContext?: boolean
) {
    const { getDatabaseName, getSchemaName } = useConnector()

    let contextPrefix = ''
    if (useSchemaExplorerContext) {
        contextPrefix += `${assetQuoteType}${
            getDatabaseName(qualifiedName ?? '') ?? ''
        }${assetQuoteType}.${assetQuoteType}${
            getSchemaName(qualifiedName ?? '') ?? ''
        }${assetQuoteType}.`
        return contextPrefix
    }
    /*_______________CONTEXT_______ */
    if (context.attributeName === 'connectionQualifiedName') {
        contextPrefix += `${assetQuoteType}${
            getDatabaseName(qualifiedName ?? '') ?? ''
        }${assetQuoteType}.${assetQuoteType}${
            getSchemaName(qualifiedName ?? '') ?? ''
        }${assetQuoteType}.`
    } else if (context.attributeName === 'databaseQualifiedName') {
        contextPrefix += `${assetQuoteType}${
            getSchemaName(qualifiedName ?? '') ?? ''
        }${assetQuoteType}.`
    }
    return contextPrefix
    /* _______________________________ */
}

export function entitiesToEditorKeyword(
    response: Promise<autosuggestionResponse>,
    type: string,
    currentWord: string,
    connectorsInfo: {
        connectionQualifiedName: string | undefined
        databaseName: string | undefined
        schemaName: string | undefined
    },
    context: {
        attributeName: string
        attributeValue: string
    },
    isDotBased: boolean = false // wether to include table with column or not T.C
) {
    const { getConnectorName } = useConnector()
    // for assetQuote Info of different sources
    const assetQuoteType = getDialectInfo(
        getConnectorName(
            connectorsInfo?.connectionQualifiedName ||
                connectorsInfo?.databaseName ||
                connectorsInfo?.schemaName
        ) ?? ''
    )

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
            let sortString = 'a'
            for (let i = 0; i < len; i++) {
                // console.log('su counter: ', i)
                let keyword
                sortString = 'a'.repeat(i + 1)

                switch (type) {
                    case 'TABLE': {
                        // debugger
                        // console.log('su type: ', 'table')
                        /* When Schema Or database not selected TableQN will be used */
                        // let entityType = `${type}`
                        let qualifiedName =
                            entities[i].attributes.qualifiedName.split('/')
                        const contextPrefix = getContext(
                            entities[i].attributes.qualifiedName,
                            assetQuoteType,
                            context
                        )
                        let entityType = ``
                        let insertText = `${assetQuoteType}${entities[i].attributes.name}${assetQuoteType}`
                        let label = entities[i].attributes.name

                        let tableQN = `${assetQuoteType}${qualifiedName[3].replaceAll(
                            '"',
                            ''
                        )}${assetQuoteType}.${assetQuoteType}${qualifiedName[4].replaceAll(
                            '"',
                            ''
                        )}${assetQuoteType}.${assetQuoteType}${qualifiedName[5].replaceAll(
                            '"',
                            ''
                        )}${assetQuoteType}`

                        if (connectorsInfo.schemaName) {
                            var spilltedVal = tableQN.split('.')
                            insertText =
                                `${contextPrefix}${spilltedVal[2]}` as string // tableName
                            entityType = `${type}: ${spilltedVal[1]}`
                            entityType = `${spilltedVal[1]}`

                            // }
                        } else {
                            if (connectorsInfo.databaseName) {
                                insertText = tableQN as string
                                var spilltedVal = tableQN.split('.')
                                insertText =
                                    `${contextPrefix}${spilltedVal[2]}` as string // tableName
                                // entityType = `${type}: ${insertText}`
                                entityType = `${insertText}`
                            } else {
                                var spilltedVal = tableQN.split('.')
                                insertText = tableQN as string
                                // entityType = `${type}: ${insertText}`
                                entityType = `${spilltedVal[2]}`
                            }
                        }

                        keyword = {
                            // label: label,
                            // detail: `${entityType}`, // TABLE,
                            label: label,
                            detail: `${entityType}`,
                            kind: monaco.languages.CompletionItemKind.Field,
                            documentation: {
                                value: generateMarkdown(
                                    turndownService,
                                    entities[i],
                                    `${type}`
                                ),
                                entity: entities[i],
                            },
                            insertText: insertText,
                            sortText: sortString,
                        }
                        // console.log('su push cn: ', words.length )
                        words.push(keyword)
                        break
                    }
                    case 'COLUMN': {
                        // console.log('su type: ', 'col')
                        let qualifiedName =
                            entities[i].attributes.qualifiedName.split('/')
                        const contextPrefix = getContext(
                            entities[i].attributes.qualifiedName,
                            assetQuoteType,
                            context
                        )
                        let tableName = qualifiedName[
                            qualifiedName.length - 2
                        ].replaceAll('"', '')

                        keyword = {
                            // label: entities[i].attributes.name,
                            // detail: `${type}: ${tableName}`, // COLUMN - TABLE_NAME,
                            label: entities[i].attributes.name,
                            detail: `${tableName}`, // COLUMN - TABLE_NAME,
                            kind: monaco.languages.CompletionItemKind.Field,
                            documentation: {
                                value: generateMarkdown(
                                    turndownService,
                                    entities[i],
                                    `${type}`
                                ),
                                entity: entities[i],
                            },
                            sortText: sortString,
                            insertText: isDotBased
                                ? `${assetQuoteType}${entities[i].attributes.name}${assetQuoteType}`
                                : `${contextPrefix}${assetQuoteType}${tableName}${assetQuoteType}.${assetQuoteType}${entities[i].attributes.name}${assetQuoteType}`,
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
    mappingKeywordsKeys,
    typesKeywordsMap: Record<string, Record<string, string[]>>
) {
    // console.log(tokens)
    let tokens = token_param.map((token) => token?.toUpperCase())
    for (let i = tokens.length - 1; i >= 0; i--) {
        /* type- TABLE/COLUMN/SQL keyword */
        if (mappingKeywordsKeys.includes(tokens[i])) {
            let functionType: undefined | string = undefined
            let tokenPosition = tokens.length - 1 - (i + 1) // counting start from last 0->extreme
            const _keys = Object.keys(typesKeywordsMap)
            _keys.forEach((key) => {
                if (typesKeywordsMap[key].trigger.includes(tokens[i])) {
                    functionType = key
                }
            })

            return {
                token: tokens[i],
                index: i,
                type: mappingKeywords[tokens[i]],
                functionType,
                tokenPosition,
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
            size: 20,
            query: {
                function_score: {
                    query: {
                        bool: {
                            filter: {
                                bool: {
                                    must: [
                                        {
                                            term: {
                                                __state: 'ACTIVE',
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    functions: [
                        {
                            filter: {
                                match: {
                                    certificateStatus: 'VERIFIED',
                                },
                            },
                            weight: 5,
                        },
                        {
                            filter: {
                                match: {
                                    certificateStatus: 'DRAFT',
                                },
                            },
                            weight: 4,
                        },
                        {
                            filter: {
                                match: {
                                    __typeName: 'Table',
                                },
                            },
                            weight: 5,
                        },
                        {
                            filter: {
                                match: {
                                    __typeName: 'View',
                                },
                            },
                            weight: 5,
                        },
                        {
                            filter: {
                                match: {
                                    __typeName: 'Column',
                                },
                            },
                            weight: 3,
                        },
                        {
                            filter: {
                                match: {
                                    __typeName: 'AtlasGlossaryTerm',
                                },
                            },
                            weight: 4,
                        },
                        {
                            filter: {
                                match: {
                                    isPrimary: true,
                                },
                            },
                            weight: 10,
                        },
                        {
                            filter: {
                                match: {
                                    isForeign: true,
                                },
                            },
                            weight: 9,
                        },
                        {
                            filter: {
                                match: {
                                    isPartition: true,
                                },
                            },
                            weight: 8,
                        },
                    ],
                    boost_mode: 'sum',
                    score_mode: 'sum',
                },
            },
        },
        attributes,
        suppressLogs: true,
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
    cancelTokenSource: Ref<any>,
    context: {
        attributeName: string
        attributeValue: string
    }
) {
    refreshBody()
    if (connectorsInfo.schemaName) {
        body.value.dsl.query.function_score.query.bool.filter.bool.must.push({
            term: {
                schemaQualifiedName: `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}/${connectorsInfo.schemaName}`,
            },
        })
    } else if (connectorsInfo.databaseName) {
        body.value.dsl.query.function_score.query.bool.filter.bool.must.push({
            term: {
                databaseQualifiedName: `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}`,
            },
        })
    } else {
        body.value.dsl.query.function_score.query.bool.filter.bool.must.push({
            term: {
                connectionQualifiedName: `${connectorsInfo.connectionQualifiedName}`,
            },
        })
    }

    body.value.dsl.query.function_score.query.bool.filter.bool.must.push({
        regexp: {
            'name.keyword': `${currentWord}.*`,
        },
    })

    switch (type) {
        case 'TABLE': {
            body.value.dsl.query.function_score.query.bool.filter.bool.must.push(
                {
                    terms: {
                        '__typeName.keyword': ['Table', 'View'],
                    },
                }
            )

            if (cancelTokenSource.value !== undefined) {
                cancelTokenSource.value.cancel()
            }
            /* Current Word Should be greater than 1char */
            if (
                currentWord.length > 0 &&
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
                    connectorsInfo,
                    context
                )
                // console.log('connector: ', connectorsInfo)

                return suggestionsPromise
            }

            return getLocalSQLSugggestions(currentWord)
        }
        case 'COLUMN': {
            body.value.dsl.query.function_score.query.bool.filter.bool.must.push(
                {
                    terms: {
                        '__typeName.keyword': ['Column'],
                    },
                }
            )

            if (
                (contextStore.value.left.length > 0 ||
                    contextStore.value.right.length > 0) &&
                connectorsInfo.databaseName &&
                connectorsInfo.schemaName
            ) {
                let tableQualifiedNames = []

                if (contextStore.value.right.length > 0) {
                    tableQualifiedNames = contextStore.value.right.map((e) => {
                        return `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}/${connectorsInfo.schemaName}/${e.name}`
                    }) as any
                }
                if (contextStore.value.left.length > 0) {
                    if (tableQualifiedNames.length > 0) {
                        tableQualifiedNames = [
                            ...tableQualifiedNames,
                            contextStore.value.left.map((e) => {
                                return `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}/${connectorsInfo.schemaName}/${e.name}`
                            }) as any,
                        ] as any
                    } else {
                        tableQualifiedNames = contextStore.value.left.map(
                            (e) => {
                                return `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}/${connectorsInfo.schemaName}/${e.name}`
                            }
                        ) as any
                    }
                }

                body.value.dsl.query.function_score.query.bool.filter.bool.must.push(
                    {
                        terms: {
                            tableQualifiedName: tableQualifiedNames,
                        },
                    }
                )
            }

            if (cancelTokenSource.value !== undefined) {
                cancelTokenSource.value.cancel()
            }
            if (
                currentWord.length > 0 &&
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
                    connectorsInfo,
                    context
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
    // reset Context on every run
    contextStore.value.left = []
    contextStore.value.right = []

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
    const { mappingKeywordsKeys, mappingKeywords, typesKeywordsMap } =
        useMapping()
    const endColumn = changes.range.endColumn
    const endLineNumber = changes.range.endLineNumber

    /* Connectors Info */
    const context = activeInlineTab.value?.playground?.editor?.context
    const attributeValue =
        activeInlineTab.value?.playground?.editor?.context.attributeValue
    const connectionQualifiedName = getConnectionQualifiedName(attributeValue)
    let databaseName = getDatabaseName(attributeValue ?? '')
    let schemaName = getSchemaName(attributeValue ?? '')

    // taking context from sql query if there are no DB |Schema
    const { _schemaName, _databaseName } = getSchemaAndDatabaseFromSqlQueryText(
        editorInstance?.getValue(),
        {
            connectionQualifiedName,
            databaseName,
            schemaName,
        }
    )
    databaseName = _databaseName
    schemaName = _schemaName

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

    ///////////////////////////////////////////////////
    let leftSideStringFromCurPos = editorTextTillCursorPos
        .replace(/\"/g, '')
        .split(/[ ,\n;"')(]+/gm)
    contextStore.value.left = extractTablesFromContext(leftSideStringFromCurPos)

    const editorTextAfterCursorPos = editorText.slice(
        textTillChangedIndex,
        editorText.length
    )

    let rightSideStringFromCurPos = editorTextAfterCursorPos
        .replace(/\"/g, '')
        .split(/[ ,\n;"')(]+/gm)
    contextStore.value.right = extractTablesFromContext(
        rightSideStringFromCurPos
    )

    /////////////////////////////////////////////////////////

    let tokens = editorTextTillCursorPos.split(/[ ,\n;"')(]+/gm)
    // console.log(tokens, 'tokk')
    /* Remove tokens which are special characters */
    tokens = tokens.filter((token) => {
        let t = true
        t = !token.match(/[-[\]{};/\n()*+?'"\\/^$|#\s\t]/g) && token !== ''
        return t
    })
    // tokens.push(' ')
    let currentWord = tokens[tokens.length - 1]
    // TABLE[DOT]  // check if previous is [dot]
    if (currentWord === '.' || currentWord.includes('.')) {
        const dotSplitWord = currentWord.split('.')

        // fetch table columns
        if (tokens.length > 1) {
            const tableName = tokens[tokens.length - 2]
            const type = 'Column'
            refreshBody()
            body.value.dsl.query.function_score.query.bool.filter.bool.must.push(
                {
                    term: {
                        tableQualifiedName: `${connectionQualifiedName}/${databaseName}/${schemaName}/${tableName}`,
                    },
                }
            )
            body.value.dsl.query.function_score.query.bool.filter.bool.must.push(
                {
                    term: {
                        '__typeName.keyword': type,
                    },
                }
            )
            if (dotSplitWord.length > 1) {
                body.value.dsl.query.function_score.query.bool.filter.bool.must.push(
                    {
                        regexp: {
                            'name.keyword': `${dotSplitWord[1]}.*`,
                        },
                    }
                )
            }
            if (cancelTokenSource.value !== undefined) {
                cancelTokenSource.value.cancel()
            }
            cancelTokenSource.value = axios.CancelToken.source()
            const entitiesResponsPromise = Insights.GetAutoSuggestions(
                body,
                cancelTokenSource
            )

            let suggestionsPromise = entitiesToEditorKeyword(
                entitiesResponsPromise,
                type.toUpperCase(),
                currentWord,
                connectorsInfo,
                context,
                true
            )
            // console.log('connector: ', connectorsInfo)

            return suggestionsPromise
        }
    }
    /* If it is a first/nth character of first word */
    if (tokens.length < 2) {
        return getLocalSQLSugggestions(currentWord)
    } else {
        const lastMatchedKeyword:
            | undefined
            | {
                  token: string
                  index: number
                  type: string
                  functionType: string
                  tokenPosition: number
              } = getLastMappedKeyword(
            tokens,
            mappingKeywords,
            mappingKeywordsKeys,
            typesKeywordsMap
        )
        // console.log('inside', lastMatchedKeyword, tokens)
        if (lastMatchedKeyword) {
            switch (lastMatchedKeyword.functionType) {
                case 'FILTER': {
                    if (lastMatchedKeyword.tokenPosition === 0) {
                        return getSuggestionsUsingType(
                            lastMatchedKeyword.type,
                            lastMatchedKeyword.token,
                            currentWord,
                            connectorsInfo,
                            cancelTokenSource,
                            context
                        )
                    } else {
                        const filterKeywords = typesKeywordsMap['FILTER'].values
                        let suggestions = filterKeywords.map((keyword) => {
                            return {
                                label: keyword,
                                kind: monaco.languages.CompletionItemKind
                                    .Keyword,
                                insertText: keyword,
                            }
                        })

                        return Promise.resolve({
                            suggestions: suggestions,
                            incomplete: true,
                        })
                    }
                }
                case 'AGGREGATE': {
                    return new Promise((resolve, reject) => {
                        getSuggestionsUsingType(
                            lastMatchedKeyword.type,
                            lastMatchedKeyword.token,
                            currentWord,
                            connectorsInfo,
                            cancelTokenSource,
                            context
                        ).then((value) => {
                            const filterKeywords =
                                typesKeywordsMap['AGGREGATE'].values
                            let filterKeywordsMap = filterKeywords.map(
                                (keyword) => {
                                    return {
                                        label: keyword,
                                        kind: monaco.languages
                                            .CompletionItemKind.Keyword,
                                        insertText: keyword,
                                    }
                                }
                            )

                            let _suggestions = [
                                ...value.suggestions,
                                ...filterKeywordsMap,
                            ]
                            resolve({
                                suggestions: _suggestions,
                                incomplete: true,
                            })
                        })
                    })
                }
                default: {
                    return getSuggestionsUsingType(
                        lastMatchedKeyword.type,
                        lastMatchedKeyword.token,
                        currentWord,
                        connectorsInfo,
                        cancelTokenSource,
                        context
                    )
                }
            }
        }
    }

    // console.log(suggestions, 'suggestions')
    // console.log(changedText, 'changesTExt')
}
