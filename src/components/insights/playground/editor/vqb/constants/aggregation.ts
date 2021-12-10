export const aggregatedAliasMap = {
    COUNT: (columnName) => {
        return `count_${columnName}`
    },
    AVG: (columnName) => {
        return `avg_${columnName}`
    },
    SUM: (columnName) => {
        return `sum_${columnName}`
    },
    MIN: (columnName) => {
        return `min_${columnName}`
    },
    MAX: (columnName) => {
        return `max_${columnName}`
    },
    UNIQUE: (columnName) => {
        return `unique_${columnName}`
    },
}
