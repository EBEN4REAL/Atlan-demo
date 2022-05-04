import { ref, Ref } from 'vue'
import { contextKeywordType } from './autoSuggestionUtils'
export const mappingKeywords = {
    SELECT: 'COLUMN',
    WHERE: 'COLUMN',
    BY: 'COLUMN',
    ON: 'COLUMN',
    OR: 'COLUMN',
    AND: 'COLUMN',
    SET: 'COLUMN',
    DISTINCT: 'COLUMN',
    FROM: 'TABLE',
    DELETE: 'NEXT_KEYWORD',
    UPDATE: 'NEXT_KEYWORD',
    INTO: 'TABLE',
    JOIN: 'TABLE',
    LEFT: 'NEXT_KEYWORD',
    RIGHT: 'NEXT_KEYWORD',
    GROUP: 'NEXT_KEYWORD',
    ORDER: 'NEXT_KEYWORD',
    FULL: 'NEXT_KEYWORD',
    SELF: 'NEXT_KEYWORD',
    UNION: 'NEXT_KEYWORD',
    HAVING: 'NEXT_KEYWORD',
}
export const nextKeywords = {
    DELETE: ['JOIN'],
    UPDATE: ['JOIN'],
    LEFT: ['JOIN'],
    RIGHT: ['JOIN'],
    GROUP: ['BY'],
    ORDER: ['BY'],
    FULL: ['JOIN'],
    SELF: ['JOIN'],
    UNION: ['SELECT'],
    HAVING: ['COUNT'],
}
export const typesKeywordsMap = {
    FILTER: {
        values: ['BETWEEN', 'LIKE', 'IN', 'IS', 'IS NULL', 'NULL', 'NOT', 'IN'],
        trigger: ['WHERE'],
    },
    AGGREGATE: {
        values: ['SUM', 'COUNT', 'MAX', 'MIN', 'AVERAGE'],
        trigger: ['SELECT'],
    },
}

export const contextStore = ref({
    left: [],
    right: [],
}) as Ref<{ left: contextKeywordType[]; right: contextKeywordType[] }>

export const aliasesMap = ref({})
export const mappingKeywordsKeys = Object.keys(mappingKeywords)
export function useMapping() {
    const mappingKeywordsKeys = Object.keys(mappingKeywords)
    return {
        typesKeywordsMap,
        mappingKeywordsKeys,
        mappingKeywords,
    }
}
