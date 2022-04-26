<template>
    <div
        class="flex flex-wrap items-center justify-between w-full pb-1.5 mt-2 px-4"
    >
        <!-- <div class="flex items-center mr-3" v-if="activeInlineTab?.queryId"> -->
        <div class="flex items-center mr-3">
            <div
                v-if="activeInlineTab?.queryId && activeInlineTab?.attributes"
                class="flex items-center transition rounded-sm"
                style="max-width: 16rem"
            >
                <div class="mt-1">
                    <AtlanIcon
                        :icon="
                            getEntityStatusIcon(
                                showVQB ? 'vqb' : 'query',
                                activeInlineTab?.status
                            )
                        "
                        class="w-4 h-4 my-auto mr-1 -mt-0.5"
                    ></AtlanIcon>
                </div>

                <input
                    v-if="renameQueryFieldActive"
                    ref="editableQueryField"
                    :value="queryNameDirty"
                    :size="queryNameDirty.length"
                    class="w-full pr-1 mt-1 mr-1 text-base text-gray-700 border-none outline-none"
                    style="max-width: 95%"
                    @input="updateQueryNameDirty"
                    :readonly="readOnly"
                />
                <Tooltip
                    v-else
                    :tooltip-text="`${activeInlineTab.label}`"
                    :classes="'w-full mt-0.5 mr-1 text-base text-gray-700'"
                    tooltip-color="#363636"
                    @click="handleRenameQuery"
                />
            </div>

            <div v-else class="flex items-center pl-3" style="max-width: 16rem">
                <div class="mt-1">
                    <AtlanIcon
                        :icon="
                            getEntityStatusIcon(
                                showVQB ? 'vqb' : 'query',
                                activeInlineTab?.status
                            )
                        "
                        class="w-4 h-4 my-auto mr-1 -mt-0.5"
                    ></AtlanIcon>
                </div>
                <Tooltip
                    :tooltip-text="`${activeInlineTab.label}`"
                    :classes="'w-full mt-0.5 mr-1 text-base text-gray-700'"
                    tooltip-color="#363636"
                />
            </div>

            <span
                v-if="readOnly"
                class="px-1 py-0.5 bg-primary-light text-xs text-gray-500 border rounded border-gray-300 mx-2"
            >
                Read Only
            </span>

            <span v-else>
                <Shortcut
                    v-if="activeInlineTab.queryId && !activeInlineTab.isSaved"
                    shortcut-key="cmd+s"
                    action="Update Query"
                    placement="right"
                    :edit-permission="true"
                >
                    <AtlanBtn
                        size="sm"
                        color="secondary"
                        padding="compact"
                        class="flex items-center justify-between ml-2 border-gray-300 h-7 group"
                        :class="isUpdating ? 'px-4.5' : 'px-2'"
                        :disabled="
                            activeInlineTab.isSaved && activeInlineTab.queryId
                        "
                        @click="$emit('onClickSaveQuery')"
                    >
                        <div
                            class="flex items-center transition duration-150 rounded group-hover:text-primary"
                        >
                            <AtlanIcon
                                v-if="!isUpdating"
                                style="margin-right: 2.5px"
                                icon="Save"
                            ></AtlanIcon>
                            <AtlanIcon
                                v-else
                                icon="CircleLoader"
                                style="margin-right: 2.5px"
                                class="w-4 h-4 animate-spin"
                            ></AtlanIcon>

                            <span>Update</span>
                        </div>
                    </AtlanBtn>
                </Shortcut>

                <div
                    v-else-if="
                        activeInlineTab.queryId && activeInlineTab.isSaved
                    "
                    class="transition duration-150 hover:text-primary"
                >
                    <a-tooltip
                        color="#363636"
                        class="flex items-center h-6 ml-2 border-none cursor-pointer opacity-70 button-shadow"
                    >
                        <template #title>
                            updated
                            {{ useTimeAgo(activeInlineTab?.updateTime)?.value }}
                            by
                            {{ activeInlineTab.updatedBy }}
                        </template>
                        <AtlanIcon class="mr-1" icon="Check" />Saved
                    </a-tooltip>
                </div>

                <Shortcut
                    v-else
                    shortcut-key="cmd+s"
                    action="Save Query"
                    placement="right"
                    :edit-permission="true"
                >
                    <AtlanBtn
                        size="sm"
                        color="secondary"
                        padding="compact"
                        class="flex items-center px-3 ml-2 border-gray-300 h-7"
                        @click="$emit('onClickSaveQuery')"
                    >
                        <div
                            class="flex items-center transition duration-150 group-hover:text-primary"
                        >
                            <AtlanIcon
                                style="margin-right: 2.5px"
                                icon="Save"
                            ></AtlanIcon>

                            <span>Save</span>
                        </div>
                    </AtlanBtn>
                </Shortcut>
            </span>
        </div>

        <div class="flex items-center">
            <a-popover
                trigger="click"
                placement="bottomRight"
                :class="$style.context_popover"
                :overlay-style="{
                    paddingTop: '0px',
                }"
                @visibleChange="onPopoverVisibleChange"
            >
                <template #content>
                    <div class="p-4" style="width: 332px">
                        <Connector
                            v-model:data="connectorsData"
                            class=""
                            :filter-source-ids="BItypes"
                            :is-leaf-node-selectable="false"
                            :item="{
                                id: 'connector',
                                label: 'Connector',
                                component: 'connector',
                                overallCondition: 'OR',
                                filters: [
                                    {
                                        attributeName: 'connector',
                                        condition: 'OR',
                                        isMultiple: false,
                                        operator: 'eq',
                                    },
                                ],
                                isDeleted: false,
                                isDisabled: false,
                                exclude: false,
                            }"
                            @change="handleChange"
                            @update:data="setConnector"
                        ></Connector>
                    </div>
                </template>
                <div
                    class="flex items-center text-gray-500 border border-white rounded cursor-pointer hover:bg-gray-light p-0.5"
                    :class="[
                        popoverVisible ? 'bg-gray-light' : '',
                        readOnly
                            ? 'pointer-events-none bg-gray-100 rounded px-1 '
                            : '',
                    ]"
                >
                    <div class="flex items-center">
                        <AtlanIcon
                            v-if="readOnly"
                            icon="Lock"
                            class="w-4 h-4 mr-1"
                        />
                        <img
                            v-if="
                                connectionName &&
                                getConnectorImage(connectorAsset?.id).includes(
                                    '/'
                                )
                            "
                            :src="getConnectorImage(connectorAsset?.id)"
                            class="w-4 h-4 mr-1"
                            style="min-width: 1rem"
                        />
                    </div>
                    <div
                        v-if="!activeInlineTab?.assetSidebar?.isVisible"
                        class="flex items-center"
                    >
                        <div class="flex items-center">
                            <div v-if="connectionName">
                                <div
                                    v-if="
                                        activeInlineTab?.explorer?.schema
                                            ?.connectors?.attributeValue !==
                                        activeInlineTab?.playground?.editor
                                            ?.context?.attributeValue
                                    "
                                    class="flex items-center"
                                >
                                    <div class="text-gray-700">
                                        {{ connectionName }}
                                    </div>
                                    <div
                                        :class="
                                            schemaName
                                                ? `text-gray-700`
                                                : `text-gray-500`
                                        "
                                        class="text-base font-bold"
                                    >
                                        .
                                    </div>
                                </div>
                            </div>

                            <span v-else class="text-gray-500"
                                >Select Connector</span
                            >
                        </div>
                        <div v-if="connectionName" class="flex items-center">
                            <!-- <div class="mx-1">/</div> -->
                            <!-- <AtlanIcon
                            class="w-4 h-4 mr-1 -mt-0.5"
                            icon="DatabaseGrayscale"
                        /> -->
                            <div v-if="databaseName" class="text-gray-700">
                                {{ databaseName }}
                            </div>
                            <div
                                v-if="databaseName"
                                :class="
                                    schemaName
                                        ? `text-gray-700`
                                        : `text-gray-500`
                                "
                                class="text-base font-bold"
                            >
                                .
                            </div>
                            <span v-else class="text-gray-500"
                                >Select database</span
                            >
                            <!-- <div class="mx-1">/</div> -->
                        </div>
                        <div
                            v-if="connectionName && databaseName"
                            class="flex items-center"
                        >
                            <!-- <AtlanIcon
                            class="w-4 h-4 mr-1 -mt-0.5"
                            icon="SchemaGrayscale"
                        /> -->
                            <span v-if="schemaName" class="text-gray-700">{{
                                schemaName
                            }}</span>
                            <span v-else class="text-gray-500"
                                >select schema</span
                            >
                        </div>
                    </div>

                    <div class="flex items-center">
                        <AtlanIcon
                            class="w-4 h-4 ml-1 -mt-0.5"
                            icon="ChevronDown"
                        />
                    </div>
                </div>
            </a-popover>

            <div class="flex items-center ml-2">
                <div class="flex text-sm">
                    <div class="flex mr-3">
                        <a-tooltip
                            placement="bottom"
                            color="#363636"
                            class="flex items-center h-6 px-3 ml-2 border-none cursor-pointer"
                        >
                            <template #title>
                                {{
                                    activeInlineTab?.playground.resultsPane
                                        ?.result?.runQueryId &&
                                    !activeInlineTab?.playground?.resultsPane
                                        ?.result?.buttonDisable
                                        ? 'Abort Query'
                                        : activeInlineTab?.playground
                                              .resultsPane?.result
                                              ?.runQueryId &&
                                          activeInlineTab?.playground
                                              ?.resultsPane?.result
                                              ?.buttonDisable
                                        ? 'Aborting query'
                                        : isQueryRunning === 'loading'
                                        ? 'Running query'
                                        : editorContentSelectionState
                                        ? 'Run selected'
                                        : 'Run query'
                                }}
                            </template>

                            <Shortcut
                                shortcut-key="cmd+enter"
                                action="Run Query"
                                placement="right"
                                :edit-permission="isQueryRunning !== 'loading'"
                            >
                                <AtlanBtn
                                    class="flex items-center px-3 h-7 button-shadow bg-primary"
                                    size="sm"
                                    color="primary"
                                    padding="compact"
                                    :disabled="
                                        activeInlineTab?.playground?.resultsPane
                                            ?.result?.buttonDisable
                                    "
                                    @click="$emit('onClickRunQuery')"
                                >
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            v-if="
                                                isQueryRunning === 'loading'
                                                    ? false
                                                    : true
                                            "
                                            icon="Play"
                                            class="mr-1 text-white rounded"
                                        ></AtlanIcon>
                                        <AtlanIcon
                                            v-else
                                            icon="CircleLoader"
                                            class="w-4 h-4 mr-1 text-white animate-spin"
                                        ></AtlanIcon>
                                        <div>
                                            <span
                                                v-if="
                                                    activeInlineTab.playground
                                                        .resultsPane.result
                                                        .isQueryRunning ===
                                                        'loading' &&
                                                    !activeInlineTab?.playground
                                                        ?.resultsPane?.result
                                                        ?.buttonDisable
                                                "
                                                class="text-white"
                                                >Abort</span
                                            >
                                            <span
                                                v-else-if="
                                                    activeInlineTab?.playground
                                                        ?.resultsPane?.result
                                                        ?.buttonDisable
                                                "
                                                class="text-white"
                                                >Aborting</span
                                            >
                                            <span v-else class="text-white"
                                                >Run</span
                                            >
                                        </div>
                                    </div>
                                </AtlanBtn>
                            </Shortcut>
                        </a-tooltip>
                    </div>
                    <ThreeDotMenu @toggleVQB="$emit('toggleVQB')" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        inject,
        ref,
        watch,
        computed,
        ComputedRef,
        toRaw,
        nextTick,
    } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { useTimeAgo } from '@vueuse/core'
    import { storeToRefs } from 'pinia'
    import { message } from 'ant-design-vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { SourceList } from '~/constant/source'
    import Connector from '~/components/insights/common/connector/connector.vue'
    import ThreeDotMenu from '~/components/insights/playground/editor/threeDotMenu/index.vue'

    import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import AtlanBtn from '~/components/UI/button.vue'
    import { useConnectionStore } from '~/store/connection'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import map from '~/constant/accessControl/map'
    import Tooltip from '@/common/ellipsis/index.vue'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import { QueryCollection } from '~/types/insights/savedQuery.interface'
    import { getBISourceTypes } from '~/composables/connection/getBISourceTypes'
    import { useAuthStore } from '~/store/auth'
    import Shortcut from '@/common/popover/shortcut.vue'
    import { Insights } from '~/services/meta/insights/index'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'EditorContext',
        components: {
            StatusBadge,
            Connector,
            AtlanBtn,
            ThreeDotMenu,
            AtlanIcon,
            Tooltip,
            Shortcut,
            PopoverAsset,
        },
        props: {
            isUpdating: {
                type: Boolean,
                default: false,
            },
            isQueryRunning: {
                type: String,
                default: '',
            },
        },
        emits: ['onClickSaveQuery', 'onClickRunQuery', 'toggleVQB'],
        setup(props) {
            const {
                getConnectionName,
                setContextDataInInlineTab,
                getDatabaseName,
                getSchemaName,
                getConnectorName,
                getConnectionQualifiedName,
            } = useConnector()
            const { modifyActiveInlineTab } = useInlineTab()
            const popoverVisible = ref(false)

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const refreshQueryTree = inject<
                (guid: string, type: 'query' | 'Folder') => void
            >('refreshQueryTree', () => {})
            const updateAssetCheck = inject('updateAssetCheck') as Ref<Boolean>
            // const permissions = inject('permissions') as ComputedRef<any>

            const connectorsData: Ref<connectorsWidgetInterface> = ref(
                activeInlineTab.value?.playground?.editor?.context ?? {
                    attributeName: undefined,
                    attributeValue: undefined,
                }
            )

            const editorContentSelectionState = inject(
                'editorContentSelectionState'
            ) as Ref<boolean>

            // watch(editorContentSelectionState, () => {
            //     console.log('context select')
            // })
            const authStore = useAuthStore()
            const { permissions } = storeToRefs(authStore)

            const BItypes = getBISourceTypes()

            const userHasPermission = computed(() => {
                permissions.value.indexOf('CREATE_COLLECTION') >= 0
            })

            const isQueryCreatedByCurrentUser = inject(
                'isQueryCreatedByCurrentUser'
            ) as ComputedRef
            const hasQueryReadPermission = inject(
                'hasQueryReadPermission'
            ) as ComputedRef
            const hasQueryWritePermission = inject(
                'hasQueryWritePermission'
            ) as ComputedRef

            const readOnly = computed(() =>
                activeInlineTab?.value?.qualifiedName?.length === 0
                    ? false
                    : isQueryCreatedByCurrentUser.value
                    ? false
                    : !hasQueryWritePermission.value
            )

            const store = useConnectionStore()

            const connectorName = computed(() =>
                getConnectorName(connectorsData.value.attributeValue)
            )
            const getConnectorImage = (sourceid) =>
                store.getConnectorImageMapping[sourceid?.toLowerCase()]

            const connectionName = computed(() => {
                // console.log('store list: ', store.getList)
                const data = getConnectionQualifiedName(
                    connectorsData.value.attributeValue
                )

                const connectionData = store.getList.find(
                    (connection) =>
                        connection?.attributes?.qualifiedName === data
                )
                const name = connectionData?.attributes?.name
                // console.log('connection data: ', connectionData)
                return name
            })
            const databaseName = computed(() =>
                getDatabaseName(connectorsData.value.attributeValue)
            )
            const schemaName = computed(() =>
                getSchemaName(connectorsData.value.attributeValue)
            )

            const connectorAsset = computed(() =>
                SourceList.find((source) => source.id === connectorName.value)
            )

            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >

            const collectionName = computed(() => {
                const col = queryCollections.value?.find(
                    (col) =>
                        col.attributes.qualifiedName ===
                        activeInlineTab.value.attributes.collectionQualifiedName
                )
                return col?.displayText
            })

            const handleChange = () => {
                /* Here we are making a change, so isSaved will be false */
                // activeInlineTab.value.isSaved = false
                setContextDataInInlineTab(activeInlineTab, tabs, connectorsData)
            }

            const setConnector = (payload: any) => {
                connectorsData.value = payload
            }
            const onPopoverVisibleChange = () => {
                popoverVisible.value = !popoverVisible.value
            }
            const queryNameDirty = ref(
                activeInlineTab.value.label
            ) as Ref<string>
            /* Watchers for updating the connectors when activeinlab change */
            watch(
                activeInlineTab,
                () => {
                    if (activeInlineTab.value) {
                        if (
                            activeInlineTab.value?.playground?.editor?.context
                                ?.attributeName
                        ) {
                            connectorsData.value =
                                activeInlineTab.value?.playground?.editor?.context
                        }
                        queryNameDirty.value = activeInlineTab.value
                            ?.label as string
                    } else {
                        connectorsData.value = {
                            attributeName: undefined,
                            attributeValue: undefined,
                        }
                    }
                },
                { immediate: true }
            )
            const showVQB = computed(
                () => activeInlineTab?.value?.playground?.isVQB
            )

            const renameQueryFieldActive = ref(false)

            const editableQueryField = ref(null)

            const renameQuery = () => {
                if (
                    queryNameDirty.value !== activeInlineTab.value.label &&
                    queryNameDirty.value
                ) {
                    const updatedAttributes = {
                        ...activeInlineTab.value.attributes,
                        name: queryNameDirty.value,
                    }
                    // make api call
                    const { data, error, isLoading } =
                        Insights.CreateQueryFolder(
                            {
                                entity: {
                                    attributes: updatedAttributes,
                                    typeName: 'Query',
                                },
                            },
                            {}
                        )
                    // handle error
                    watch(
                        error,
                        () => {
                            if (isLoading.value === false) {
                                if (error.value !== undefined) {
                                    queryNameDirty.value = activeInlineTab.value
                                        .label as string
                                    message.error({
                                        content: `Query rename failed`,
                                    })
                                }
                                renameQueryFieldActive.value = false
                            }
                        },
                        { immediate: true }
                    )

                    // update state
                    watch(data, () => {
                        message.success('Query renamed successfully')
                        if (data.value !== undefined) {
                            updateAssetCheck.value = true
                            const parentGuid =
                                activeInlineTab?.value?.attributes?.parent
                                    ?.guid ?? ''

                            refreshQueryTree(parentGuid, 'query')

                            if (activeInlineTab?.value?.attributes?.name) {
                                const activeInlineTabCopy: activeInlineTabInterface =
                                    JSON.parse(
                                        JSON.stringify(
                                            toRaw(activeInlineTab.value)
                                        )
                                    )
                                activeInlineTabCopy.attributes.name =
                                    queryNameDirty.value
                                activeInlineTabCopy.label = queryNameDirty.value

                                if (
                                    activeInlineTabCopy?.assetSidebar?.assetInfo
                                        ?.attributes?.__guid ===
                                    activeInlineTabCopy?.attributes?.__guid
                                ) {
                                    activeInlineTabCopy.assetSidebar.assetInfo.attributes.name =
                                        queryNameDirty.value
                                    activeInlineTabCopy.assetSidebar.assetInfo.displayText =
                                        queryNameDirty.value
                                }
                                if (
                                    data.value?.mutatedEntities?.UPDATE
                                        ?.length > 0
                                ) {
                                    activeInlineTabCopy.updateTime =
                                        data.value?.mutatedEntities?.UPDATE[0].updateTime
                                    activeInlineTabCopy.updatedBy =
                                        data.value?.mutatedEntities?.UPDATE[0].updatedBy
                                }
                                modifyActiveInlineTab(
                                    activeInlineTabCopy,
                                    tabs,
                                    activeInlineTabCopy.isSaved,
                                    true
                                )
                            }
                            useAddEvent(
                                'insights',
                                'query',
                                'renamed',
                                undefined
                            )
                            renameQueryFieldActive.value = false
                        }
                    })
                }
            }

            const handleRenameQuery = () => {
                queryNameDirty.value = activeInlineTab.value?.label as string
                renameQueryFieldActive.value = true
                nextTick(() => {
                    if (editableQueryField.value) {
                        editableQueryField.value.addEventListener(
                            'keydown',
                            (e) => {
                                if (e.key === 'Escape') {
                                    renameQueryFieldActive.value = false
                                    queryNameDirty.value =
                                        activeInlineTab.value.label
                                    // queryNameDirty.value = ''
                                }
                                if (e.key === 'Enter') {
                                    renameQuery()
                                    // queryNameDirty.value = ''
                                }
                            }
                        )
                        editableQueryField.value.addEventListener(
                            'blur',
                            () => {
                                renameQuery()
                                // queryNameDirty.value = ''
                            }
                        )
                        editableQueryField?.value?.focus()
                    }
                })
            }
            const updateQueryNameDirty = (e) => {
                queryNameDirty.value = e?.target?.value
            }
            return {
                getConnectorImage,
                showVQB,
                popoverVisible,
                onPopoverVisibleChange,
                connectionName,
                connectorName,
                schemaName,
                databaseName,
                setConnector,
                connectorsData,
                handleChange,
                connectorAsset,
                activeInlineTab,
                getEntityStatusIcon,
                useTimeAgo,
                // permissions,

                isQueryCreatedByCurrentUser,
                hasQueryWritePermission,
                hasQueryReadPermission,
                readOnly,
                map,
                userHasPermission,
                editorContentSelectionState,
                collectionName,
                BItypes,
                queryNameDirty,
                renameQueryFieldActive,
                handleRenameQuery,
                editableQueryField,
                updateQueryNameDirty,
            }
        },
    })
</script>
<style lang="less" module>
    .context_popover {
        :global(.ant-popover) {
            top: 98px !important;
        }
    }
</style>
<style lang="less" scoped>
    .connector_icon {
        margin-top: -2.3px;
        margin-right: 2px;
    }
    .button-shadow {
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.12);
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
