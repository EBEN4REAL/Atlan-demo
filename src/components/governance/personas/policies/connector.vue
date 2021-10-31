<template>
    <div class="w-full">
        <a-tree-select
            v-model:treeExpandedKeys="expandedKeys"
            :value="selectedValue"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :class="$style.connector"
            placeholder="Select a connector"
            dropdown-class-name="connectorDropdown"
            :allow-clear="true"
            :disabled="disabled"
            @change="onChange"
            @select="selectNode"
        >
            <template #title="node">
                <div v-if="node?.img" class="flex items-center">
                    <img :src="node.img" class="w-auto h-3 mr-2" />
                    <span class="">{{
                        capitalizeFirstLetter(node.value)
                    }}</span>
                </div>
                <div v-if="node?.integrationName" class="flex items-center">
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
    import { certificateList } from '~/constant/certification'
    import { useConnectionStore } from '~/store/connection'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

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
                type: Array as PropType<string[]>,
                required: false,
                default: () => [],
            },
            disabled: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const { getConnectorName } = useAssetInfo()
            const { data, filterSourceIds } = toRefs(props)

            const store = useConnectionStore()

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

            // console.log(store.get(), 'sourceMap')
            /* Checking if filterSourceIds passed -> whitelist the sourcelist
            else fetch all the sourcelist from store */
            const filteredList = computed(() =>
                filterSourceIds.value.length > 0
                    ? filterSourceList(filterSourceIds.value)
                    : store.getSourceList
            )
            const getImage = (id: string) => store.getImage(id)
            const list = computed(() => certificateList)
            const checkedValues = ref([])
            const placeholderLabel: Ref<Record<string, string>> = ref({})
            console.log(checkedValues.value, 'model')

            const transformConnectionsToTree = (connectorId: string) =>
                store.list
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
                                slots: {
                                    title: 'title',
                                },
                            }
                        }
                    })

            const transformConnectorToTree = (data: any) => {
                const tree: Record<string, any>[] = []
                data.forEach((item: any) => {
                    const treeNodeObj = {
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
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
            @apply rounded-lg !important;
        }
    }
</style>