<template>
    <div class="w-full">
        <a-tree-select
            :ref="
                (el) => {
                    treeSelectRef = el
                }
            "
            :class="[
                $style.tree_selecttor,
                bgGrayForSelector ? `${$style.selector_bg}` : '',
            ]"
            v-model:treeExpandedKeys="expandedKeys"
            :value="selectedValue"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            data-test-id="connector"
            placeholder="Select a connector"
            dropdownClassName="connectorDropdown"
            :disabled="disabled"
            @change="onChange"
            @select="selectNode"
            @blur="onBlur"
        >
            <template #title="node">
                <div
                    v-if="node.nodeType !== 'info-node'"
                    class="flex items-center truncate selected-connetor"
                    @click="toggleVisibilityOfChildren(node.title)"
                >
                    <AtlanIcon
                        :icon="getConnectorImage(node.connector)"
                        class="w-4 h-4 mr-1"
                        style="min-width: 1rem"
                    />
                    <div class="flex flex-col" v-if="!node?.connection">
                        {{
                            node.title?.length > 1
                                ? `${capitalizeFirstLetter(node.title)}`
                                : node.title
                        }}
                    </div>
                    <div class="flex flex-col" v-else>
                        {{ node.title }}
                    </div>
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
    import { List } from '~/constant/status'
    import { useConnectionStore } from '~/store/connection'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'

    export default defineComponent({
        components: {
            AssetDropdown,
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
                type: Object as PropType<string[]>,
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
            bgGrayForSelector: {
                type: Boolean,
                default: true,
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
                else {
                    let qfChunks = data.value?.attributeValue?.split('/')
                    return qfChunks?.length > 1 ? qfChunks[1] : ''
                }
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
                                value: connection.attributes.qualifiedName,
                                connector: getConnectorName(
                                    connection?.attributes
                                ),
                                connection: connection.attributes.qualifiedName,
                                integrationName: getConnectorName(
                                    connection?.attributes
                                ),
                                children: [],
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
                return tree
            }

            const treeData = computed(() =>
                transformConnectorToTree(filteredList.value)
            )

            const handleChange = ({
                attributeName,
                attributeValue,
            }: Record<string, string>) => {
                if (attributeName && attributeValue) {
                    emit('update:data', { attributeName, attributeValue })
                    emit('change')
                } else {
                    selectNode(data.value?.attributeValue)
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

            const getConnectorImage = (sourceid) => {
                return store.getConnectorImageMapping[sourceid?.toLowerCase()]
            }

            return {
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
                getConnectorImage,
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
        :global(.ant-select-selection-item) {
            // @apply capitalize !important;
        }
    }
    .selector_bg {
        :global(.ant-select-selector) {
            background-color: #fbfbfb !important;
        }
    }
</style>
