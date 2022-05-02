import { mappingKeywords } from './useMapping'
import { instances } from '~/components/insights/playground/editor/monaco/useMonaco'
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
            Object.keys(mappingKeywords).includes(token) &&
            mappingKeywords[token] === 'TABLE' &&
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
        if (!databaseName && _spliitedToken.length >= 3) {
            //D.S.T
            databaseName = _spliitedToken[0].replaceAll('^"|"$', '')
            schemaName = _spliitedToken[1].replaceAll('^"|"$', '')
        } else if (!schemaName && _spliitedToken.length == 2) {
            //S.T
            schemaName = _spliitedToken[0].replaceAll('^"|"$', '')
        }
    })
    return {
        _databaseName: databaseName,
        _schemaName: schemaName,
    }
}
