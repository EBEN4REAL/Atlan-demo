import { Ref, ref, ComputedRef } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'

export function useConnector() {
    const { modifyActiveInlineTab } = useInlineTab()

    const setConnectorsDataInInlineTab = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        connectorsData: {
            schema: string | undefined
            sourceName: string | undefined
            connector: string | undefined
            connection: string | undefined
        },
        explorerType: 'schema' | 'queries' = 'schema'
    ) => {
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        activeInlineTabCopy.explorer[explorerType].connectors.connector =
            connectorsData.connector
        if(explorerType === 'schema')
        {
            activeInlineTabCopy.explorer[explorerType].connectors.connection =
                connectorsData.connection
            activeInlineTabCopy.explorer[explorerType].connectors.selectedDataSourceName =
                connectorsData.sourceName
            activeInlineTabCopy.explorer[explorerType].connectors.selectedDefaultSchema =
                connectorsData.schema
        }
        modifyActiveInlineTab(activeInlineTabCopy, tabs)

        console.log(connectorsData, 'Connectors Data')
    }
    const getConnectorsData = (
        attributeValue: string
    ): {
        schema: string | undefined
        sourceName: string | undefined
        connector: string | undefined
        connection: string | undefined
    } => {
        let schema: string | undefined = undefined,
            sourceName: string | undefined = undefined,
            connector: string | undefined = undefined,
            connection: string | undefined = undefined

        const values: string[] = attributeValue.split('/')
        sourceName = `${values[0]}/${values[1]}/${values[2]}`
        connection = `${values[0]}/${values[1]}/${values[2]}`
        connector = `${values[1]}`
        if (values.length > 3) {
            // it have schema

            schema = `${values[3]}.${values[4]}`
        }

        return {
            connector,
            connection,
            schema,
            sourceName,
        }
    }
    //selectedDataSourceName: 'default/snowflake/vqaqufvr-i'
    // databaseQualifiedName:
    // 'default/snowflake/vqaqufvr-i/ATLAN_TRIAL',
    //  selectedDefaultSchema: 'ATLAN_TRIAL.PUBLIC'
    // schemaQualifiedName:
    //     'default/snowflake/vqaqufvr-i/ATLAN_TRIAL/PUBLIC',

    const getDatabaseQualifiedName = (
        selectedDataSourceName,
        selectedDefaultSchema
    ) => {
        let schemaValues: string[]
        let databaseQualifiedName: string | undefined
        if (selectedDefaultSchema) {
            schemaValues = selectedDefaultSchema?.split('.')
            databaseQualifiedName = `${selectedDataSourceName}/${schemaValues[0]}`
        }
        return databaseQualifiedName
    }
    const getSchemaQualifiedName = (
        selectedDataSourceName,
        selectedDefaultSchema
    ) => {
        let schemaValues: string[]
        let schemaQualifiedName: string | undefined

        if (selectedDefaultSchema) {
            schemaValues = selectedDefaultSchema.split('.')
            schemaQualifiedName = `${selectedDataSourceName}/${schemaValues[0]}/${schemaValues[1]}`
        }

        return schemaQualifiedName
    }
    /* connection: 'default/snowflake/vqaqufvr-i' */
    const getConnectonName = (connection: string) => {
        let connectionValues: string[]
        let connectionName: string | undefined

        if (connection) {
            connectionValues = connection.split('/')
            if (connectionValues.length > 1)
                connectionName = connectionValues[2]
        }

        return connectionName
    }

    return {
        getConnectonName,
        getSchemaQualifiedName,
        getDatabaseQualifiedName,
        setConnectorsDataInInlineTab,
        getConnectorsData,
    }
}
