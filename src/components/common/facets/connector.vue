<template>
    <div class="w-full">
        <a-tree-select
            :value="selectedValue"
            style="width: 100%"
            v-model:treeExpandedKeys="expandedKeys"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :class="$style.connector"
            placeholder="Select a connector"
            dropdownClassName="connectorDropdown"
            :allowClear="true"
            @select="selectNode"
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
        </a-tree-select>
        <AssetDropdown
            v-if="connection"
            :connector="filteredConnector"
            :filter="data"
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
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'

    export default defineComponent({
        props: {
            data: {
                type: Object as PropType<{
                    attributeName: string
                    attributeValue: string
                }>,
                required: true,
            },
            filterSourceIds: {
                type: Object as PropType<string[]>,
                required: false,
                default: [],
            },
            isLeafNodeSelectable: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        components: {
            AssetDropdown,
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const { data, filterSourceIds, isLeafNodeSelectable } =
                toRefs(props)

            const connector = computed(() => {
                if (data.value?.attributeName === 'integrationName')
                    return data.value?.attributeValue
                else {
                    let qfChunks = data.value?.attributeValue?.split('/')
                    return qfChunks?.length > 1 ? qfChunks[1] : ''
                }
            })

            // QualifiedName format -> tenant/connector/connection/.../.../...
            const connection = computed(() => {
                let qfChunks = data.value?.attributeValue?.split('/')
                return qfChunks?.length > 2
                    ? qfChunks.slice(0, 3).join('/')
                    : ''
            })

            // undefined is necessary here to show the placeholder
            const selectedValue = computed(
                () => connection.value || connector.value || undefined
            )
            /* Remove the sources mentioned in filterIds array */
            const filterSourceList = (filterSourceIds: string[]) => {
                return store.getSourceList.filter(
                    (item) => !filterSourceIds.includes(item.id)
                )
            }

            const store = useConnectionsStore()
            /* Checking if filterSourceIds passed -> whitelist the sourcelist
            else fetch all the sourcelist from store */
            const filteredList = computed(() =>
                filterSourceIds.value.length > 0
                    ? filterSourceList(filterSourceIds.value)
                    : store.getSourceList
            )
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

            const transformConnectorToTree = (data: any) => {
                const tree: Record<string, any>[] = []
                data.forEach((item: any) => {
                    let treeNodeObj = {
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
                    tree.push(treeNodeObj)
                })
                return tree
            }

            const treeData = transformConnectorToTree(filteredList.value)

            watch([connector, connection], () => emitChangedFilters())

            const emitChangedFilters = () => {
                const criterion: Components.Schemas.FilterCriteria[] = []

                if (connection.value) {
                    criterion?.push({
                        attributeName: 'connectionQualifiedName',
                        attributeValue: connection.value,
                        operator: 'eq',
                    })
                } else if (connector.value) {
                    criterion?.push({
                        attributeName: 'integrationName',
                        attributeValue: connector.value,
                        operator: 'eq',
                    })
                }

                emit('change')
            }

            const handleChange = ({
                attributeName,
                attributeValue,
            }: Record<string, string>) => {
                if (attributeName && attributeValue) {
                    emit('update:data', { attributeName, attributeValue })
                    emit('change')
                } else {
                    selectNode(data.value?.attributeValue)
                    emitChangedFilters()
                }
            }

            const filteredConnector = computed(() =>
                store.getSourceList?.find((item) => item.id === connector.value)
            )

            function setPlaceholder(label: string, type: string) {
                placeholderLabel.value[type] = label
                if (type === 'connector') placeholderLabel.value.asset = ''
            }
            const expandedKeys = ref<string[]>([])
            const expandNode = (expanded: string[], node: any) => {
                console.log(node.isLeaf)
                if (node?.children.length > 0) {
                    const key: string = node.eventKey
                    const isExpanded = expandedKeys.value?.includes(key)
                    if (!isExpanded) {
                        if (node.dataRef.isRoot) {
                            expandedKeys.value = []
                        }
                        expandedKeys.value?.push(key)
                    } else if (isExpanded) {
                        const index = expandedKeys.value?.indexOf(key)
                        expandedKeys.value?.splice(index, 1)
                    }
                    expandedKeys.value = [...expandedKeys.value]
                }
            }

            const selectNode = (value, node?: any) => {
                /* Checking if isLeafNodeSelectable by default it is selectable */
                if (node?.children.length > 0 && !isLeafNodeSelectable.value) {
                    expandNode([], node)
                    return
                }
                const payload: Components.Schemas.FilterCriteria = {
                    attributeName: undefined,
                    attributeValue: undefined,
                }
                const chunks = value?.split('/')

                if (chunks?.length == 1 && chunks[0]) {
                    payload.attributeName = 'integrationName'
                    payload.attributeValue = chunks[0]
                } else if (chunks?.length > 2) {
                    payload.attributeName = 'connectionQualifiedName'
                    payload.attributeValue = chunks.slice(0, 3).join('/')
                }

                emit('update:data', payload)
            }

            return {
                expandedKeys,
                selectNode,
                handleChange,
                selectedValue,
                setPlaceholder,
                filteredConnector,
                data,
                getImage,
                filteredList,
                list,
                checkedValues,
                treeData,
                capitalizeFirstLetter,
                connector,
                connection,
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
