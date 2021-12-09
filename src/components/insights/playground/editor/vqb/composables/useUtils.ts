export function useUtils() {
    function getTableNameFromTableQualifiedName(tableQualifiedName: string) {
        const vals = tableQualifiedName.split('/')
        if (vals.length > 0) return vals[vals.length - 1]
    }
    function getTableNamesStringFromQualfieidNames(
        tableQualfieidNames: string[]
    ) {
        let res = ''
        if (tableQualfieidNames?.length > 1) res += 'Table(s): '
        else res += 'Table: '
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
