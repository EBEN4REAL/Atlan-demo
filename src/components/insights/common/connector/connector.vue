<template>
    <div class="w-full">
        <a-tree-select
            :class="[
                $style.tree_selecttor,
                bgGrayForSelector ? `${$style.selector_bg}` : '',
            ]"
            :value="selectedValue"
            style="width: 100%"
            v-model:treeExpandedKeys="expandedKeys"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="Select a connector"
            dropdownClassName="connectorDropdown"
            :allowClear="false"
            ref="treeRef"
            @change="onChange"
            :data-test-id="'conector'"
            @click="handleOnClick"
            @select="selectNode"
        >
            <template #title="node">
                <div class="flex items-center truncate">
                    <AtlanIcon :icon="iconName(node)" class="h-4 mr-2" />
                    <span class="parent-ellipsis-container-base"
                        >{{ node?.title }}
                    </span>
                </div>
            </template>
            <template #suffixIcon>
                <AtlanIcon
                    icon="ChevronDown"
                    class="h-4 -mt-0.5 -ml-1"
                    color="#6F7590"
                />
            </template>
        </a-tree-select>
        <AssetDropdown
            v-if="connection"
            :connector="filteredConnector"
            :filter="data"
            @change="handleChange"
            :bgGrayForSelector="bgGrayForSelector"
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
    import { Components } from '~/types/atlas/client'
    import { List } from '~/constant/status'
    // import { Collapse } from '~/types'
    import { useConnectionStore } from '~/store/connection'
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    // import Button from '~/components/common/radio/button.vue'

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
            bgGrayForSelector: {
                type: Boolean,
                default: true,
            },
        },
        components: {
            AssetDropdown,
            // Button,
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const treeRef = ref()
            const { getConnectorName } = useAssetInfo()
            const { data, filterSourceIds, isLeafNodeSelectable } =
                toRefs(props)

            const connector = computed(() => {
                if (data.value?.attributeName === 'connectorName')
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
            console.log('connection initial: ', connection.value)

            // undefined is necessary here to show the placeholder
            const selectedValue = computed(
                () => connection.value || connector.value || undefined
            )
            // watch([connection, connector], () => {
            //     selectedValue.value =
            //         connection.value || connector.value || undefined
            // })
            /* Remove the sources mentioned in filterIds array */
            const filterSourceList = (filterSourceIds: string[]) => {
                return store.getSourceList.filter(
                    (item) => !filterSourceIds.includes(item.id)
                )
            }

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
            console.log(checkedValues.value, 'model')

            const transformConnectionsToTree = (connectorId: string) => {
                return store.getList
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
                                title:
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
                            }
                        }
                    })
            }

            const transformConnectorToTree = (data: any) => {
                const tree: Record<string, any>[] = []
                data.forEach((item: any) => {
                    let treeNodeObj = {
                        value: item.id,
                        title: item.id,
                        key: item.id,
                        img: item.image,
                        connector: item.id,
                        connection: undefined,
                        children: transformConnectionsToTree(item.id),
                        selectable: false,
                    }
                    tree.push(treeNodeObj)
                })
                return tree
            }

            const treeData = computed(() =>
                transformConnectorToTree(filteredList.value)
            )
            console.log('tree: ', treeData.value)

            watch([connector, connection], () => emitChangedFilters())

            const emitChangedFilters = () => {
                emit('change')

                console.log('connection change:  ', connection.value)
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
                console.log('on change connections: ', value)
                if (!value) {
                    selectNode(undefined, undefined)
                }
            }

            const filteredConnector = computed(() =>
                store.getSourceList?.find((item) => item.id === connector.value)
            )
            console.log('store: ', store)
            console.log('connector from main: ', connector.value)
            console.log('filteredConnector from main', filteredConnector.value)

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

                console.log('node: ', node)
                if (node?.children?.length > 0 && !isLeafNodeSelectable.value) {
                    expandNode([], node)
                    return
                }
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

                console.log('connector payload: ', payload)

                emit('update:data', payload)
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
                    let el = node?.key?.split('/')
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
            const handleOnClick = (x, y) => {
                console.log(x, y)
            }

            return {
                handleOnClick,
                treeRef,
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
                iconName,
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
    }
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>
<style lang="less" module>
    .tree_selecttor {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
            border: 1px solid #e9ebf1 !important;
            color: #6f7590 !important;
            border-radius: 8px !important;
        }
    }
    .selector_bg {
        :global(.ant-select-selector) {
            background-color: #fbfbfb !important;
        }
    }
</style>
