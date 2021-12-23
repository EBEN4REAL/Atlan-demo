<template>
    <div class="w-full">
        <a-tree-select
            :ref="
                (el) => {
                    treeSelectRef = el
                }
            "
            v-model:treeExpandedKeys="expandedKeys"
            :value="selectedValue"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :class="$style.connector"
            data-test-id="connector"
            placeholder="Select a connector"
            dropdown-class-name="connectorDropdown"
            :allow-clear="true"
            :disabled="disabled"
            @change="onChange"
            @select="selectNode"
            @blur="onBlur"
        >
            <template #title="node">
                <div
                    v-if="node.node.nodeType !== 'info-node'"
                    class="flex items-center truncate selected-connetor"
                    @click="toggleVisibilityOfChildren(node.title)"
                >
                    <AtlanIcon :icon="iconName(node)" class="h-4 mr-1" />
                    <div class="flex flex-col">
                        {{ node.title }}
                    </div>
                    <span class="text-sm text-gray-500" v-if="node.node.count">
                        ({{ node.node.count }} assets)</span
                    >
                </div>
                <div
                    v-else
                    class="flex p-1 text-xs text-gray-500 bg-gray-100 rounded cursor-default"
                >
                    <AtlanIcon icon="Overview" class="mt-1 mr-2"></AtlanIcon>
                    <div>{{ node.node.value }}</div>
                </div>
            </template>

            <template #suffixIcon>
                <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
            </template>
        </a-tree-select>
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
    import { capitalizeFirstLetter } from '~/utils/string'
    import { Components } from '~/api/atlas/client'
    import { List } from '~/constant/status'
    import { useConnectionStore } from '~/store/connection'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {
            // UserSelector,

            VNodes: (_, { attrs }) => attrs.vnodes,
        },
        props: {
            data: {
                type: Object as PropType<{
                    attributeName: string
                    attributeValue: string
                }>,
                required: true,
            },
            filterSourceIds: {
                type: Array as PropType<string[]>,
                required: false,
                default: () => [],
            },
            disabled: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            showEmptyParents: {
                type: Boolean,
                default: true,
            },
            whitelistedConnections: {
                type: Array,
                default: null,
            },
            footerNodeContent: {
                type: String,
                default: '',
            },
        },
        emits: ['change', 'update:data', 'blur', 'changeConnector'],
        setup(props, { emit }) {
            const treeSelectRef = ref()
            const { getConnectorName } = useAssetInfo()
            const { data, filterSourceIds } = toRefs(props)

            const connector = computed(() => {
                if (data.value?.attributeName === 'connectorName')
                    return data.value?.attributeValue

                const qfChunks = data.value?.attributeValue?.split('/')
                return qfChunks?.length > 1 ? qfChunks[1] : ''
            })

            // QualifiedName format -> tenant/connector/connection/.../.../...
            const connection = computed(() => {
                const qfChunks = data.value?.attributeValue?.split('/')
                return qfChunks?.length > 2
                    ? qfChunks.slice(0, 3).join('/')
                    : ''
            })

            // undefined is necessary here to show the placeholder
            const selectedValue = computed(
                () => connection.value || connector.value || undefined
            )

            /* Remove the sources mentioned in filterIds array */
            const filterSourceList = (filterSourceIds: string[]) =>
                store.getSourceList.filter(
                    (item) => !filterSourceIds.includes(item.id)
                )

            const store = useConnectionStore()
            // console.log(store.get(), 'sourceMap')
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

            const transformConnectionsToTree = (connectorId: string) => {
                let filteredList = store.getList
                if (props.whitelistedConnections)
                    filteredList = filteredList.filter((item) =>
                        props.whitelistedConnections.includes(item.guid)
                    )
                return filteredList
                    .filter(
                        (connection) =>
                            getConnectorName(connection?.attributes) ===
                            connectorId
                    )
                    .sort((a, b) =>
                        a.attributes.name?.toLowerCase() >
                        b.attributes.name?.toLowerCase()
                            ? 1
                            : b.attributes.name?.toLowerCase() >
                              a.attributes.name?.toLowerCase()
                            ? -1
                            : 0
                    )
                    .map((connection) => {
                        if (
                            getConnectorName(connection?.attributes) ===
                            connectorId
                        ) {
                            return {
                                key: connection.attributes.qualifiedName,
                                name:
                                    connection.attributes.name ||
                                    connection.attributes.qualifiedName,
                                value: connection.attributes.qualifiedName,
                                connector: getConnectorName(
                                    connection?.attributes
                                ),
                                connection: connection.attributes.qualifiedName,
                                integrationName: getConnectorName(
                                    connection?.attributes
                                ),
                                children: [],
                                count: connection.assetCount,

                                title:
                                    connection.attributes.name ||
                                    connection.attributes.qualifiedName,
                            }
                        }
                    })
            }

            const transformConnectorToTree = (data: any) => {
                const tree: Record<string, any>[] = []
                data.forEach((item: any) => {
                    const children = transformConnectionsToTree(item.id)
                    const treeNodeObj = {
                        value: item.id,
                        key: item.id,
                        selectable: false,
                        img: item.image,
                        connector: item.id,
                        connection: undefined,
                        title: item.id,
                        children,
                    }
                    if (props.showEmptyParents) tree.push(treeNodeObj)
                    else if (children && children.length) tree.push(treeNodeObj)
                })
                if (props.footerNodeContent)
                    tree.push({
                        value: props.footerNodeContent,
                        id: 'info-node',
                        selectable: false,
                        nodeType: 'info-node',
                        disabled: true,
                    })
                return tree
            }

            const treeData = computed(() =>
                transformConnectorToTree(filteredList.value)
            )

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
                        attributeName: 'connectorName',
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

            const onChange = (value) => {
                if (!value) {
                    selectNode(undefined, undefined)
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

            const selectNode = (value, node?: any) => {
                const payload: Components.Schemas.FilterCriteria = {
                    attributeName: undefined,
                    attributeValue: undefined,
                }
                const chunks = value?.split('/')

                if (chunks?.length == 1 && chunks[0]) {
                    payload.attributeName = 'connectorName'
                    payload.attributeValue = chunks[0]
                } else if (chunks?.length > 2) {
                    payload.attributeName = 'connectionQualifiedName'
                    payload.attributeValue = chunks.slice(0, 3).join('/')
                }

                emit('update:data', payload)
                emit('change')
                emit('changeConnector')
            }

            const onBlur = () => {
                emit('blur')
            }

            /**
             * A helper function for toggling the visibility of the children
             * of a parent node, when the user clicks on the label. It relies
             * on the `expandedKeys` array, and inserts the parent node in this
             * array if not present, otherwise it deletes the parent node from
             * the array, thus collapsing it.
             * @param name The name of the parent node
             */
            const toggleVisibilityOfChildren = (name: string) => {
                // Find index of the parent node in the array.
                const indexOfElement = expandedKeys.value.indexOf(name)

                // If the element is found, remove it from the array.
                if (indexOfElement > -1) {
                    expandedKeys.value.splice(indexOfElement, 1)
                } else {
                    // If it is not found, add it.
                    expandedKeys.value.push(name)
                }
            }

            const iconName = (node) => {
                if (
                    node.title === 'athena' ||
                    node.title === 'snowflake' ||
                    node.title === 'powerbi' ||
                    node.title === 'tableau'
                ) {
                    switch (node.title) {
                        case 'snowflake':
                            return 'Snowflake'
                        case 'athena':
                            return 'Athena'
                        case 'powerbi':
                            return 'PowerBI'
                        case 'tableau':
                            return 'Tableau'
                    }
                } else {
                    const el = node?.key?.split('/')
                    if (el && el.length) {
                        switch (el[1]) {
                            case 'snowflake':
                                return 'Snowflake'
                            case 'athena':
                                return 'Athena'
                            case 'powerbi':
                                return 'PowerBI'
                            case 'tableau':
                                return 'Tableau'
                        }
                    } else {
                        return ''
                    }
                }
            }

            return {
                iconName,
                treeSelectRef,
                filterSourceIds,
                onChange,
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
                onBlur,
                toggleVisibilityOfChildren,
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
        .ant-select-tree-treenode.ant-select-tree-treenode-disabled.ant-select-tree-treenode-switcher-close.ant-select-tree-treenode-leaf-last {
            .ant-select-tree-switcher-noop {
                display: none; // hides extra left side space for info node
            }
        }
    }
</style>
<style lang="less" module>
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
            border-radius: 4px !important;
        }
    }
</style>
