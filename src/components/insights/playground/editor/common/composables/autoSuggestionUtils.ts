import {
    mappingKeywords,
    mappingKeywordsKeys,
    typesKeywordsMap,
} from './useMapping'
import { instances } from '~/components/insights/playground/editor/monaco/useMonaco'
import { getLastMappedKeyword } from './useAutoSuggestions'
import { contextStore } from './useMapping'
export type contextKeywordType = {
    name: string
    type: 'TABLE' | 'COLUMN'
    pos: {
        endColumn: number
        endLineNumber: number
        startColumn: number
        startLineNumber: number
    }
}
export function extractTablesFromContext(
    tokens: string[]
): Array<contextKeywordType> {
    const tokensPosMap = []
    tokens.forEach((token, i) => {
        if (
            Object.keys(mappingKeywords).includes(token.toLocaleUpperCase()) &&
            mappingKeywords[token.toLocaleUpperCase()] === 'TABLE' &&
            i + 1 < tokens.length
        ) {
            const _matches = instances.editor?.getModel()?.findMatches(token)
            if (_matches.length > 0) {
                // if there dot notation
                let tableName = tokens[i + 1]
                if (tokens[i + 1].split('.').length >= 2) {
                    let _temp = tokens[i + 1].split('.').filter((e) => e !== '')
                    tableName = _temp[_temp.length - 1]
                }
                // take first match always
                tokensPosMap.push({
                    name: tableName, // take the next token
                    type: 'TABLE',
                    pos: {
                        ..._matches[0]?.range,
                        // endColumn: 3
                        // endLineNumber: 1
                        // startColumn: 1
                        // startLineNumber: 1
                    },
                })
            }
        }
    })
    return tokensPosMap
}

export function getSchemaAndDatabaseFromSqlQueryText(
    sqlText: string,
    connectorsInfo: {
        connectionQualifiedName: string | undefined
        databaseName: string | undefined
        schemaName: string | undefined
    }
) {
    let databaseName = connectorsInfo.databaseName,
        schemaName = connectorsInfo.schemaName
    const sqlTextTokens = sqlText.replace(/\"/g, '').split(/[ ;]+/)
    sqlTextTokens.forEach((token) => {
        const _spliitedToken = token.split('.')
        const contexts = [
            ...contextStore.value.left,
            ...contextStore.value.right,
        ]
        if (!schemaName && _spliitedToken.length == 2) {
            contexts.forEach((context) => {
                if (
                    context.name?.toUpperCase() ===
                        _spliitedToken[
                            _spliitedToken.length - 1
                        ]?.toUpperCase() &&
                    context.type === 'TABLE'
                ) {
                    schemaName = _spliitedToken[0].replaceAll('^"|"$', '')
                }
            })
        } else if (!databaseName && _spliitedToken.length == 3) {
            contexts.forEach((context) => {
                if (
                    context.name?.toUpperCase() ===
                        _spliitedToken[
                            _spliitedToken.length - 1
                        ]?.toUpperCase() &&
                    context.type === 'TABLE'
                ) {
                    databaseName = _spliitedToken[0].replaceAll('^"|"$', '')
                    schemaName = _spliitedToken[1].replaceAll('^"|"$', '')
                }
            })
        }
    })
    return {
        _databaseName: databaseName,
        _schemaName: schemaName,
    }
}

export function createAliasesMap(text: string) {
    const aliasMap = {}
    for (let i = 0; i < text.length - 4; i++) {
        if (
            `${text[i]}${text[i + 1]}${text[i + 2]}${
                text[i + 3]
            }`.toUpperCase() === ' AS '
        ) {
            // check for table
            const leftTexts = text
                .slice(0, i + 1)
                .split(/[,; ]/)
                .filter((e) => e !== '' && e !== ';' && e !== ',')
                .map((e) => e.replace(/\"/g, ''))
            const rightTexts = text
                .slice(i + 4, text.length)
                .split(/[,; ]/)
                .filter((e) => e !== '' && e !== ';' && e !== ',')
                .map((e) => e.replace(/\"/g, ''))
            let key, value
            if (leftTexts.length > 0 && rightTexts.length > 0) {
                const lastMatchedKeyword = getLastMappedKeyword(
                    leftTexts,
                    mappingKeywords,
                    mappingKeywordsKeys,
                    typesKeywordsMap
                )
                // INCASE there is DB.SCHEMA.TABLE
                let _lefttext = leftTexts.reverse()[0]
                if (_lefttext.includes('.')) {
                    const _temp = _lefttext.split('.')
                    // taking the end
                    if (_temp[_temp.length - 1] !== '.') {
                        _lefttext = _temp[_temp.length - 1]
                    }
                }
                key = _lefttext.replace(/[&\/\\#,+()~%.:*?<>{}\n\s]/g, '')
                value = rightTexts[0].replace(/[&\/\\#,+()~%.:*?<>{}\n\s]/g, '')
                aliasMap[key] = {
                    key: key,
                    value: value,
                    type: lastMatchedKeyword?.type ?? 'GENERIC',
                }
            }
            i = i + 4
        }
    }
    return aliasMap
}
