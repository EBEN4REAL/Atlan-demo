export function useUtils() {
    function getTableNameFromTableQualifiedName(tableQualifiedName: string) {
        const vals = tableQualifiedName?.split('/')
        if (vals?.length > 0) return vals[vals?.length - 1]
        else return ''
    }
    function getTableNamesStringFromQualfieidNames(
        tableQualfieidNames: string[]
    ) {
        let res = ''
        if (tableQualfieidNames?.length > 1) res += 'Table(s): '
        else if (tableQualfieidNames?.length === 0) res += 'Table: '
        else res += 'No Table'
        res += tableQualfieidNames
            .map((e) => getTableNameFromTableQualifiedName(e))
            .join(',')
        return res
    }

    return {
        getTableNameFromTableQualifiedName,
        getTableNamesStringFromQualfieidNames,
    }
}
