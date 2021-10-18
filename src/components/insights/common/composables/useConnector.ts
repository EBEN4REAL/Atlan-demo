import { Ref, ref, ComputedRef } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'

export function useConnector() {
    const { modifyActiveInlineTab } = useInlineTab()

    const setConnectorsDataInInlineTab = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        connectorsData: Ref<connectorsWidgetInterface> | Ref<any>,
        explorerType: 'schema' | 'queries' = 'schema'
    ) => {
        if (connectorsData.value.attributeValue && activeInlineTab.value) {
            const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
                {},
                activeInlineTab.value
            )

            if (explorerType === 'schema') {
                activeInlineTabCopy.explorer[explorerType].connectors =
                    connectorsData.value
            } else {
                activeInlineTabCopy.explorer.queries.connectors.connector =
                    connectorsData.value
            }
            modifyActiveInlineTab(activeInlineTabCopy, tabs)

            console.log(connectorsData, 'Connectors Data')
        }
    }

    //selectedDataSourceName: 'default/snowflake/vqaqufvr-i'
    // databaseQualifiedName:
    // 'default/snowflake/vqaqufvr-i/ATLAN_TRIAL',
    //  selectedDefaultSchema: 'ATLAN_TRIAL.PUBLIC'
    // schemaQualifiedName:
    //     'default/snowflake/vqaqufvr-i/ATLAN_TRIAL/PUBLIC',

    const getConnectorName = (attributeValue) => {
        let attributeValues: string[]
        let connectorName: string | undefined
        if (attributeValue) {
            attributeValues = attributeValue?.split('/')
            if (attributeValues.length > 0) {
                connectorName = attributeValues[1]
            }
        }

        return connectorName
    }
    const getConnectionQualifiedName = (attributeValue) => {
        let attributeValues: string[]
        let connectionQualifiedName: string | undefined
        if (attributeValue) {
            attributeValues = attributeValue?.split('/')
            if (attributeValues.length > 1) {
                connectionQualifiedName = `${attributeValues[0]}/${attributeValues[1]}/${attributeValues[2]}`
            }
        }

        return connectionQualifiedName
    }

    const getDatabaseQualifiedName = (attributeValue) => {
        let attributeValues: string[]
        let databaseQualifiedName: string | undefined
        if (attributeValue) {
            attributeValues = attributeValue?.split('/')
            if (attributeValues.length > 2) {
                databaseQualifiedName = `${attributeValues[0]}/${attributeValues[1]}/${attributeValues[2]}/${attributeValues[3]}`
            }
        }
        return databaseQualifiedName
    }
    const getDatabaseName = (attributeValue) => {
        let attributeValues: string[]
        let databaseQualifiedName: string | undefined
        if (attributeValue) {
            attributeValues = attributeValue?.split('/')
            if (attributeValues.length > 2) {
                databaseQualifiedName = `${attributeValues[3]}`
            }
        }
        return databaseQualifiedName
    }

    const getSchemaQualifiedName = (attributeValue) => {
        let attributeValues: string[]
        let schemaQualifiedName: string | undefined = ''
        if (attributeValue) {
            attributeValues = attributeValue?.split('/')

            if (attributeValues.length > 4) {
                schemaQualifiedName = `${attributeValues[0]}/${attributeValues[1]}/${attributeValues[2]}/${attributeValues[3]}/${attributeValues[4]}`
            }
        }

        return schemaQualifiedName
    }
    const getSchemaName = (attributeValue) => {
        let attributeValues: string[]
        let schemaQualifiedName: string | undefined
        if (attributeValue) {
            attributeValues = attributeValue?.split('/')
            if (attributeValues.length > 3) {
                schemaQualifiedName = `${attributeValues[4]}`
            }
        }

        return schemaQualifiedName
    }
    const getSchemaWithDataSourceName = (attributeValue) => {
        let attributeValues: string[]
        // 'ATLAN_TRIAL.PUBLIC' - name
        let name: string | undefined
        if (attributeValue) {
            attributeValues = attributeValue?.split('/')
            if (attributeValues.length > 3) {
                name = `${attributeValues[3]}.${attributeValues[4]}`
            }
        }

        return name
    }

    const getConnectorsDataFromQualifiedNames = (
        connectionQualifiedName: string,
        defaultSchemaQualifiedName: string
    ) => {
        const connectors: connectorsWidgetInterface = {
            attributeName: undefined,
            attributeValue: undefined,
        }

        if (defaultSchemaQualifiedName) {
            connectors.attributeName = 'defaultSchemaQualifiedName'
            connectors.attributeValue = defaultSchemaQualifiedName
        } else if (connectionQualifiedName) {
            connectors.attributeName = 'connectionQualifiedName'
            connectors.attributeValue = connectionQualifiedName
        }
        return connectors
    }

    return {
        getSchemaName,
        getDatabaseName,
        getSchemaWithDataSourceName,
        getConnectionQualifiedName,
        getConnectorName,
        getSchemaQualifiedName,
        getDatabaseQualifiedName,
        setConnectorsDataInInlineTab,
        getConnectorsDataFromQualifiedNames,
    }
}
