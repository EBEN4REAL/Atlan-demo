<template>
    <div class="w-full px-4 py-1 pb-3 bg-gray-100">
        <a-tree-select
            v-model:value="selectedValue"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="Select a connector"
            :allowClear="true"
            @select="handleNodeSelect"
            @change="handleSelectChange"
        >
            <template #title="node">
                <div class="flex items-center" v-if="node?.img">
                    <img :src="node.img" class="w-auto h-3 mr-1" />
                    <span class="font-bold">{{ node.value }}</span>
                </div>
                <div class="flex items-center" v-if="node?.integrationName">
                    <img
                        :src="getImage(node.integrationName)"
                        class="w-auto h-3 mr-1"
                    />
                    {{ node.integrationName }}
                </div>
            </template>
        </a-tree-select>
        <AssetDropdown
            v-if="data.connectorsPayload.connection"
            :connector="filteredConnector"
            :data="data.connectorsPayload"
            @change="handleChange"
            @label-change="setPlaceholder($event, 'asset')"
        ></AssetDropdown>
    </div>
</template>

<script lang="ts">
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
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'

    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        components: {
            AssetDropdown,
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const tabIds = ref([])
            const selectedValue = ref(
                data.value.checked?.connection
                    ? data.value.checked?.connection
                    : data.value.checked?.connector
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
                    ]
                }
            }
            watch(
                data.value,
                () => {
                    if (!data.value.checked?.connector) {
                        selectedValue.value = undefined
                    }
                },
                { immediate: true }
            )
            const store = useConnectionsStore()
            const connectorsPayload = ref(data.value.connectorsPayload)
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
                                title:
                                    connection.attributes.displayName ||
                                    connection.attributes.name,
                                key: connection.attributes.qualifiedName,
                                value: connection.attributes.qualifiedName,
                                connector:
                                    connection.attributes.integrationName,
                                connection: connection.attributes.qualifiedName,
                                intregationName:
                                    connection?.attributes?.integrationName,
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
                        connection: undefined,
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

            const value = ref<string>()

            watch(value, () => {
                console.log(value.value)
            })

            const handleNodeSelect = (value, node) => {
                // data.value.connector = node.dataRef.connector
                // data.value.connection = node.dataRef.connection
                data.value.connectorsPayload.connector = node.dataRef.connector
                data.value.connectorsPayload.connection =
                    node.dataRef.connection
                data.value.checked.connector = node.dataRef.connector
                data.value.checked.connection = node.dataRef.connection
                console.log(value, node.dataRef, connectorsPayload, 'selected')
            }
            const handleSelectChange = (value, label) => {
                const criterion: Components.Schemas.FilterCriteria[] = []
                if (!value) {
                    data.value.connectorsPayload.connector = undefined
                    data.value.connectorsPayload.connection = undefined
                }
                if (data.value.connectorsPayload?.connector) {
                    criterion?.push({
                        attributeName: 'integrationName',
                        attributeValue: data.value.connectorsPayload?.connector,
                        operator: 'eq',
                    })
                }
                if (data.value.connectorsPayload?.connection) {
                    criterion?.push({
                        attributeName: 'connectionQualifiedName',
                        attributeValue:
                            data.value.connectorsPayload?.connection,
                        operator: 'eq',
                    })
                }
                setVisibleTabIds(data.value.connectorsPayload?.connector)
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
            const handleChange = (entityFilters: any) => {
                // emit('change', {
                //     id: props.item.id,
                //     payload: {
                //         condition: 'AND',
                //         criterion:entityFilters.criterion,
                //     } as Components.Schemas.FilterCriteria,
                // })
                console.log(entityFilters, 'criterion')
            }
            const filteredConnector = computed(() =>
                store.getSourceList?.find(
                    (item) => data.value.connectorsPayload?.connector == item.id
                )
            )
            function setPlaceholder(label: string, type: string) {
                placeholderLabel.value[type] = label
                if (type === 'connector') placeholderLabel.value.asset = ''
            }

            console.log(data.value.connectorsPayload, 'connectorsPayload')

            return {
                handleChange,
                selectedValue,
                handleSelectChange,
                setPlaceholder,
                filteredConnector,
                data,
                connectorsPayload,
                handleNodeSelect,
                getImage,
                filteredList,
                list,
                checkedValues,
                value,
                treeData,
            }
        },
    })
</script>
<style lang="less" scoped>
    .status:last-child {
        margin-bottom: 0 !important;
    }
</style>
