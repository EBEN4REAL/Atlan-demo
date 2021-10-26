<template>
    <div class="w-full">
        <a-tree-select
            :class="$style.tree_selecttor"
            :value="selectedValue"
            style="width: 100%"
            v-model:treeExpandedKeys="expandedKeys"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="Select a connector"
            dropdownClassName="connectorDropdown"
            :allowClear="true"
            @change="onChange"
            :tree-data-simple-mode="true"
            @select="selectNode"
        >
            <template #title="node">
                <div class="flex items-center" v-if="node.type == 'connector'">
                    <img :src="node.image" class="w-auto h-4 mr-1" />
                    <div v-if="node.type == 'connector'" class="text-gray-700">
                        {{ capitalizeFirstLetter(node.name) }}
                    </div>
                </div>
                <div class="flex flex-col" v-else>
                    <div class="flex items-center">
                        <img :src="node.image" class="w-auto h-4 mr-1" />
                        <div class="">{{ node.name }}</div>
                    </div>

                    <div class="text-xs text-gray-500">
                        {{ node.count }} assets
                    </div>
                </div>
            </template>

            <template #suffixIcon>
                <AtlanIcon icon="ChevronDown" class="h-4 -mt-0.5 -ml-0.5" />
            </template>
        </a-tree-select>

        <AssetDropdown
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
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import useConnectionData from '~/services2/meta/composable/useConnectionData'

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
            const { list, sourceList } = useConnectionData()

            const treeData = computed(() => {
                const mappedConnection = list.map((i) => ({
                    id: i.attributes.qualifiedName,
                    key: i.attributes.qualifiedName,
                    pId: i.attributes.connectorName,
                    name: i.attributes.displayName || i.attributes.name,
                    value: i.attributes.qualifiedName,
                    connector: i.attributes.connectorName,
                    image: sourceList.find(
                        (s) => s.id === i.attributes.connectorName
                    )?.image,
                    count: i.attributes.assetCount,
                    type: 'connection',
                    isLeaf: true,
                    children: null,
                    slots: {
                        title: 'title',
                    },
                }))
                const mappedConnector = sourceList.map((i) => ({
                    id: i.id,
                    name: i.id,
                    key: i.id,
                    value: i.id,
                    connector: i.id,
                    image: i.image,
                    isLeaf: false,
                    children: null,
                    type: 'connector',
                    slots: {
                        title: 'title',
                    },
                }))
                mappedConnection.push(...mappedConnector)
                return mappedConnection
            })

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

            // undefined is necessary here to show the placeholder
            const selectedValue = computed(
                () => connection.value || connector.value || undefined
            )
            // watch([connection, connector], () => {
            //     selectedValue.value =
            //         connection.value || connector.value || undefined
            // })
            /* Remove the sources mentioned in filterIds array */
            // const filterSourceList = (filterSourceIds: string[]) => {
            //     return store.getSourceList.filter(
            //         (item) => !filterSourceIds.includes(item.id)
            //     )
            // }

            const store = useConnectionsStore()
            // console.log(store.get(), 'sourceMap')
            /* Checking if filterSourceIds passed -> whitelist the sourcelist
            else fetch all the sourcelist from store */
            const filteredList = computed(() => {
                return filterSourceIds.value.length > 0
                    ? sourceList.filter(
                          (item) => !filterSourceIds.value.includes(item.id)
                      )
                    : sourceList
            })

            const getImage = (id: string) => store.getImage(id)

            const checkedValues = ref([])
            const placeholderLabel: Ref<Record<string, string>> = ref({})
            console.log(checkedValues.value, 'model')

            watch([connector, connection], () => emitChangedFilters())

            const emitChangedFilters = () => {
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

            const filteredConnector = computed(() => {
                console.log('filtered', filteredList)

                return filteredList.value.find(
                    (item) => item.id === connector.value
                )
            })

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
                    payload.attributeName = 'connectorName'
                    payload.attributeValue = chunks[0]
                } else if (chunks?.length > 2) {
                    payload.attributeName = 'connectionQualifiedName'
                    payload.attributeValue = chunks.slice(0, 3).join('/')
                }

                emit('update:data', payload)
            }

            return {
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
    .tree_selecttor {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
            @apply rounded-lg !important;
        }
    }
</style>
