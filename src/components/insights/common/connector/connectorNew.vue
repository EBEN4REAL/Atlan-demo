<template>
    <div class="w-full pb-3">
        <a-dropdown overlayClassName="dropdown-overlay" :trigger="['click']">
            <div class="flex items-center w-full cursor-pointer">
                <div class="flex flex-row items-center w-full">
                    <span class="mr-2" style="font-size: 28px"
                        ><AtlanIcon
                            :icon="getContextName(`icon`)"
                            class="w-6 h-6 text-gray-500"
                        ></AtlanIcon
                    ></span>
                    <div class="flex flex-col w-full bg">
                        <!-- <div
                            class="flex items-center w-full text-sm cursor-pointer max-full place-content-between"
                            :class="[
                                getContextName(`database`) ===
                                'Select database context'
                                    ? `${$style.empty_db_state}`
                                    : `${$style.filled_db_state}`,
                            ]"
                        >
                            {{ getContextName(`database`) }}
                        </div> -->
                        <Tooltip
                            :tooltip-text="getContextName(`database`)"
                            classes="cursor-pointer text-base  text-gray-700 w-full"
                            :class="[
                                getContextName(`database`) ===
                                'Select database context'
                                    ? `${$style.empty_db_state}`
                                    : `${$style.filled_db_state}`,
                            ]"
                        >
                        </Tooltip>
                        <span
                            :class="[
                                getContextName(`schema`) ===
                                'Select schema context'
                                    ? `text-gray-500`
                                    : ``,
                            ]"
                            class="mr-1 text-sm truncate"
                            >{{ getContextName(`schema`) }}</span
                        >
                    </div>
                    <div class="w-4">
                        <AtlanIcon
                            icon="ChevronDown"
                            class="w-4 h-4 text-gray-500"
                        ></AtlanIcon>
                    </div>
                </div>
            </div>
            <template #overlay>
                <a-menu
                    v-model:openKeys="openKeys"
                    class="w-full py-2 rounded-lg"
                    mode="vertical"
                    @click="handleClick"
                >
                    <a-sub-menu
                        class="submenu"
                        key="sub1"
                        popupClassName="submenu-popup"
                    >
                        <template #title>
                            <div class="submenu-title-content">
                                <AtlanIcon
                                    :icon="getContextName(`icon`)"
                                    class="w-4 h-4 mr-1 text-gray-500"
                                    style="margin-top: 0.125rem"
                                ></AtlanIcon>
                                <span>
                                    <span class="text-gray-500"
                                        >Connection
                                    </span>
                                    <br />
                                    <span class="text-base">{{
                                        getContextName(`connector`)
                                    }}</span>
                                </span>
                            </div>
                        </template>
                        <div class="w-56 pt-1 pb-2">
                            <!-- <div
                                class="flex flex-row space-x-2"
                                :class="$style.schemaTreeStyles"
                            >
                                <a-input
                                    class="h-8 mt-1 text-base border-t-0 border-l-0 border-r-0 rounded-none"
                                    placeholder="Search 12 connections"
                                    bordered="false"
                                    :class="$style.inputSearch"
                                    v-model:value="searchValue"
                                    style="margin-bottom: 8px"
                                >
                                    <template #prefix>
                                        <AtlanIcon
                                            icon="Search"
                                            color="#6F7590"
                                        />
                                    </template>
                                </a-input>
                            </div> -->
                            <div class="tree-container">
                                <a-tree
                                    :class="[
                                        $style.tree_selecttor,
                                        bgGrayForSelector
                                            ? `${$style.selector_bg}`
                                            : '',
                                    ]"
                                    style="width: 100%"
                                    v-model:treeExpandedKeys="expandedKeys"
                                    v-model:selectedKeys="selectedKeys"
                                    :dropdownStyle="{
                                        maxHeight: '400px',
                                        overflow: 'auto',
                                    }"
                                    :tree-data="treeData"
                                    :allowClear="false"
                                    :block-node="true"
                                    ref="treeRef"
                                    @change="onChange"
                                    :data-test-id="'conector'"
                                    @click="handleOnClick"
                                    @select="selectNodeTree"
                                    class="tree-select-nodes"
                                >
                                    <template #switcherIcon>
                                        <AtlanIcon icon="CaretRight" />
                                    </template>
                                    <template #title="node">
                                        <div class="flex items-center truncate">
                                            <AtlanIcon
                                                :icon="iconName(node)"
                                                class="h-4 mr-2"
                                            />
                                            <span
                                                class="parent-ellipsis-container-base"
                                                >{{
                                                    node
                                                        ? nodeStringFilter(
                                                              node.title
                                                          )
                                                        : null
                                                }}
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
                                </a-tree>
                            </div>
                        </div>
                    </a-sub-menu>

                    <a-sub-menu class="submenu" key="sub2">
                        <template #title>
                            <div class="submenu-title-content">
                                <AtlanIcon
                                    icon="DatabaseGray"
                                    class="w-4 h-4 mr-1 text-gray-500"
                                    style="margin-top: 0.125rem"
                                ></AtlanIcon>
                                <span>
                                    <span class="text-gray-500">Database</span>
                                    <br />
                                    <span class="text-base">{{
                                        getContextName(`database`)
                                    }}</span>
                                </span>
                                <span
                                    class="self-center ml-auto mr-6 text-gray-500 clear-btn"
                                >
                                    <button
                                        @click="clearStateDBHandle"
                                        class="hover:text-primary"
                                        :class="[
                                            getContextName(`database`) ===
                                            'Select database context'
                                                ? `${$style.clear_btn_invisible}`
                                                : `${$style.clear_btn_visible}`,
                                        ]"
                                    >
                                        clear
                                    </button>
                                </span>
                            </div>
                        </template>
                        <div
                            class="w-56 pb-2 overflow-x-hidden overflow-y-scroll max-h-96"
                        >
                            <AssetDropdownNewDatabase
                                v-if="connection"
                                v-model:clearStateDB="clearStateDB"
                                :connector="filteredConnector"
                                :filter="data"
                                @change="handleChange"
                                :bgGrayForSelector="bgGrayForSelector"
                                @label-change="setPlaceholder($event, 'asset')"
                            ></AssetDropdownNewDatabase>
                        </div>
                    </a-sub-menu>

                    <a-sub-menu
                        class="submenu"
                        key="sub3"
                        :disabled="
                            getContextName(`schema`) === '' ? true : false
                        "
                    >
                        <template #title>
                            <div class="submenu-title-content">
                                <AtlanIcon
                                    icon="SchemaGray"
                                    class="w-4 h-4 mr-1 text-gray-500"
                                    style="margin-top: 0.125rem"
                                ></AtlanIcon>
                                <span>
                                    <span class="text-gray-500">Schema</span>
                                    <br />
                                    <span class="text-base">{{
                                        getContextName(`schema`) === ''
                                            ? 'Select schema context'
                                            : getContextName(`schema`)
                                    }}</span>
                                </span>
                                <span
                                    class="self-center ml-auto mr-6 text-gray-500 clear-btn"
                                >
                                    <button
                                        @click="clearStateSchemaHandle"
                                        class="hover:text-primary"
                                        :class="[
                                            getContextName(`schema`) ===
                                            'Select schema context'
                                                ? `${$style.clear_btn_invisible}`
                                                : `${$style.clear_btn_visible}`,
                                        ]"
                                    >
                                        clear
                                    </button>
                                </span>
                            </div></template
                        >
                        <div
                            class="w-56 pb-2 overflow-x-hidden overflow-y-scroll"
                        >
                            <AssetDropdownNewSchema
                                v-if="connection"
                                v-model:clearStateSchema="clearStateSchema"
                                :connector="filteredConnector"
                                :filter="data"
                                @change="handleChange"
                                :bgGrayForSelector="bgGrayForSelector"
                                @label-change="setPlaceholder($event, 'asset')"
                            ></AssetDropdownNewSchema>
                        </div>
                    </a-sub-menu>
                </a-menu>
            </template>
        </a-dropdown>
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
        reactive,
    } from 'vue'
    import { capitalizeFirstLetter } from '~/utils/string'
    import { List } from '~/constant/status'
    import { useConnectionStore } from '~/store/connection'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import AssetDropdownNewDatabase from '~/components/common/dropdown/assetDropdownNewDatabase.vue'
    import AssetDropdownNewSchema from '~/components/common/dropdown/assetDropdownNewSchema.vue'

    import Tooltip from '@/common/ellipsis/index.vue'
    import type { MenuProps } from 'ant-design-vue'

    export default defineComponent({
        components: {
            AssetDropdown,
            AssetDropdownNewDatabase,
            AssetDropdownNewSchema,
            Tooltip,
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
            const searchValue = ref('')
            const clearStateDB = ref(false)
            const clearStateSchema = ref(false)

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

            // undefined is necessary here to show the placeholder
            const selectedValue = computed(() => {
                const tempValue =
                    connection.value || connector.value || undefined
                // console.log('valueHere', tempValue)
                // selectedKeys.value.splice(0, selectedKeys.length)
                // selectedKeys.value.push(tempValue)
                return tempValue
            })

            const expandedKeys = ref<string[]>([])
            const selectedKeys = ref<string[]>([
                connection.value || connector.value || undefined,
            ])

            // const state = reactive({
            //     selectedKeys: [],
            //     openKeys: [],
            // })
            // const handleClick: MenuProps['onClick'] = (menuInfo) => {
            //     console.log('click ', menuInfo)
            // }

            const selectNodeTree = (selected, event: any) => {
                console.log('selectNodeTree:', selected)
                let value = selected[0]
                let node = event['node']

                console.log('node: ', node)

                console.log('valueHere', value)
                selectedKeys.value.splice(0, selectedKeys.value.length)
                selectedKeys.value.push(value)

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

                emit('update:data', payload)
                emit('change')
                emit('changeConnector')
            }

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

            const nodeStringFilter = (title) => {
                if (
                    title === 'athena' ||
                    title === 'snowflake' ||
                    title === 'powerbi' ||
                    title === 'tableau' ||
                    title === 'databricks' ||
                    title === 'redshift' ||
                    title === 'mysql' ||
                    title === 'bigquery'
                ) {
                    switch (title) {
                        case 'snowflake':
                            return 'Snowflake'
                        case 'athena':
                            return 'Athena'
                        case 'powerbi':
                            return 'PowerBI'
                        case 'tableau':
                            return 'Tableau'
                        case 'databricks':
                            return 'Databricks'
                        case 'redshift':
                            return 'Redshift'
                        case 'mysql':
                            return 'MySQL'
                        case 'bigquery':
                            return 'BigQuery'
                    }
                } else {
                    return title
                }
            }

            const iconName = (node) => {
                if (node?.connection === undefined) {
                    if (node.title === 'bigquery') return 'BigQuery'
                    if (node.title === 'mysql') return 'MySQL'

                    return capitalizeFirstLetter(node.title)
                }
                const el = node?.key?.split('/')
                if (el && el.length) {
                    if (el[1] === 'bigquery') return 'BigQuery'
                    if (el[1] === 'mysql') return 'MySQL'
                    return capitalizeFirstLetter(el[1])
                }
                return ''
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

            // Filling in the state values of the schema explorer for connectors, DB, and Schema
            const getContextName = (item) => {
                const chunks = data.value?.attributeValue?.split('/')
                const connectorKey = `${chunks[0]}/${chunks[1]}/${chunks[2]}`

                if (item === 'connector') {
                    if (chunks?.length > 2) {
                        const obj = treeData.value.find(
                            ({ connector }) => connector === chunks[1]
                        )
                        const child = obj.children.find(
                            ({ key }) => key === connectorKey
                        )
                        return child.title
                    }
                    if (chunks?.length > 1) return 'Select connector context'
                    return ''
                }

                if (item === 'icon') {
                    if (chunks?.length > 2) {
                        if (chunks[1] === 'bigquery') return 'BigQuery'
                        if (chunks[1] === 'mysql') return 'MySQL'
                        return capitalizeFirstLetter(chunks[1])
                    }
                    return ''
                }

                if (item === 'database') {
                    if (chunks?.length > 3) return chunks[3]
                    if (chunks?.length > 2) return 'Select database context'
                    return ''
                }
                if (item === 'schema') {
                    if (chunks?.length > 4) return chunks[4]
                    if (chunks?.length > 3) return 'Select schema context'
                    return ''
                }
                return ''
            }

            const clearStateDBHandle = () => {
                // console.log(
                //     'clearStateDB called in parent before',
                //     clearStateDB.value
                // )
                clearStateDB.value = true
                // console.log(
                //     'clearStateDB called in parent after',
                //     clearStateDB.value
                // )
            }

            const clearStateSchemaHandle = () => {
                // console.log(
                //     'clearStateSchema called in parent before',
                //     clearStateSchema.value
                // )
                clearStateSchema.value = true
                // console.log(
                //     'clearStateSchema called in parent after',
                //     clearStateSchema.value
                // )
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

                nodeStringFilter,
                // ...toRefs(state),
                // handleClick,
                selectNodeTree,
                onBlur,
                toggleVisibilityOfChildren,
                getContextName,
                searchValue,
                clearStateDBHandle,
                clearStateSchemaHandle,
                clearStateDB,
                clearStateSchema,
                getConnectorImage,
                iconName,
                selectedKeys,
            }
        },
    })
</script>
<style lang="less">
    .connectorSelectPopover {
        .ant-popover-inner-content {
            width: 250px !important;
        }
    }
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
    .ant-tree-switcher_open {
        transform: rotate(90deg);
    }
    .parent-ellipsis-container-base {
        white-space: break-spaces;
        word-break: break-word;
    }
    .ant-input-affix-wrapper-focused {
        box-shadow: none !important;
    }
    .ant-dropdown-menu-submenu-title {
        padding: 8px 16px !important;
    }
    .ant-dropdown-menu-submenu-title .ant-dropdown-menu-submenu-expand-icon {
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .submenu-title-content {
        display: flex;
    }
    .submenu-popup {
        top: 0 !important;
    }
    .tree-select-nodes .ant-tree-list-holder-inner {
        padding-left: 1rem !important;
    }

    .tree-container {
        max-height: 450px;
        overflow: scroll;
    }

    .submenu .clear-btn {
        visibility: hidden;
    }

    .submenu:hover .clear-btn {
        visibility: visible;
    }

    .ant-dropdown-menu-submenu-disabled .clear-btn {
        visibility: hidden !important;
    }

    .dropdown-overlay {
        // max-width: 200px !important;
        // @apply max-w-full;
    }
</style>
<style lang="less" module>
    // .schemaTreeStyles {
    //     :global(.ant-tree-treenode-switchers-open) {
    //         transform: rotate(90deg);
    //     }
    // }
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
    .empty_db_state {
        :global(.ant-typography) {
            @apply text-gray-500 !important;
        }
    }

    .filled_db_state {
        @apply font-bold !important;
        // @apply hover:underline !important;
    }

    // .clear_btn_visible {
    //     visibility: visible !important;
    // }
    .clear_btn_invisible {
        visibility: hidden !important;
    }
</style>
