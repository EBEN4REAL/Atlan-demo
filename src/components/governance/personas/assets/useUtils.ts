import { capitalizeFirstLetter } from '~/utils/string'

export function useUtils() {
    function getExpandedKeysFromConnectionQualifiedName(
        connectionQualifiedNames: string[]
    ) {
        const keys = new Set()
        connectionQualifiedNames.forEach((connectionQualifiedName) => {
            const intercepts = connectionQualifiedName?.split('/')
            if (intercepts.length == 3) {
                // connection
            } else if (intercepts.length == 4) {
                // database
            } else if (intercepts.length == 5) {
                // schema
                const databaseKey = `${intercepts[0]}/${intercepts[1]}/${intercepts[2]}/${intercepts[3]}`
                keys.add(databaseKey)
            } else if (intercepts.length == 6) {
                const databaseKey = `${intercepts[0]}/${intercepts[1]}/${intercepts[2]}/${intercepts[3]}` // database qualifiedName
                const schemaKey = `${intercepts[0]}/${intercepts[1]}/${intercepts[2]}/${intercepts[3]}/${intercepts[4]}` // schema qualifiedName
                keys.add(databaseKey)
                keys.add(schemaKey)
            } else if (intercepts.length == 7) {
                const databaseKey = `${intercepts[0]}/${intercepts[1]}/${intercepts[2]}/${intercepts[3]}` // database qualifiedName
                const schemaKey = `${intercepts[0]}/${intercepts[1]}/${intercepts[2]}/${intercepts[3]}/${intercepts[4]}` // schema qualifiedName
                const tableKey = `${intercepts[0]}/${intercepts[1]}/${intercepts[2]}/${intercepts[3]}/${intercepts[4]}/${intercepts[5]}` // schema qualifiedName
                keys.add(databaseKey)
                keys.add(schemaKey)
                keys.add(tableKey)
            }
        })
        return Array.from(keys)
    }

    function getAssetIcon(connectionQualifiedName) {
        const intercepts = connectionQualifiedName?.split('/')
        if (intercepts.length == 3) {
            return capitalizeFirstLetter(intercepts[1])
        } else if (intercepts.length == 4) {
            return 'Database'
        } else if (intercepts.length == 5) {
            return 'Schema'
        } else if (intercepts.length == 6) {
            return 'Table'
        } else if (intercepts.length == 7) {
            return 'Column'
        }
        return ''
    }
    return {
        getExpandedKeysFromConnectionQualifiedName,
        getAssetIcon,
    }
}
