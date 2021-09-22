<template>
    <div class="flex flex-col items-center w-full h-full bg-white border-r">
        <div class="w-full p-3 mb-3">
            <Connector
                class=""
                :data="connectorsData"
                :item="{
                    id: 'connector',
                    label: 'Connector',
                    component: 'connector',
                    overallCondition: 'OR',
                    filters: [
                        {
                            attributeName: 'connector',
                            condition: 'OR',
                            isMultiple: false,
                            operator: 'eq',
                        },
                    ],
                    isDeleted: false,
                    isDisabled: false,
                    exclude: false,
                }"
                @change="handleChange"
                @update:data="setConnector"
            ></Connector>
        </div>
        <div class="w-full p-3 pt-0 overflow-y-auto scrollable-container">
            <template v-for="table in tables" :key="table.id">
                <div
                    class="flex items-center justify-center w-full px-2 py-2 mb-3 rounded cursor-pointer  placeholder"
                    @click="() => openAssetSidebar(table)"
                    :class="
                        isAssetSidebarOpened(table)
                            ? 'active-placeholder'
                            : 'placeholder'
                    "
                >
                    {{ table.label }}
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, ref, watch } from 'vue'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { tableInterface } from '~/types/insights/table.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { tablesData } from './tablesDemoData'
    import Connector from '~/components/insights/common/connector/connector.vue'
    import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
    import { useConnector } from '~/components/insights/common/composables/useConnector'

    export default defineComponent({
        components: { Connector },
        props: {},
        setup(props, { emit }) {
            const tables: tableInterface[] = tablesData
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const { openAssetSidebar } = useAssetSidebar(tabs, activeInlineTab)
            const {
                setConnectorsDataInInlineTab,
                getConnectorsData,
                getDatabaseQualifiedName,
                getSchemaQualifiedName,
            } = useConnector()

            const isAssetSidebarOpened = (table: tableInterface) => {
                if (
                    activeInlineTab.value &&
                    activeInlineTab.value.assetSidebar
                ) {
                    if (activeInlineTab.value.assetSidebar.id === table.id)
                        return true
                }
                return false
            }
            const selectedDataSourceName =
                activeInlineTab.value.explorer.schema.connectors
                    .selectedDataSourceName
            const selectedDefaultSchema =
                activeInlineTab.value.explorer.schema.connectors
                    .selectedDefaultSchema

            const connectorsData: Ref<connectorsWidgetInterface> = ref({
                connection:
                    activeInlineTab.value.explorer.schema.connectors.connection,
                connector:
                    activeInlineTab.value.explorer.schema.connectors.connector,
                databaseQualifiedName: getDatabaseQualifiedName(
                    selectedDataSourceName,
                    selectedDefaultSchema
                ),
                schemaQualifiedName: getSchemaQualifiedName(
                    selectedDataSourceName,
                    selectedDefaultSchema
                ),
            })
            const handleChange = (data) => {
                const len = data.payload.criterion.length
                if (
                    len > 0 &&
                    data.payload.criterion[len - 1]?.attributeValue
                ) {
                    const { schema, sourceName, connector, connection } =
                        getConnectorsData(
                            data.payload.criterion[len - 1]?.attributeValue
                        )
                    setConnectorsDataInInlineTab(activeInlineTab, tabs, {
                        schema,
                        sourceName,
                        connector,
                        connection,
                    })
                }
            }

            const setConnector = (payload: {
                connection: string | undefined
                connector: string | undefined
            }) => {
                connectorsData.value.connector = payload.connector
                connectorsData.value.connection = payload.connection
            }

            /* Watchers for updating the connectors when activeinlab change */
            watch(activeInlineTab, () => {
                if (activeInlineTab.value) {
                    const selectedDataSourceName =
                        activeInlineTab.value.explorer.schema.connectors
                            .selectedDataSourceName
                    const selectedDefaultSchema =
                        activeInlineTab.value.explorer.schema.connectors
                            .selectedDefaultSchema

                    connectorsData.value = {
                        connection:
                            activeInlineTab.value.explorer.schema.connectors
                                .connection,
                        connector:
                            activeInlineTab.value.explorer.schema.connectors
                                .connector,
                        databaseQualifiedName: getDatabaseQualifiedName(
                            selectedDataSourceName,
                            selectedDefaultSchema
                        ),
                        schemaQualifiedName: getSchemaQualifiedName(
                            selectedDataSourceName,
                            selectedDefaultSchema
                        ),
                    }
                }
            })

            return {
                connectorsData,
                setConnector,
                isAssetSidebarOpened,
                openAssetSidebar,
                handleChange,
                tables,
            }
        },
    })
    /*
    {
                connection: 'default/snowflake/bvscezvng',
                connector: 'snowflake',
                databaseQualifiedName:
                    'default/snowflake/vqaqufvr-i/SNOWFLAKE_SAMPLE_DATA',
                schemaQualifiedName:
                    'default/snowflake/bvscezvng/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL',
            }
    */
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .active-placeholder {
        @apply bg-primary text-white;
    }
    .scrollable-container {
        height: calc(100vh - 14rem);
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
