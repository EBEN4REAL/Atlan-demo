<template>
    <div
        class="w-full py-1.5 pl-2 pr-2 rounded-lg dropdown-schema-explorer hover:bg-new-gray-200"
        :class="dropdownIsVisible ? 'bg-new-gray-200' : ''"
    >
        <!-- New Design using Popovers instead of menu items -->
        <a-dropdown
            v-model:visible="dropdownIsVisible"
            :overlay-style="{
                maxWidth: '10%',
            }"
            overlayClassName="dropdown-overlay"
            :trigger="['click']"
            destroyPopupOnHide="true"
            @visibleChange="onDropdownIsVisibleChange($event)"
        >
            <div class="flex items-center w-full cursor-pointer">
                <div
                    v-if="getContextName(`database`) === 'Select database'"
                    class="flex flex-row items-center w-full"
                >
                    <div class="flex flex-col w-full bg">
                        <div class="flex flex-shrink-0 mr-2">
                            <img
                                :src="getContextName(`icon`)"
                                class="w-4 h-4 mr-1 mt-0.5"
                            />
                            <Tooltip
                                :tooltip-text="getContextName(`connector`)"
                                classes="cursor-pointer text-base text-gray-700 w-full"
                                :class="[$style.filled_db_state]"
                            >
                            </Tooltip>
                        </div>

                        <span class="mr-1 text-sm text-gray-500 truncate"
                            >Select database</span
                        >
                    </div>
                    <div class="w-4">
                        <AtlanIcon
                            icon="ChevronDown"
                            class="w-4 h-4 text-gray-500"
                        ></AtlanIcon>
                    </div>
                </div>
                <div v-else class="flex flex-row items-center w-full">
                    <span class="flex-shrink-0 mr-2" style="font-size: 28px">
                        <a-tooltip placement="bottomLeft" arrow-point-at-center>
                            <template #title>{{
                                getContextName(`connection`)
                            }}</template>
                            <img
                                v-if="
                                    getContextName(`icon`) !==
                                    'Select connector context'
                                "
                                :src="getContextName(`icon`)"
                                class="w-6 h-6"
                            />
                        </a-tooltip>
                    </span>
                    <div class="flex flex-col w-full bg">
                        <Tooltip
                            :tooltip-text="getContextName(`database`)"
                            classes="cursor-pointer text-base  text-gray-700 w-full"
                            :class="[
                                getContextName(`database`) === 'Select database'
                                    ? `${$style.empty_db_state}`
                                    : `${$style.filled_db_state}`,
                            ]"
                        >
                        </Tooltip>
                        <span
                            :class="[
                                getContextName(`schema`) === 'Select schema'
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
                <div
                    class="flex flex-col w-full py-2 bg-white rounded-lg dropdown-overlay-new"
                >
                    <a-popover
                        placement="rightTop"
                        class="hover:bg-gray-100 selector-popover"
                        mouseEnterDelay="0"
                        mouseLeaveDelay="0.1"
                        overlayClassName="overlay-class"
                        @visibleChange="
                            onConnectionPopoverVisibleChange($event)
                        "
                        destroyTooltipOnHide="true"
                    >
                        <template #content>
                            <div
                                v-if="treeData.length"
                                class="rounded-lg w-60"
                                :class="$style.schemaExplorerTreeStyles"
                            >
                                <!-- Code for tree search -->
                                <!-- <div
                                class="flex flex-row space-x-2"
                                :class="$style.schemaExplorerTreeStyles"
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
                                <div
                                    class="w-full py-1 overflow-x-hidden rounded-lg tree-container"
                                >
                                    <a-tree
                                        v-model:expandedKeys="expandedKeys"
                                        v-model:selectedKeys="selectedKeys"
                                        :class="[
                                            $style.tree_selecttor,
                                            bgGrayForSelector
                                                ? `${$style.selector_bg}`
                                                : '',
                                        ]"
                                        style="width: 100%"
                                        :tree-data="treeData"
                                        :block-node="true"
                                        :auto-expand-parent="false"
                                        ref="treeRef"
                                        :data-test-id="'conector'"
                                        class="tree-select-nodes"
                                        @select="selectNodeTree"
                                        @click="selectNodeTree"
                                    >
                                        <template #switcherIcon>
                                            <AtlanIcon icon="CaretRight" />
                                        </template>
                                        <template #title="node">
                                            <div
                                                class="flex items-center rounded parent-ellipsis-container-base"
                                                style="max-width: 14rem"
                                            >
                                                <img
                                                    :src="iconName(node)"
                                                    class="flex-shrink-0 h-4 mr-2"
                                                />
                                                <Tooltip
                                                    :tooltip-text="
                                                        node
                                                            ? nodeStringFilter(
                                                                  node.title
                                                              )
                                                            : null
                                                    "
                                                    classes="parent-ellipsis-container-base"
                                                    placement="rightTop"
                                                >
                                                </Tooltip>
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
                            <div
                                class="p-3 overflow-x-hidden text-center text-gray-500 rounded-lg w-60 tree-container"
                                :class="$style.schemaExplorerTreeStyles"
                                v-else
                            >
                                No connectors available
                            </div>
                        </template>
                        <div
                            class="flex items-center justify-center px-4 py-2 submenu-title-content"
                        >
                            <img
                                v-if="
                                    getContextName(`icon`) !==
                                    'Select connector context'
                                "
                                :src="getContextName(`icon`)"
                                class="flex-shrink-0 w-6 h-6 mr-1 text-gray-500"
                            />
                            <span class="parent-ellipsis-container-base">
                                <span class="text-gray-500">Connection </span>
                                <br />
                                <span class="text-base">{{
                                    getContextName(`connector`)
                                }}</span>
                            </span>
                            <AtlanIcon
                                icon="CaretRight"
                                class="self-center flex-shrink-0 w-4 h-4 ml-auto text-gray-500"
                            ></AtlanIcon>
                        </div>
                    </a-popover>

                    <a-popover
                        placement="rightTop"
                        class="selector-popover"
                        mouseEnterDelay="0"
                        mouseLeaveDelay="0.1"
                        overlayClassName="overlay-class"
                        @visibleChange="onDBPopoverVisibleChange($event)"
                        destroyTooltipOnHide="true"
                    >
                        <template #content>
                            <div
                                class="overflow-x-hidden overflow-y-hidden w-60 py-0.5"
                            >
                                <AssetDropdownNewDatabase
                                    v-if="connection"
                                    v-model:clearStateDB="clearStateDB"
                                    :connector="filteredConnector"
                                    :filter="data"
                                    @change="handleChange"
                                    :bgGrayForSelector="bgGrayForSelector"
                                    @label-change="
                                        setPlaceholder($event, 'asset')
                                    "
                                    :DBPopoverVisible="DBPopoverVisible"
                                ></AssetDropdownNewDatabase>
                            </div>
                        </template>
                        <div
                            class="flex items-center justify-center px-4 py-2 submenu-title-content"
                            :class="
                                getContextName(`connection`) ===
                                'Select connector context'
                                    ? `disabled-popover`
                                    : `enabled-popover`
                            "
                        >
                            <AtlanIcon
                                icon="DatabaseGray"
                                class="flex-shrink-0 w-6 h-6 mr-1 text-gray-500"
                            ></AtlanIcon>
                            <span class="parent-ellipsis-container-base">
                                <span class="text-gray-500">Database</span>
                                <br />
                                <span class="text-base">{{
                                    getContextName(`database`)
                                }}</span>
                            </span>
                            <span
                                class="self-center ml-auto mr-4 text-gray-500 clear-btn"
                            >
                                <button
                                    v-if="
                                        getContextName(`database`) !==
                                        'Select database'
                                    "
                                    @click="clearStateDBHandle"
                                    class="hover:text-primary"
                                    :class="[
                                        getContextName(`database`) ===
                                        'Select database'
                                            ? `${$style.clear_btn_invisible}`
                                            : `${$style.clear_btn_visible}`,
                                    ]"
                                >
                                    clear
                                </button>
                            </span>
                            <AtlanIcon
                                icon="CaretRight"
                                class="self-center flex-shrink-0 w-4 h-4 text-gray-500"
                            ></AtlanIcon>
                        </div>
                    </a-popover>

                    <div class="schema-selector-container">
                        <a-popover
                            placement="rightTop"
                            class="selector-popover"
                            mouseEnterDelay="0"
                            mouseLeaveDelay="0.05"
                            overlayClassName="overlay-class"
                            @visibleChange="
                                onSchemaPopoverVisibleChange($event)
                            "
                            destroyTooltipOnHide="true"
                        >
                            <template #content>
                                <div
                                    class="overflow-x-hidden overflow-y-hidden w-60 py-0.5"
                                >
                                    <AssetDropdownNewSchema
                                        v-if="connection"
                                        v-model:clearStateSchema="
                                            clearStateSchema
                                        "
                                        :connector="filteredConnector"
                                        :filter="data"
                                        @change="handleChange"
                                        :bgGrayForSelector="bgGrayForSelector"
                                        @label-change="
                                            setPlaceholder($event, 'asset')
                                        "
                                        :SchemaPopoverVisible="
                                            SchemaPopoverVisible
                                        "
                                    ></AssetDropdownNewSchema>
                                </div>
                            </template>

                            <div
                                class="flex items-center justify-center px-4 py-2 submenu-title-content"
                                :class="[
                                    getContextName(`schema`) === ''
                                        ? `disabled-popover`
                                        : `enabled-popover`,
                                    getContextName(`connection`) ===
                                    'Select connector context'
                                        ? `disabled-popover`
                                        : `enabled-popover`,
                                ]"
                            >
                                <AtlanIcon
                                    icon="SchemaGray"
                                    class="flex-shrink-0 w-6 h-6 mr-1 text-gray-500"
                                ></AtlanIcon>
                                <span class="parent-ellipsis-container-base">
                                    <span class="text-gray-500">Schema</span>
                                    <br />
                                    <span class="text-base">{{
                                        getContextName(`schema`) === ''
                                            ? 'Select schema'
                                            : getContextName(`schema`)
                                    }}</span>
                                </span>
                                <span
                                    class="self-center ml-auto mr-4 text-gray-500 clear-btn"
                                >
                                    <button
                                        v-if="
                                            getContextName(`schema`) !==
                                                'Select schema' &&
                                            getContextName(`schema`) !== ''
                                        "
                                        :class="[
                                            getContextName(`schema`) ===
                                            'Select schema'
                                                ? `${$style.clear_btn_invisible}`
                                                : `${$style.clear_btn_visible}`,
                                        ]"
                                        class="hover:text-primary"
                                        @click="clearStateSchemaHandle"
                                    >
                                        clear
                                    </button>
                                </span>
                                <AtlanIcon
                                    icon="CaretRight"
                                    class="self-center flex-shrink-0 w-4 h-4 text-gray-500"
                                ></AtlanIcon>
                            </div>
                        </a-popover>
                    </div>
                </div>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        onMounted,
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
    import AssetDropdownNewDatabase from '~/components/common/dropdown/assetDropdownNewDatabase.vue'
    import AssetDropdownNewSchema from '~/components/common/dropdown/assetDropdownNewSchema.vue'

    import Tooltip from '@/common/ellipsis/index.vue'

    export default defineComponent({
        components: {
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
            const dropdownIsVisible = ref(false)

            const ConnectionPopoverVisible = ref(false)
            const DBPopoverVisible = ref(false)
            const SchemaPopoverVisible = ref(false)

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
                                isLeaf: true,
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
                        isLeaf: item?.connection ? true : false,
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
                    selectNode(data?.value?.attributeValue)
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

            // Watcher that resets the selected value of the connection in the tree when a tab is switched in the monaco editor
            watch([connection, connector], () => {
                selectedKeys.value = []
                selectedKeys.value = [
                    connection.value || connector.value || undefined,
                ]
            })

            const selectNodeTree = (selected, event: any) => {
                console.log('selectNodeTree:', selected)
                let value = selected[0]
                let node = event['node']

                console.log('node: ', node)
                console.log('event:', event)

                console.log('valueHere', value)
                // debugger

                if (!(event.event === 'select') && !event.connection) {
                    // Code for expand based on event
                    if (!node?.isLeaf) {
                        const isExpanded = expandedKeys.value?.includes(
                            event.value
                        )
                        if (!isExpanded) {
                            expandedKeys.value.push(event.value)
                        } else if (isExpanded) {
                            const index = expandedKeys.value?.indexOf(
                                event.value
                            )
                            expandedKeys.value?.splice(index, 1)
                        }
                        console.log(
                            'expandedKeys valueHere:',
                            expandedKeys.value
                        )
                    }
                }

                // Checking for selection of same node again to avoid deselection of a connector
                else if (value) {
                    selectedKeys.value.splice(0, selectedKeys.value.length)
                    selectedKeys.value.push(value)

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
                // Runs on reselecting the same node as was selected before
                else {
                    selectedKeys.value = []
                    selectedKeys.value.push(node?.key)
                }
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
                    return store.getConnectorImageMapping[
                        node.title?.toLowerCase()
                    ]
                }
                const el = node?.key?.split('/')
                if (el && el.length) {
                    if (el[1] === 'bigquery')
                        return store.getConnectorImageMapping[
                            el[1]?.toLowerCase()
                        ]
                    if (el[1] === 'mysql')
                        return store.getConnectorImageMapping[
                            el[1]?.toLowerCase()
                        ]
                    return store.getConnectorImageMapping[el[1]?.toLowerCase()]
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
                const chunks = data.value?.attributeValue?.split('/') ?? []
                if (chunks.length == 0) return 'Select connector context'
                const connectorKey = `${chunks[0]}/${chunks[1]}/${chunks[2]}`

                if (item === 'connection' && connectorKey) {
                    if (chunks?.length > 2) {
                        const obj = treeData.value.find(
                            ({ connector }) => connector === chunks[1]
                        )
                        const child = obj?.children.find(
                            ({ key }) => key === connectorKey
                        )
                        return `${nodeStringFilter(chunks[1])}: ${child?.title}`
                    }
                    return ''
                }

                if (item === 'connector' && connectorKey) {
                    if (chunks?.length > 2) {
                        const obj = treeData.value.find(
                            ({ connector }) => connector === chunks[1]
                        )
                        const child = obj?.children.find(
                            ({ key }) => key === connectorKey
                        )
                        return child?.title ?? ''
                    }
                    if (chunks?.length > 1) return 'Select connector context'
                    return ''
                }

                if (item === 'icon') {
                    if (chunks?.length > 2)
                        return store.getConnectorImageMapping[
                            chunks[1]?.toLowerCase()
                        ]
                }

                if (item === 'database') {
                    if (chunks?.length > 3) return chunks[3]
                    if (chunks?.length > 2) return 'Select database'
                    return ''
                }
                if (item === 'schema') {
                    if (chunks?.length > 4) return chunks[4]
                    if (chunks?.length > 3) return 'Select schema'
                    return ''
                }
                return ''
            }

            const clearStateDBHandle = () => {
                clearStateDB.value = true
            }

            const clearStateSchemaHandle = () => {
                clearStateSchema.value = true
            }

            // Resetting the expandedKeys array to close all the expanded tree nodes in connection selector
            const onDropdownIsVisibleChange = (e) => {
                dropdownIsVisible.value = e
                if (!e) expandedKeys.value = []
                if (e) expandedKeys?.value?.push(connector.value)
            }

            // Does nothing at the moment but can be used for future enhancements
            const onConnectionPopoverVisibleChange = (e) => {
                ConnectionPopoverVisible.value = e
            }

            // Used to control the visibility of the DB popover for search field autofocus
            const onDBPopoverVisibleChange = (e) => {
                DBPopoverVisible.value = e
            }

            // Used to control the visibility of the schema popover for search field autofocus
            const onSchemaPopoverVisibleChange = (e) => {
                SchemaPopoverVisible.value = e
            }

            return {
                treeSelectRef,
                filterSourceIds,
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

                dropdownIsVisible,
                onDropdownIsVisibleChange,
                ConnectionPopoverVisible,
                onConnectionPopoverVisibleChange,
                DBPopoverVisible,
                SchemaPopoverVisible,
                onDBPopoverVisibleChange,
                onSchemaPopoverVisibleChange,
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
        white-space: nowrap !important;
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
        padding-right: 1rem !important;
    }

    .tree-container {
        max-height: 450px;
        overflow: scroll;
    }

    .selector-popover .clear-btn {
        visibility: hidden;
    }

    .selector-popover:hover .clear-btn {
        visibility: visible;
    }

    .ant-dropdown-menu-submenu-disabled .clear-btn {
        visibility: hidden !important;
    }

    .ant-tree .ant-tree-node-content-wrapper .tree-select-nodes {
        border-radius: 0 !important;
    }
    .dropdown-schema-explorer .ant-dropdown-trigger {
        min-height: 2.75rem;
    }

    .selector-popover {
        @apply hover:bg-gray-100;
        cursor: pointer;
    }
    .selector-popover.ant-popover-open {
        @apply bg-gray-100;
    }
    .schema-selector-container {
        cursor: not-allowed;
        @apply hover:bg-gray-100;
    }
    .disabled-popover {
        // @apply bg-red-400;
        pointer-events: none;
        opacity: 0.7;
    }
    .enabled-popover {
        // @apply bg-blue-400;
    }
    .dropdown-overlay-new {
        box-shadow: 0 2px 8px #00000026;
    }
    .overlay-class {
        padding-left: 4px;
    }
    .overlay-class .ant-popover-inner {
        border-radius: 8px;
    }
    .overlay-class .ant-popover-content {
        border-radius: 8px;
    }
</style>
<style lang="less" module>
    .schemaExplorerTreeStyles {
        // :global(.ant-tree-treenode-switchers-open) {
        //     transform: rotate(90deg);
        // }
        :global(.ant-tree-treenode) {
            padding-bottom: 0px !important;
            @apply hover:bg-gray-200 !important;
            @apply rounded !important;
        }
        :global(.ant-tree-treenode-selected) {
            padding-bottom: 0px !important;
            @apply hover:bg-primary-light !important;
            @apply rounded !important;

            @apply bg-primary-light !important;
        }
        :global(.ant-tree-node-content-wrapper) {
            @apply hover:bg-transparent !important;
            max-width: 85% !important;
            @apply rounded !important;

            // @applybg-primary-light !important;
        }
        :global(.ant-tree-node-content-wrapper.ant-tree-node-selected) {
            @apply bg-transparent !important;
        }
        :global(.ant-tree-switcher-noop) {
            max-width: 0.5rem !important;
        }
    }
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
    }
    .clear_btn_invisible {
        visibility: hidden !important;
    }
</style>
