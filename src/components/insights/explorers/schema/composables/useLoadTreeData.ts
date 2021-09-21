import { Ref, ref } from 'vue'

import { Database, Schema, Table, Column, BasicSearchResponse } from '~/types/insights/table.interface'

import { useAPIPromise } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'


const useLoadTreeData = () => {
    const body = ref({
        typeName: "Schema",
        excludeDeletedEntities: true,
        includeClassificationAttributes: false,
        includeSubClassifications: false,
        includeSubTypes: true,
        limit: 100,
        offset: 0,
        attributes: [
            "name",
            "displayName"
        ],
        entityFilters: {
            condition: "AND",
            criterion: [
                {
                    attributeName: "",
                    attributeValue: "",
                    operator: "eq"
                }
            ]
        },
        sortBy: "Asset.name.keyword",
        sortOrder: "ASCENDING",
    });

    const getDatabaseForConnection = async (connectionQualifiedName: string, offset?: number) => {
        body.value.typeName = 'Database';
        body.value.entityFilters.criterion = [{
            attributeName: "connectionQualifiedName",
            attributeValue: connectionQualifiedName,
            operator: "eq"
        }]
        body.value.offset = offset ?? 0

        return useAPIPromise(KeyMaps.schemaExplorer.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Database>>;
    }

    const getSchemaForDatabase = (databaseQualifiedName: string, offset?: number) => {
        body.value.typeName = 'Schema';
        body.value.entityFilters.criterion = [{
            attributeName: "databaseQualifiedName",
            attributeValue: databaseQualifiedName,
            operator: "eq"
        }]
        body.value.offset = offset ?? 0

        return useAPIPromise(KeyMaps.schemaExplorer.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Schema>>
    }

    const getTablesForSchema = (schemaQualifiedName: string, offset?: number) => {
        body.value.typeName = 'Table';
        body.value.entityFilters.criterion = [{
            attributeName: "schemaQualifiedName",
            attributeValue: schemaQualifiedName,
            operator: "eq"
        }]
        body.value.offset = offset ?? 0

        return useAPIPromise(KeyMaps.schemaExplorer.BASIC_SEARCH(), 'POST', {
            body,
        })  as Promise<BasicSearchResponse<Table>>
    }


    const getColumnsForTable = (tableQualifiedName: string, offset?: number) => {
        body.value.typeName = 'Column';
        body.value.entityFilters.criterion = [{
            attributeName: "tableQualifiedName",
            attributeValue: tableQualifiedName,
            operator: "eq"
        }]
        body.value.offset = offset ?? 0

        return useAPIPromise(KeyMaps.schemaExplorer.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Column>>
    }

    return {
        getDatabaseForConnection,
        getSchemaForDatabase,
        getTablesForSchema,
        getColumnsForTable,
    }
}

export default useLoadTreeData;