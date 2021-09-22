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
        }
    ) => {
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        activeInlineTabCopy.explorer.schema.connectors.connector =
            connectorsData.connector
        activeInlineTabCopy.explorer.schema.connectors.connection =
            connectorsData.connection
        activeInlineTabCopy.explorer.schema.connectors.selectedDataSourceName =
            connectorsData.sourceName
        activeInlineTabCopy.explorer.schema.connectors.selectedDefaultSchema =
            connectorsData.schema
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
        const schemaValues: string[] = selectedDefaultSchema?.split('.')
        let databaseQualifiedName = `${selectedDataSourceName}/${schemaValues[0]}`
        return databaseQualifiedName
    }
    const getSchemaQualifiedName = (
        selectedDataSourceName,
        selectedDefaultSchema
    ) => {
        const schemaValues: string[] = selectedDefaultSchema.split('.')
        let databaseQualifiedName = `${selectedDataSourceName}/${schemaValues[0]}/${schemaValues[1]}`
        return databaseQualifiedName
    }

    return {
        getSchemaQualifiedName,
        getDatabaseQualifiedName,
        setConnectorsDataInInlineTab,
        getConnectorsData,
    }
}
