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
import {map} from '~/services/meta/search/key'
import { InternalAttributes, BasicSearchAttributes } from '~/constant/projection'

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
    'columnCount',
    ...InternalAttributes,
    ...BasicSearchAttributes,
]

const useLoadTreeData = () => {
    const body = ref<Record<string, any>>({});
    const parentFilter = ref({
        term: {}
    });
    const typeName = ref<string | string[]>()
    const from = ref(0)
    const size = ref(100)
    const sort = ref<Record<string, any>>({
        "name.keyword": {
            order: "asc"
        }
    })
    const refreshBody = () => {
        body.value = {
            dsl: {
                size: size.value,
                from: from.value,
                query: {
                    bool: {
                        filter: {
                            bool: {
                                must: [
                                    parentFilter.value,
                                    {
                                        [Array.isArray(typeName.value) ? 'terms' : 'term']: {
                                            "__typeName.keyword": typeName.value
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                sort: [
                    sort.value
                ]
            },
            attributes
        }
    }
    const getDatabaseForConnection = async (
        connectionQualifiedName: string,
        offset?: number
    ) => {
        typeName.value = 'Database'
        parentFilter.value.term = {
            connectionQualifiedName
        }
        from.value = offset ?? 0
        sort.value = {
            "name.keyword": {
                order: "asc"
            }
        }

        refreshBody();

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
            databaseQualifiedName
        }
        from.value = offset ?? 0
        sort.value = {
            "name.keyword": {
                order: "asc"
            }
        }

        refreshBody();

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
            schemaQualifiedName
        }
        from.value = offset ?? 0
        sort.value = {
            "name.keyword": {
                order: "asc"
            }
        }

        refreshBody();

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
            tableQualifiedName
        }
        from.value = offset ?? 0
        sort.value = {
            "order": {
                order: "asc"
            }
        }

        refreshBody();

        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        }) as Promise<IndexSearchResponse<Column>>
    }

    const getColumnsForView = (
        viewQualifiedName: string,
        offset?: number
    ) => {
        typeName.value = 'Column'
        parentFilter.value.term = {
            viewQualifiedName
        }
        from.value = offset ?? 0
        sort.value = {
            "order": {
                order: "asc"
            }
        }

        refreshBody();

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
        getColumnsForView
    }
}

export default useLoadTreeData
