/*
 Copied this from https://github.com/microsoft/monaco-languages/blob/main/src/sql/sql.ts
*/

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as monaco from 'monaco-editor'

export const conf: monaco.languages.LanguageConfiguration = {
    comments: {
        lineComment: '--',
        blockComment: ['/*', '*/'],
    },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
}

export const languageTokens = <monaco.languages.IMonarchLanguage>{
    defaultToken: '',
    tokenPostfix: '.sql',
    ignoreCase: true,

    brackets: [
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
    ],

    keywords: [
        '*',
        'AS',
        'ASC',
        'ASYMMETRIC',
        'AT',
        'BEGIN',
        'BIGINT',
        'BINARY',
        'BIT',
        'BY',
        'CASE',
        'CHAR',
        'DATABASE',
        'DATE',
        'DAY',
        'DECIMAL',
        'DECLARE',
        'DEFAULT',
        'DELETE',
        'DESC',
        'DISTINCT',
        'DOUBLE',
        'DROP',
        'ELSE',
        'EMPTY',
        'ENABLE',
        'END',
        'FALSE',
        'FIRST',
        'FLOAT',
        'FROM',
        'FUNCTION',
        'GET',
        'GLOBAL',
        'GO',
        'GOTO',
        'GRANT',
        'GROUP',
        'HAVING',
        'IDENTITY',
        'IMMEDIATE',
        'INDEX',
        'INSENSITIVE',
        'INSERT',
        'INSTEAD',
        'INT',
        'INTEGER',
        'INTO',
        'ISOLATION',
        'KEY',
        'LAST',
        'LIMIT',
        'LOAD',
        'LOCAL',
        'MAXVALUE',
        'MEMBER',
        'MERGE',
        'MINUTE',
        'MINVALUE',
        'MONTH',
        'MOVE',
        'NAME',
        'NCHAR',
        'NEXT',
        'NO',
        'NONE',
        'NUMERIC',
        'OBJECT',
        'OF',
        'OFF',
        'OFFSET',
        'ON',
        'ONLY',
        'ORDER',
        'OWNER',
        'PARTIAL',
        'PARTITION',
        'PASSWORD',
        'PATH',
        'PRECEDING',
        'PRECISION',
        'PRIMARY',
        'PRIOR',
        'RANGE',
        'REAL',
        'REFERENCES',
        'RETURN',
        'RETURNS',
        'REVOKE',
        'ROLE',
        'ROLLBACK',
        'ROLLUP',
        'ROW',
        'ROWS',
        'SELECT',
        'SET',
        'SETS',
        'SIZE',
        'SKIP',
        'SMALLINT',
        'SYMMETRIC',
        'TABLE',
        'TEXT',
        'THEN',
        'TIES',
        'TINYINT',
        'TIME',
        'TIMESTAMP',
        'TO',
        'TRIGGER',
        'TRUE',
        'TRUNCATE',
        'TYPE',
        'UNBOUNDED',
        'UNCOMMITTED',
        'UNIQUE',
        'UPDATE',
        'USING',
        'VARCHAR',
        'VERSION',
        'WHEN',
        'WHERE',
        'WITH',
        'WITHIN',
        'WITHOUT',
        'WORK',
        'YEAR',
    ],
    operators: [
        // Logical
        'ALL',
        'AND',
        'ANY',
        'BETWEEN',
        'EXISTS',
        'IN',
        'LIKE',
        'NOT',
        'OR',
        'SOME',
        // Set
        'EXCEPT',
        'INTERSECT',
        'UNION',
        // Join
        'APPLY',
        'CROSS',
        'FULL',
        'INNER',
        'JOIN',
        'LEFT',
        'OUTER',
        'RIGHT',
        // Predicates
        'CONTAINS',
        'FREETEXT',
        'IS',
        'NULL',
        // Pivoting
        'PIVOT',
        'UNPIVOT',
        // Merging
        'MATCHED',
    ],
    builtinFunctions: [
        // Aggregate
        'AVG',
        'COUNT',
        'GROUPING',
        'MAX',
        'MIN',
        'SUM',

        // Analytic
        'CUME_DIST',
        'FIRST_VALUE',
        'LAG',
        'LAST_VALUE',
        'LEAD',
        'PERCENTILE_CONT',
        'PERCENTILE_DISC',
        'PERCENT_RANK',

        // Collation
        'COLLATE',
        'CAST',
        'CONVERT',

        // Datatype
        'DATALENGTH',
        'IDENT_CURRENT',
        'IDENT_INCR',
        'IDENT_SEED',
        'IDENTITY',
        'SQL_VARIANT_PROPERTY',

        // Datetime
        'CURRENT_TIMESTAMP',
        'DATEADD',
        'DATEDIFF',
        'DATEFROMPARTS',
        'DATENAME',
        'DATEPART',
        'DATETIME2FROMPARTS',
        'DATETIMEFROMPARTS',
        'DATETIMEOFFSETFROMPARTS',
        'DAY',
        'EOMONTH',
        'GETDATE',
        'GETUTCDATE',
        'ISDATE',
        'MONTH',
        'SMALLDATETIMEFROMPARTS',
        'SWITCHOFFSET',
        'SYSDATETIME',
        'SYSDATETIMEOFFSET',
        'SYSUTCDATETIME',
        'TIMEFROMPARTS',
        'TODATETIMEOFFSET',
        'YEAR',

        // Logical
        'CHOOSE',
        'COALESCE',
        'IIF',
        'NULLIF',

        // Mathematical
        'ABS',
        'ACOS',
        'ASIN',
        'ATAN',
        'ATN2',
        'CEILING',
        'COS',
        'COT',
        'DEGREES',
        'EXP',
        'FLOOR',
        'LOG',
        'LOG10',
        'PI',
        'POWER',
        'RADIANS',
        'RAND',
        'ROUND',
        'SIGN',
        'SIN',
        'SQRT',
        'SQUARE',
        'TAN',

        // Ranking
        'DENSE_RANK',
        'NTILE',
        'RANK',
        'ROW_NUMBER',

        // String
        'ASCII',
        'CHAR',
        'CHARINDEX',
        'CONCAT',
        'DIFFERENCE',
        'FORMAT',
        'LEFT',
        'LEN',
        'LOWER',
        'LTRIM',
        'NCHAR',
        'PATINDEX',
        'QUOTENAME',
        'REPLACE',
        'REPLICATE',
        'REVERSE',
        'RIGHT',
        'RTRIM',
        'SOUNDEX',
        'SPACE',
        'STR',
        'STUFF',
        'SUBSTRING',
        'UNICODE',
        'UPPER',

        // System
        'ISNULL',
        'ISNUMERIC',
    ],
    builtinVariables: [],
    pseudoColumns: ['$ACTION', '$IDENTITY', '$ROWGUID', '$PARTITION'],
    tokenizer: {
        root: [
            { include: '@comments' },
            { include: '@whitespace' },
            { include: '@pseudoColumns' },
            { include: '@numbers' },
            { include: '@strings' },
            { include: '@complexIdentifiers' },
            { include: '@scopes' },
            [/[;,.]/, 'delimiter'],
            [/[()]/, '@brackets'],
            [
                /({{)([\w\-]+)/,
                ['mustache', { token: 'tag', next: '@mustache' }],
            ],
            [
                /[\w@#$]+/,
                {
                    cases: {
                        '@keywords': 'keyword',
                        '@operators': 'operator',
                        '@builtinVariables': 'predefined',
                        '@builtinFunctions': 'predefined',
                        '@default': 'identifier',
                    },
                },
            ],
            [/[<>=!%&+\-*/|~^]/, 'operator'],
        ],
        whitespace: [[/\s+/, 'white']],
        comments: [
            [/--+.*/, 'comment'],
            [/\/\*/, { token: 'comment.quote', next: '@comment' }],
        ],
        comment: [
            [/[^*/]+/, 'comment'],
            // Not supporting nested comments, as nested comments seem to not be standard?
            // i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
            // [/\/\*/, { token: 'comment.quote', next: '@push' }],    // nested comment not allowed :-(
            [/\*\//, { token: 'comment.quote', next: '@pop' }],
            [/./, 'comment'],
        ],
        pseudoColumns: [
            [
                /[$][A-Za-z_][\w@#$]*/,
                {
                    cases: {
                        '@pseudoColumns': 'predefined',
                        '@default': 'identifier',
                    },
                },
            ],
        ],
        numbers: [
            [/0[xX][0-9a-fA-F]*/, 'number'],
            [/[$][+-]*\d*(\.\d*)?/, 'number'],
            [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number'],
        ],
        strings: [
            [/N'/, { token: 'string', next: '@string' }],
            [/'/, { token: 'string', next: '@string' }],
        ],
        string: [
            [/[^']+/, 'string'],
            [/''/, 'string'],
            [/'/, { token: 'string', next: '@pop' }],
        ],
        complexIdentifiers: [
            [/\[/, { token: 'identifier.quote', next: '@bracketedIdentifier' }],
            [/"/, { token: 'identifier.quote', next: '@quotedIdentifier' }],
        ],
        bracketedIdentifier: [
            [/[^\]]+/, 'identifier'],
            [/]]/, 'identifier'],
            [/]/, { token: 'identifier.quote', next: '@pop' }],
        ],
        quotedIdentifier: [
            [/[^"]+/, 'identifier'],
            [/""/, 'identifier'],
            [/"/, { token: 'identifier.quote', next: '@pop' }],
        ],
        scopes: [
            [/BEGIN\s+(DISTRIBUTED\s+)?TRAN(SACTION)?\b/i, 'keyword'],
            [/BEGIN\s+TRY\b/i, { token: 'keyword.try' }],
            [/END\s+TRY\b/i, { token: 'keyword.try' }],
            [/BEGIN\s+CATCH\b/i, { token: 'keyword.catch' }],
            [/END\s+CATCH\b/i, { token: 'keyword.catch' }],
            [/(BEGIN|CASE)\b/i, { token: 'keyword.block' }],
            [/END\b/i, { token: 'keyword.block' }],
            [/WHEN\b/i, { token: 'keyword.choice' }],
            [/THEN\b/i, { token: 'keyword.choice' }],
        ],
        mustache: [
            [/"([^"]*)"/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/:/, 'delimiter'],
            [/,/, 'delimiter'],
            [/}}/, 'mustache', '@pop'],
        ],
    },
}
