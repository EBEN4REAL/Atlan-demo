export const mappingKeywords = {
    SELECT: 'COLUMN',
    WHERE: 'COLUMN',
    BY: 'COLUMN',
    ON: 'COLUMN',
    OR: 'COLUMN',
    NOT: 'COLUMN',
    AND: 'COLUMN',
    SET: 'COLUMN',
    DISTINCT: 'COLUMN',
    FROM: 'TABLE',
    DELETE: ['TABLE', 'NEXT_KEYWORD'],
    UPDATE: ['TABLE', 'NEXT_KEYWORD'],
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
export function useMapping() {
    const mappingKeywordsKeys = Object.keys(mappingKeywords)
    return {
        mappingKeywordsKeys,
        mappingKeywords,
    }
}
