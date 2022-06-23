import { unref, ref, Ref } from 'vue'
import getSqlKeywords from '~/components/insights/playground/editor/monaco/sqlKeywords'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useMapping, nextKeywords, getAllMappedKeywords } from './useMapping'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { triggerCharacters } from '~/components/insights/playground/editor/monaco/triggerCharacters'
import { getDialectInfo } from '~/components/insights/common/composables/getDialectInfo'
import { capitalizeFirstLetter } from '~/utils/string'
import {
    getSnippetKeywords,
    createAliasesMap,
    extractTablesFromContext,
    getSchemaAndDatabaseFromSqlQueryText,
} from './autoSuggestionUtils'
import { contextStore, aliasesMap } from './useMapping'

// import HEKA_SERVICE_API from '~/services/heka/index'
import { Insights } from '~/services/sql/query'
import {
    autosuggestionEntityColumn,
    autosuggestionResponse,
} from '~/types/insights/autosuggestionEntity.interface'
import axios from 'axios'
import { getEntityMetadataUsingQualifiedName } from './autoSuggestionUtils'
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

// for moving the preference based suggestions to the top
function sortByContextQualifiedNames(entities: any[]) {
    const _obj =
        body.value.dsl.query.function_score.query.bool.filter.bool.should[0]
            ?.terms
    if (_obj?.tableQualifiedName?.length > 0 && entities?.length > 0) {
        entities.forEach((entity, index) => {
            if (entity.attributes.qualifiedName) {
                _obj?.tableQualifiedName?.forEach((tableQualifiedName) => {
                    if (
                        entity.attributes.qualifiedName.includes(
                            tableQualifiedName
                        )
                    ) {
                        const _t = entities.splice(index, 1)
                        entities.unshift(_t[0])
                    }
                })
            }
        })
    }
    return entities
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
    isDotBased: boolean = false, // wether to include table with column or not T.C,
    kind: number = 3
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
    return new Promise((resolve) => {
        response.then((res) => {
            let entities = res.entities ?? []
            // entities = sortByContextQualifiedNames(entities)

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
                        //
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
                            kind:
                                kind ||
                                monaco.languages.CompletionItemKind.Field,
                            documentation: {
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
                            kind:
                                kind ||
                                monaco.languages.CompletionItemKind.Field,
                            documentation: {
                                entity: entities[i],
                            },
                            sortText: sortString,
                            // insertText: isDotBased
                            //     ? `${assetQuoteType}${entities[i].attributes.name}${assetQuoteType}`
                            //     : `${contextPrefix}${assetQuoteType}${tableName}${assetQuoteType}.${assetQuoteType}${entities[i].attributes.name}${assetQuoteType}`,
                            insertText: `${assetQuoteType}${entities[i].attributes.name}${assetQuoteType}`,
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

function getLocalSQLSugggestions(currWrd: string, withPromise = true) {
    let currentWord = currWrd?.toUpperCase()
    const sqlKeywords = getSqlKeywords()
    let suggestions = sqlKeywords.filter((keyword) =>
        keyword.label.includes(currentWord?.toUpperCase())
    )
    const snippetWords = getSnippetKeywords()
    snippetWords.forEach((snippetWord) => {
        if (
            snippetWord.word.toUpperCase().includes(currentWord.toUpperCase())
        ) {
            suggestions = [
                ...suggestions,
                {
                    label: `${capitalizeFirstLetter(snippetWord.word)} snippet`,
                    kind: 'snippet',
                    insertText: snippetWord.text,
                    selectionColumnStart: snippetWord.selectionColumnStart,
                    selectionColumnEnd: snippetWord.selectionColumnEnd,
                },
            ]
        }
    })
    if (!withPromise) return suggestions

    return Promise.resolve({
        suggestions: suggestions,
        incomplete: true,
    })
}
function getLocalSnippetSugggestions(currWrd: string, withPromise = true) {
    let currentWord = currWrd?.toUpperCase()
    const snippetWords = getSnippetKeywords()
    let suggestions = []
    snippetWords.forEach((snippetWord) => {
        if (
            snippetWord.word.toUpperCase().includes(currentWord.toUpperCase())
        ) {
            suggestions = [
                ...suggestions,
                {
                    label: `${capitalizeFirstLetter(snippetWord.word)} snippet`,
                    kind: 'snippet',
                    insertText: snippetWord.text,
                    selectionColumnStart: snippetWord.selectionColumnStart,
                    selectionColumnEnd: snippetWord.selectionColumnEnd,
                },
            ]
        }
    })
    if (!withPromise) return suggestions

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
    'sizeBytes',
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
    'updatedBy',
    'updatedAt',
    '__guid',
    'qualifiedName',
    'connectionName',
    'announcementMessage',
    'announcementTitle',
    'announcementType',
    'announcementUpdatedAt',
    'announcementUpdatedBy',
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

function inlcudeQualifiedNameAccType(
    body,
    qualifiedNames,
    type: 'tableQualifiedName' | 'viewQualifiedName'
) {
    body.value.dsl.query.function_score.query.bool.filter.bool.must.push({
        terms: {
            [type]: qualifiedNames,
        },
    })

    // function_score boost
    qualifiedNames.forEach((tableQualifiedName) => {
        body.value.dsl.query.function_score.functions.push({
            filter: {
                match: {
                    [type]: tableQualifiedName,
                },
            },
            weight: 15,
        })
    })
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
    },
    kind: number = 3
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
    // body.value.dsl.query('match', 'name.keyword', {
    //     query: query,
    //     boost: 120,
    // })
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
                    context,
                    false,
                    kind
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
                    tableQualifiedNames = contextStore.value.right
                        .filter(
                            (e) =>
                                !getAllMappedKeywords().includes(
                                    e.name.toUpperCase()
                                )
                        )
                        .map((e) => {
                            return `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}/${connectorsInfo.schemaName}/${e.name}`
                        }) as any
                }
                if (contextStore.value.left.length > 0) {
                    if (tableQualifiedNames.length > 0) {
                        tableQualifiedNames = [
                            ...tableQualifiedNames,
                            contextStore.value.left
                                .filter(
                                    (e) =>
                                        !getAllMappedKeywords().includes(
                                            e.name.toUpperCase()
                                        )
                                )
                                .map((e) => {
                                    return `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}/${connectorsInfo.schemaName}/${e.name}`
                                }) as any,
                        ] as any
                    } else {
                        tableQualifiedNames = contextStore.value.left
                            .filter(
                                (e) =>
                                    !getAllMappedKeywords().includes(
                                        e.name.toUpperCase()
                                    )
                            )
                            .map((e) => {
                                return `${connectorsInfo.connectionQualifiedName}/${connectorsInfo.databaseName}/${connectorsInfo.schemaName}/${e.name}`
                            }) as any
                    }
                }
                const _tableQualifiedNames = tableQualifiedNames.filter(
                    (e) => typeof e === 'string'
                )
                // seprate view QualifiedName & tableQualifiedName
                // taking the first el as refernce for fetching the columns, to prevent multiple network req
                if (_tableQualifiedNames.length) {
                    const entities = await getEntityMetadataUsingQualifiedName(
                        _tableQualifiedNames[0]
                    )
                    if (entities?.entities.length > 0) {
                        const entity = entities?.entities[0]
                        if (entity?.typeName?.toLowerCase() === 'table') {
                            inlcudeQualifiedNameAccType(
                                body,
                                _tableQualifiedNames,
                                'tableQualifiedName'
                            )
                        } else {
                            inlcudeQualifiedNameAccType(
                                body,
                                _tableQualifiedNames,
                                'viewQualifiedName'
                            )
                        }
                    }
                }
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
                    context,
                    false,
                    kind
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

function getAliasStructure(keyword: any) {
    return {
        label: keyword,
        kind: 'alias',
        insertText: keyword,
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

    /////////////ALIASES/////////////////

    aliasesMap.value = createAliasesMap(editorText)
    // trimming [dot]s if any
    const _tempTokens = editorTextTillCursorPos
        .split(/[\n ]+/)
        .filter((e) => e !== '')
    let currAliasWord = _tempTokens[_tempTokens.length - 1]
    let _currWord = currAliasWord,
        lastIndex = -1
    if (_currWord.length > 1) {
        for (let i = _currWord.length - 2; i >= 0; i--) {
            if (
                _currWord[i] === _currWord[_currWord.length - 1] &&
                _currWord[_currWord.length - 1] === '.'
            ) {
                lastIndex = i
            } else {
                break
            }
        }
    }
    if (lastIndex > 0) {
        currAliasWord = currAliasWord.slice(0, lastIndex + 1)
    } else if (currAliasWord.includes('.')) {
        // trim x., x.cccc
        let tokens = currAliasWord.split('')
        const _index = tokens.findIndex((token) => token === '.')
        currAliasWord = currAliasWord.slice(0, _index)
    }

    /////////////////////////////////////

    let subquery = false,
        subqueryStartIndex = -1,
        subQueryEndIndex = -1

    // check if it is a subquery
    // for left side
    for (let i = editorText.length; i >= 0; i--) {
        if (editorText[i] === '(') {
            subqueryStartIndex = i
            if (i + 1 < editorText.length)
                for (let j = i + 1; j < editorText.length; j++) {
                    if (editorText[j] === ')') {
                        subquery = true
                        subQueryEndIndex = j
                        break
                    }
                }
        }
    }
    // debugger
    if (subquery) {
        ///////////////////////////////////////////////////////////
        let subQueryleftSideStringFromCurPos = editorText
            .slice(subqueryStartIndex, textTillChangedIndex + 1)
            .replace(/\"/g, '')
            .split(/[ ,\n;"')(]+/gm)
        contextStore.value.left = extractTablesFromContext(
            subQueryleftSideStringFromCurPos
        ).filter((el) => el.name !== '')

        let subQueryrightSideStringFromCurPos = editorText
            .slice(textTillChangedIndex, subQueryEndIndex + 1)
            .replace(/\"/g, '')
            .split(/[ ,\n;"')(]+/gm)
        contextStore.value.right = extractTablesFromContext(
            subQueryrightSideStringFromCurPos
        ).filter((el) => el.name !== '')

        //////////////////////////////////////////////
    }

    ///////////////////////////////////////////////////
    // removing subqueries if present
    function removeSubQueries(str: string) {
        let _str = str
        // removing () -> content
        if (_str.match(/\((.*)\)/gm) !== null) {
            _str.match(/\((.*)\)/gm).forEach((el) => {
                _str = _str.replace(el, '')
            })
        }
        // removing single bracket content
        if (_str.match(/\((.*)/gm) !== null) {
            _str.match(/\((.*)/gm).forEach((el) => {
                _str = _str.replace(el, '')
            })
        }
        return _str
    }
    // debugger

    let leftSideStringFromCurPos = removeSubQueries(
        editorTextTillCursorPos.replace(/\"/g, '')
    ).split(/[ ,\n;"')(]+/gm)
    contextStore.value.left = [
        ...contextStore.value.left,
        ...extractTablesFromContext(leftSideStringFromCurPos),
    ].filter((el) => el.name !== '')

    const editorTextAfterCursorPos = editorText.slice(
        textTillChangedIndex,
        editorText.length
    )

    let rightSideStringFromCurPos = removeSubQueries(
        editorTextAfterCursorPos.replace(/\"/g, '')
    ).split(/[ ,\n;"')(]+/gm)
    contextStore.value.right = extractTablesFromContext(
        rightSideStringFromCurPos
    ).filter((el) => el.name !== '')

    /////////////////////////////////////////////////////////
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
    connectorsInfo.databaseName = _databaseName
    connectorsInfo.schemaName = _schemaName

    let tokens = editorTextTillCursorPos.split(/[ ,\n;"')(]+/gm)
    // console.log(tokens, 'tokk')
    /* Remove tokens which are special characters */
    tokens = tokens.filter((token) => {
        let t = true
        t = !token.match(/[-[\]{};/\n()*+?'"\\/^$|#\s\t]/g) && token !== ''
        return t
    })
    // debugger
    // tokens.push(' ')
    let exceptionCase = false // when used as "table"."columnName"
    let currentWord = tokens[tokens.length - 1]

    let previousWord
    if (tokens.length > 1) previousWord = tokens[tokens.length - 2]
    if (previousWord === '.') {
        contextStore.value.left.forEach((context) => {
            if (
                tokens.length > 2 &&
                context.name === tokens[tokens.length - 3]
            ) {
                exceptionCase = true
            }
        })
        tokens.splice(tokens.length - 2, 2, `.${currentWord}`)
        currentWord = `.${currentWord}`
    }

    // TABLE[DOT]  // check if previous is [dot]
    if (currentWord === '.' || currentWord.includes('.')) {
        let aliasMode = false
        const dotSplitWord = currentWord.split('.')

        // fetch table columns
        if (tokens.length > 1) {
            let tableName = tokens[tokens.length - 2]
            // if it is a alias
            Object.keys(aliasesMap.value).forEach((key) => {
                if (aliasesMap.value[key].value === currAliasWord) {
                    tableName = key
                    aliasMode = true
                }
            })

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
            if (dotSplitWord.length > 1 && dotSplitWord[1].length > 0) {
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
                        const suggestionsPromise = getSuggestionsUsingType(
                            lastMatchedKeyword.type,
                            lastMatchedKeyword.token,
                            currentWord,
                            connectorsInfo,
                            cancelTokenSource,
                            context
                        )

                        return new Promise((resolve, reject) => {
                            suggestionsPromise.then((value) => {
                                const AliasesKeys: string[] = []
                                Object.keys(aliasesMap.value).forEach(
                                    (key: any) => {
                                        AliasesKeys.push(
                                            aliasesMap.value[key]
                                                .value as string
                                        )
                                    }
                                )
                                let AliasesKeywordsMap = AliasesKeys.map(
                                    (keyword) => {
                                        return getAliasStructure(keyword)
                                    }
                                )
                                let _suggestions = [
                                    ...value.suggestions,
                                    ...AliasesKeywordsMap,
                                ]
                                const localSuggestions =
                                    getLocalSnippetSugggestions(
                                        currentWord,
                                        false
                                    )

                                _suggestions = [
                                    ..._suggestions,
                                    ...localSuggestions,
                                ]

                                resolve({
                                    suggestions: _suggestions,
                                    incomplete: true,
                                })
                            })
                        })
                    } else {
                        const suggestionsPromise = getSuggestionsUsingType(
                            lastMatchedKeyword.type,
                            lastMatchedKeyword.token,
                            currentWord,
                            connectorsInfo,
                            cancelTokenSource,
                            context
                        )

                        return new Promise((resolve, reject) => {
                            suggestionsPromise.then((value) => {
                                const filterKeywords =
                                    typesKeywordsMap['FILTER'].values
                                let suggestions = filterKeywords.map(
                                    (keyword) => {
                                        return {
                                            label: keyword,
                                            kind: monaco.languages
                                                .CompletionItemKind.Function,
                                            insertText: keyword,
                                        }
                                    }
                                )

                                ///////////////////////////

                                const AliasesKeys: string[] = []
                                Object.keys(aliasesMap.value).forEach(
                                    (key: any) => {
                                        AliasesKeys.push(
                                            aliasesMap.value[key]
                                                .value as string
                                        )
                                    }
                                )
                                let AliasesKeywordsMap = AliasesKeys.map(
                                    (keyword) => {
                                        return getAliasStructure(keyword)
                                    }
                                )

                                let _suggestions = [
                                    ...value.suggestions,
                                    ...suggestions,
                                    ...AliasesKeywordsMap,
                                ]
                                const localSuggestions =
                                    getLocalSnippetSugggestions(
                                        currentWord,
                                        false
                                    )

                                _suggestions = [
                                    ..._suggestions,
                                    ...localSuggestions,
                                ]

                                resolve({
                                    suggestions: _suggestions,
                                    incomplete: true,
                                })
                            })
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
                                            .CompletionItemKind.Function,
                                        insertText: `${keyword}()`,
                                    }
                                }
                            )

                            const AliasesKeys: string[] = []
                            Object.keys(aliasesMap.value).forEach(
                                (key: any) => {
                                    AliasesKeys.push(
                                        aliasesMap.value[key].value as string
                                    )
                                }
                            )
                            let AliasesKeywordsMap = AliasesKeys.map(
                                (keyword) => {
                                    return getAliasStructure(keyword)
                                }
                            )

                            let _suggestions = [
                                ...value.suggestions,
                                ...filterKeywordsMap,
                                ...AliasesKeywordsMap,
                            ]
                            const localSuggestions =
                                getLocalSnippetSugggestions(currentWord, false)

                            _suggestions = [
                                ..._suggestions,
                                ...localSuggestions,
                            ]
                            resolve({
                                suggestions: _suggestions,
                                incomplete: true,
                            })
                        })
                    })
                }
                default: {
                    const suggestionsPromise = getSuggestionsUsingType(
                        lastMatchedKeyword.type,
                        lastMatchedKeyword.token,
                        currentWord,
                        connectorsInfo,
                        cancelTokenSource,
                        context
                    )
                    return new Promise((resolve, reject) => {
                        suggestionsPromise.then((value) => {
                            // debugger
                            const AliasesKeys: string[] = []
                            Object.keys(aliasesMap.value).forEach(
                                (key: any) => {
                                    AliasesKeys.push(
                                        aliasesMap.value[key].value as string
                                    )
                                }
                            )
                            let AliasesKeywordsMap = AliasesKeys.map(
                                (keyword) => {
                                    return getAliasStructure(keyword)
                                }
                            )

                            let _suggestions = [
                                ...value.suggestions,
                                ...AliasesKeywordsMap,
                            ]
                            resolve({
                                suggestions: _suggestions,
                                incomplete: true,
                            })
                        })
                    })
                }
            }
        }
    }

    // console.log(suggestions, 'suggestions')
    // console.log(changedText, 'changesTExt')
}
