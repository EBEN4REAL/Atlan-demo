export const mappingKeywords = {
    SELECT: 'COLUMN',
    WHERE: 'COLUMN',
    FROM: 'TABLE',
}

export function useMapping() {
    const mappingKeywordsKeys = Object.keys(mappingKeywords)
    return {
        mappingKeywordsKeys,
        mappingKeywords,
    }
}
