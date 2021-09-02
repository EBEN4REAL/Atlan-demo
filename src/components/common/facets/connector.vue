<template>
    <div class="w-full px-4 py-1 pb-3 bg-gray-100">
        <a-tree-select
            v-model:value="value"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="Select a connector"
            @select="handleNodeSelect"
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
            v-if="connectorsPayload.connection"
            :connector="filteredConnector"
            :data="connectorsPayload"
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
            const store = useConnectionsStore()
            const connectorsPayload = ref(props.data.connectorsPayload)
            const filteredList = computed(() => store.getSourceList)
            const getImage = (id: string) => store.getImage(id)
            const list = computed(() => List)
            const checkedValues = ref([])
            const { data } = toRefs(props)
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
                        value: item.label,
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
            const handleChange = () => {
                const criterion: Components.Schemas.FilterCriteria[] = []
                data.value.checked.forEach((val) => {
                    criterion.push({
                        attributeName: 'assetStatus',
                        attributeValue: val,
                        operator: 'eq',
                    })
                })

                emit('change', {
                    id: props.item.id,
                    payload: {
                        condition: 'OR',
                        criterion,
                    } as Components.Schemas.FilterCriteria,
                })
            }
            const value = ref<string>()

            watch(value, () => {
                console.log(value.value)
            })

            const handleNodeSelect = (value, node) => {
                connectorsPayload.value.connector = node.dataRef.connector
                connectorsPayload.value.connection = node.dataRef.connection
                console.log(value, node.dataRef, connectorsPayload, 'selected')
            }
            const filteredConnector = computed(() =>
                store.getSourceList?.find(
                    (item) => connectorsPayload.value?.connector == item.id
                )
            )
            function setPlaceholder(label: string, type: string) {
                placeholderLabel.value[type] = label
                if (type === 'connector') placeholderLabel.value.asset = ''
            }

            console.log(connectorsPayload.value, 'connectorsPayload')

            return {
                setPlaceholder,
                filteredConnector,
                connectorsPayload,
                handleNodeSelect,
                getImage,
                filteredList,
                data,
                handleChange,
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
