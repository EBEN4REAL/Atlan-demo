<template>
    <div class="w-full">
        <a-tree-select
            :value="selectedValue"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :class="$style.connector"
            placeholder="Select a connector"
            dropdownClassName="connectorDropdown"
            :allowClear="true"
            @select="handleNodeSelect"
            @change="handleSelectChange"
        >
            <template #title="node">
                <div class="flex items-center" v-if="node?.img">
                    <img :src="node.img" class="w-auto h-3 mr-2" />
                    <span class="">{{
                        capitalizeFirstLetter(node.value)
                    }}</span>
                </div>
                <div class="flex items-center" v-if="node?.integrationName">
                    <img
                        :src="getImage(node?.integrationName)"
                        class="w-auto h-3 mr-2"
                    />
                    <span class="">{{ node.name }}</span>
                </div>
            </template>

            <template #suffixIcon>
                <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
            </template>

            <template #dropdownRender="{ menuNode: menu }">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />
                <div
                    style="padding: 4px 8px; cursor: pointer"
                    @mousedown="(e) => e.preventDefault()"
                    @click="addItem"
                >
                    <plus-outlined />
                    Add item
                </div>
            </template>
        </a-tree-select>
        <AssetDropdown
            v-if="data?.connection"
            :connector="filteredConnector"
            :data="data"
            @change="handleChange"
            @label-change="setPlaceholder($event, 'asset')"
        ></AssetDropdown>
    </div>
</template>

<script lang="ts">
    import { capitalizeFirstLetter } from '~/utils/string'
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
    } from 'vue'
    import { Components } from '~/api/atlas/client'
    import { List } from '~/constant/status'
    import { Collapse } from '~/types'
    import { useConnectionsStore } from '~/store/connections'
    import AssetDropdown from './assetDropdown.vue'
    import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'

    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object as PropType<connectorsWidgetInterface>,
                required: true,
            },
        },
        components: {
            AssetDropdown,
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const tabIds: Ref<string[]> = ref([])
            const selectedValue = computed(() =>
                data.value?.connection
                    ? data.value?.connection
                    : data.value?.connector
            )
            const setVisibleTabIds = (connectorType: string) => {
                if (connectorType) {
                    if (connectorType === 'tableau') {
                        tabIds.value = [
                            'TableauSite',
                            'TableauProject',
                            'TableauWorkbook',
                            'TableauWorksheet',
                            'TableauDashboard',
                            'TableauDatasource',
                            'TableauDatasourceField',
                            'TableauCalculatedField',
                        ]
                    } else {
                        tabIds.value = [
                            'Connection',
                            'Database',
                            'Schema',
                            'View',
                            'Table',
                            'TablePartition',
                            'MaterialisedView',
                            'Column',
                        ]
                    }
                } else {
                    tabIds.value = [
                        'Connection',
                        'Database',
                        'Schema',
                        'View',
                        'Table',
                        'TablePartition',
                        'MaterialisedView',
                        'Column',
                        'TableauSite',
                        'TableauProject',
                        'TableauWorkbook',
                        'TableauWorksheet',
                        'TableauDashboard',
                        'TableauDatasource',
                        'TableauDatasourceField',
                        'TableauCalculatedField',
                    ]
                }
            }

            const store = useConnectionsStore()

            const filteredList = computed(() => store.getSourceList)
            const getImage = (id: string) => store.getImage(id)
            const list = computed(() => List)
            const checkedValues = ref([])
            const placeholderLabel: Ref<Record<string, string>> = ref({})
            console.log(checkedValues.value, 'model')

            const transformConnectionsToTree = (connectorId: string) => {
                return store.getList
                    .filter(
                        (connection) =>
                            connection.attributes.integrationName ===
                            connectorId
                    )
                    .sort((a, b) =>
                        a.attributes.displayName?.toLowerCase() >
                        b.attributes.displayName?.toLowerCase()
                            ? 1
                            : b.attributes.displayName?.toLowerCase() >
                              a.attributes.displayName?.toLowerCase()
                            ? -1
                            : 0
                    )
                    .map((connection) => {
                        if (
                            connection.attributes.integrationName ===
                            connectorId
                        ) {
                            return {
                                key: connection.attributes.qualifiedName,
                                name:
                                    connection.attributes.displayName ||
                                    connection.attributes.qualifiedName,
                                guid: connection.guid,
                                value: connection.attributes.qualifiedName,
                                connector:
                                    connection.attributes.integrationName,
                                connection: connection.attributes.qualifiedName,
                                integrationName:
                                    connection?.attributes?.integrationName,
                                slots: {
                                    title: 'title',
                                },
                            }
                        }
                    })
            }

            const transformConnectorToTree = (data) => {
                const tree = []
                data.forEach((item) => {
                    let dummyObj = {
                        value: item.id,
                        key: item.id,
                        img: item.image,
                        connector: item.id,
                        connection: item.id,
                        slots: {
                            title: 'title',
                        },
                        children: transformConnectionsToTree(item.id),
                    }
                    tree.push(dummyObj)
                })
                return tree
            }

            const treeData = transformConnectorToTree(filteredList.value)

            const handleNodeSelect = (value, node) => {
                // data.value.connector = node.dataRef.connector
                // data.value.connection = node.dataRef.connection
                const newData = {
                    connector: node.dataRef.connector,
                    connection: node.dataRef.connection,
                    guid: node.dataRef?.guid,
                }
                setVisibleTabIds(newData.connector)
                emit('update:data', newData)
                // console.log(value, node.dataRef, connectorsPayload, 'selected')
            }

            const emitChangedFilters = () => {
                const criterion: Components.Schemas.FilterCriteria[] = []

                if (data.value?.connector) {
                    criterion?.push({
                        attributeName: 'connectorName',
                        attributeValue: data.value?.connector,
                        operator: 'eq',
                    })
                }
                if (data.value?.connection) {
                    criterion?.push({
                        attributeName: 'connectionQualifiedName',
                        attributeValue: data.value?.connection,
                        operator: 'eq',
                    })
                }

                console.log(tabIds.value, 'tabsIds')

                emit(
                    'change',
                    {
                        id: props.item.id,
                        payload: {
                            condition: 'AND',
                            criterion,
                        } as Components.Schemas.FilterCriteria,
                    },
                    tabIds.value
                )
            }

            const handleSelectChange = (value, label) => {
                if (!value) {
                    setVisibleTabIds('')
                    emit('update:data', {
                        connector: undefined,
                        connection: undefined,
                        databaseQualifiedName: undefined,
                        schemaQualifiedName: undefined,
                    })
                } else {
                    emitChangedFilters()
                }
            }

            const handleChange = ({
                attributeName,
                attributeValue,
            }: Record<string, string>) => {
                if (attributeName && attributeValue)
                    emit(
                        'change',
                        {
                            id: props.item.id,
                            payload: {
                                condition: 'AND',
                                criterion: [
                                    {
                                        attributeName,
                                        attributeValue,
                                        operator: 'eq',
                                    },
                                ],
                            } as Components.Schemas.FilterCriteria,
                        },
                        tabIds.value
                    )
                else emitChangedFilters()
            }

            const filteredConnector = computed(() =>
                store.getSourceList?.find(
                    (item) => data.value?.connector == item.id
                )
            )
            function setPlaceholder(label: string, type: string) {
                placeholderLabel.value[type] = label
                if (type === 'connector') placeholderLabel.value.asset = ''
            }

            console.log(data.value, 'connectorsPayload')

            return {
                handleChange,
                selectedValue,
                handleSelectChange,
                setPlaceholder,
                filteredConnector,
                data,
                handleNodeSelect,
                getImage,
                filteredList,
                list,
                checkedValues,
                treeData,
                capitalizeFirstLetter,
            }
        },
    })
</script>
<style lang="less">
    .connectorDropdown {
        .ant-select-tree-switcher {
            width: 18px !important;
            height: 24px !important;
            line-height: 24px !important;
            margin-top: -4px !important;
        }
        .ant-select-switcher-icon {
            font-weight: normal !important;
        }
    }
</style>
<style lang="less" module>
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }
    }
</style>
