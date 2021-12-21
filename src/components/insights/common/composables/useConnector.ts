import { Ref, ref, ComputedRef } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
import { useConnectionStore } from '~/store/connection'

export function useConnector() {
    const connStore = useConnectionStore()
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
            modifyActiveInlineTab(
                activeInlineTabCopy,
                tabs,
                activeInlineTabCopy.isSaved
            )

            console.log(connectorsData, 'Connectors Data')
        }
    }
    const setContextDataInInlineTab = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        contextData: Ref<connectorsWidgetInterface> | Ref<any>
    ) => {
        if (contextData.value.attributeValue && activeInlineTab.value) {
            const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
                {},
                activeInlineTab.value
            )

            activeInlineTabCopy.playground.editor.context = contextData.value

            // modifyActiveInlineTab(
            //     activeInlineTabCopy,
            //     tabs,
            //     activeInlineTabCopy.isSaved
            // )

            modifyActiveInlineTab(activeInlineTabCopy, tabs, false)
            console.log(contextData, 'Context Data')
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
            if (attributeValues.length > 2) {
                connectionQualifiedName = `${attributeValues[0]}/${attributeValues[1]}/${attributeValues[2]}`
            }
        }

        return connectionQualifiedName
    }
    const getConnectionName = (attributeValue) => {
        const found = connStore.getList.find(
            (conn) => conn.attributes.qualifiedName === attributeValue
        )
        return found?.attributes?.name || ''
        // let attributeValues: string[]
        // let connectionQualifiedName: string | undefined
        // if (attributeValue) {
        //     attributeValues = attributeValue?.split('/')
        //     if (attributeValues.length > 2) {
        //         connectionQualifiedName = `${attributeValues[2]}`
        //     }
        // }

        // return connectionQualifiedName
    }

    const getDatabaseQualifiedName = (attributeValue) => {
        let attributeValues: string[]
        let databaseQualifiedName: string | undefined
        if (attributeValue) {
            attributeValues = attributeValue?.split('/')
            if (attributeValues.length > 3) {
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
            if (attributeValues.length > 3) {
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
            if (attributeValues.length > 4) {
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
            if (attributeValues.length > 4) {
                name = `${attributeValues[3]}.${attributeValues[4]}`
            } else if (attributeValues.length > 3) {
                name = `${attributeValues[3]}`
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

        if (defaultSchemaQualifiedName && defaultSchemaQualifiedName !== '') {
            connectors.attributeName = 'defaultSchemaQualifiedName'
            connectors.attributeValue = defaultSchemaQualifiedName
        } else if (connectionQualifiedName !== '') {
            connectors.attributeName = 'connectionQualifiedName'
            connectors.attributeValue = connectionQualifiedName
        }
        return connectors
    }
    const getConnectorsDataFromQualifiedNamesAll = (
        connectionQualifiedName: string,
        defaultSchemaQualifiedName: string,
        defaultDatabaseQualifiedName: string
    ) => {
        const connectors: connectorsWidgetInterface = {
            attributeName: undefined,
            attributeValue: undefined,
        }

        if (
            defaultSchemaQualifiedName &&
            defaultSchemaQualifiedName.length !== 0
        ) {
            connectors.attributeName = 'defaultSchemaQualifiedName'
            connectors.attributeValue = defaultSchemaQualifiedName
        } else if (
            defaultDatabaseQualifiedName &&
            defaultDatabaseQualifiedName.length !== 0
        ) {
            connectors.attributeName = 'defaultDatabaseQualifiedName'
            connectors.attributeValue = defaultDatabaseQualifiedName
        } else if (connectionQualifiedName !== '') {
            connectors.attributeName = 'connectionQualifiedName'
            connectors.attributeValue = connectionQualifiedName
        }
        return connectors
    }

    return {
        getSchemaName,
        getDatabaseName,
        getConnectionName,
        getSchemaWithDataSourceName,
        getConnectionQualifiedName,
        getConnectorName,
        getSchemaQualifiedName,
        getDatabaseQualifiedName,
        setContextDataInInlineTab,
        setConnectorsDataInInlineTab,
        getConnectorsDataFromQualifiedNames,
        getConnectorsDataFromQualifiedNamesAll,
    }
}
