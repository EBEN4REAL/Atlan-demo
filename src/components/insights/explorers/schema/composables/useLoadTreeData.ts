import { Ref, ref } from 'vue'

import {
    Database,
    Schema,
    Table,
    Column,
    View,
} from '~/types/insights/table.interface'
import { IndexSearchResponse } from '~/services/meta/search/index'

import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map } from '~/services/meta/search/key'
import {
    InternalAttributes,
    BasicSearchAttributes,
} from '~/constant/projection'
import { useBody } from './useBody'

const attributes = [
    'name',
    'displayName',
    'typeName',
    'dataType',
    'description',
    'userDescription',
    'certificateStatus',
    'ownerUsers',
    'ownerGroups',
    'classifications',
    'tableCount',
    'viewCount',
    'columnCount',
    ...InternalAttributes,
    ...BasicSearchAttributes,
]

const useLoadTreeData = (queryText: Ref<string>) => {
    const body = ref<Record<string, any>>({})
    const parentFilter = ref({
        term: {},
    })
    let typeName = ref<string | string[]>()
    const from = ref(0)
    const size = ref(100)
    const sort = ref<String>('asc')
    const refreshBody = () => {
        const appliedFilters: Array<any> = []
        appliedFilters.push(parentFilter.value)
        appliedFilters.push({
            [Array.isArray(typeName.value) ? 'terms' : 'term']: {
                '__typeName.keyword': typeName.value,
            },
        })

        const dsl = useBody(
            sort.value,
            appliedFilters,
            typeName.value,
            queryText?.value,
            from?.value,
            size?.value
        )
        body.value = {
            dsl,
            attributes,
        }
    }
    const getDatabaseForConnection = async (
        connectionQualifiedName: string,
        offset?: number
    ) => {
        typeName.value = 'Database'
        parentFilter.value.term = {
            connectionQualifiedName,
        }
        from.value = offset ?? 0
        sort.value = 'asc'

        refreshBody()
        console.log('body connection: ', body)

        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        }) as Promise<IndexSearchResponse<Database>>
    }

    const getSchemaForDatabase = (
        databaseQualifiedName: string,
        offset?: number
    ) => {
        typeName.value = 'Schema'
        parentFilter.value.term = {
            databaseQualifiedName,
        }
        from.value = offset ?? 0
        sort.value = 'asc'

        refreshBody()
        console.log('body database: ', body)

        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        }) as Promise<IndexSearchResponse<Schema>>
    }

    const getTablesAndViewsForSchema = (
        schemaQualifiedName: string,
        offset?: number
    ) => {
        typeName.value = ['Table', 'View']
        parentFilter.value.term = {
            schemaQualifiedName,
        }
        from.value = offset ?? 0
        sort.value = 'asc'

        refreshBody()

        console.log('body schema: ', body)

        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        }) as Promise<IndexSearchResponse<Table | View>>
    }

    const getColumnsForTable = (
        tableQualifiedName: string,
        offset?: number
    ) => {
        typeName.value = 'Column'
        parentFilter.value.term = {
            tableQualifiedName,
        }
        from.value = offset ?? 0
        sort.value = 'asc'

        refreshBody()

        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        }) as Promise<IndexSearchResponse<Column>>
    }

    const getColumnsForView = (viewQualifiedName: string, offset?: number) => {
        typeName.value = 'Column'
        parentFilter.value.term = {
            viewQualifiedName,
        }
        from.value = offset ?? 0
        sort.value = 'asc'

        refreshBody()

        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        }) as Promise<IndexSearchResponse<Column>>
    }

    return {
        getDatabaseForConnection,
        getSchemaForDatabase,
        getTablesAndViewsForSchema,
        getColumnsForTable,
        // getViewsForSchema,
        getColumnsForView,
    }
}

export default useLoadTreeData
