<template>
    <div class="flex flex-wrap items-center justify-between w-full px-3 mt-2">
        <!-- <div class="flex items-center mr-3" v-if="activeInlineTab?.queryId"> -->

        <div class="flex items-center mr-3">
            <!-- <a-tooltip
                color="#363636"
                class="flex items-center h-6 border-none"
                v-if="activeInlineTab?.description?.length"
            >
                <template #title>
                    {{ activeInlineTab?.description }}
                </template>
                <div class="flex items-center">
                    <div class="mt-1">
                        <AtlanIcon
                            :icon="
                                getEntityStatusIcon(
                                    'query',
                                    activeInlineTab?.status
                                )
                            "
                            class="w-4 h-4 my-auto mr-1 -mt-0.5"
                        ></AtlanIcon>
                    </div>
 

                    <Tooltip
                        :tooltip-text="`${activeInlineTab.label}`"
                        :classes="'w-full mt-0.5 mr-1 text-base text-gray-700'"
                    />
                </div>
            </a-tooltip> -->
            <div class="flex items-center w-64">
                <div class="mt-1">
                    <AtlanIcon
                        :icon="
                            getEntityStatusIcon(
                                'query',
                                activeInlineTab?.status
                            )
                        "
                        class="w-4 h-4 my-auto mr-1 -mt-0.5"
                    ></AtlanIcon>
                </div>
                <!-- <span
                    class="mt-1 mr-1 text-base text-gray-700 truncate overflow-ellipsis"
                    >{{ activeInlineTab.label }}</span
                > -->

                <Tooltip
                    :tooltip-text="`${activeInlineTab.label}`"
                    :classes="'w-full mt-0.5 mr-1 text-base text-gray-700'"
                    tooltipColor="#363636"
                />
            </div>

            <span
                v-if="readOnly"
                class="px-1 py-0.5 bg-primary-light text-xs text-gray-500 border rounded border-gray-300 mx-2"
            >
                Read Only
            </span>

            <span v-else>
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    v-if="activeInlineTab.queryId && !activeInlineTab.isSaved"
                    class="flex items-center justify-between h-6 ml-2 border-none button-shadow group"
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

                <div
                    v-else-if="
                        activeInlineTab.queryId && activeInlineTab.isSaved
                    "
                    class="transition duration-150 hover:text-primary"
                >
                    <a-tooltip
                        color="#363636"
                        class="flex items-center h-6 px-3 ml-2 border-none cursor-pointer opacity-70 button-shadow"
                    >
                        <template #title>
                            {{ useTimeAgo(activeInlineTab?.updateTime) }}
                            by {{ activeInlineTab.updatedBy }}
                        </template>
                        <AtlanIcon class="mr-1" icon="Check" />Saved
                    </a-tooltip>
                </div>

                <AtlanBtn
                    v-else
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="flex items-center h-6 px-3 ml-2 border-none button-shadow"
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
            </span>
        </div>

        <div class="flex items-center">
            <a-popover
                trigger="click"
                @visibleChange="onPopoverVisibleChange"
                placement="bottomRight"
                :class="$style.context_popover"
                :overlayStyle="{
                    paddingTop: '0px',
                }"
            >
                <template #content>
                    <div class="p-4" style="width: 332px">
                        <Connector
                            class=""
                            :filterSourceIds="['powerBI', 'tableau']"
                            :isLeafNodeSelectable="false"
                            v-model:data="connectorsData"
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
                            icon="Lock"
                            class="w-4 h-4 mr-1"
                            v-if="readOnly"
                        />
                        <img
                            v-if="connectionName"
                            :src="connectorAsset?.image"
                            class="w-4 h-4 mx-1 connector_icon"
                        />
                    </div>
                    <div
                        class="flex items-center"
                        v-if="!activeInlineTab?.assetSidebar?.isVisible"
                    >
                        <div class="flex items-center">
                            <!-- <AtlanIcon
                            icon="Lock"
                            class="w-4 h-4 mr-1"
                            v-if="readOnly"
                        />
                        <img
                            v-if="connectionName"
                            :src="connectorAsset?.image"
                            class="w-4 h-4 mx-1 connector_icon"
                        /> -->
                            <!-- <span v-if="connectionName">{{ connectionName }}</span> -->

                            <div v-if="connectionName">
                                <div
                                    class="flex items-center"
                                    v-if="
                                        activeInlineTab?.explorer?.schema
                                            ?.connectors?.attributeValue !==
                                        activeInlineTab?.playground?.editor
                                            ?.context?.attributeValue
                                    "
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
                        <div class="flex items-center" v-if="connectionName">
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
                            class="flex items-center"
                            v-if="connectionName && databaseName"
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
                    <div class="flex mr-1">
                        <a-tooltip
                            placement="bottom"
                            color="#363636"
                            class="flex items-center h-6 px-3 ml-2 border-none cursor-pointer"
                        >
                            <template #title>
                                {{
                                    editorContentSelectionState
                                        ? 'Run selected'
                                        : 'Run query'
                                }}
                            </template>
                            <AtlanBtn
                                class="flex items-center h-6 px-3 button-shadow bg-primary"
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
                                                !activeInlineTab?.playground
                                                    .resultsPane?.result
                                                    ?.runQueryId
                                            "
                                            class="text-white"
                                            >Run</span
                                        >
                                        <span
                                            v-else-if="
                                                activeInlineTab?.playground
                                                    .resultsPane?.result
                                                    ?.runQueryId &&
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
                                    </div>
                                </div>
                            </AtlanBtn>
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
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import StatusBadge from '@common/badge/status/index.vue'
    import { SourceList } from '~/constant/source'
    import Connector from '~/components/insights/common/connector/connector.vue'
    import ThreeDotMenu from '~/components/insights/playground/editor/threeDotMenu/index.vue'

    import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import AtlanBtn from '~/components/UI/button.vue'
    import { useTimeAgo } from '@vueuse/core'
    import { useConnectionStore } from '~/store/connection'
    import { storeToRefs } from 'pinia'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import map from '~/constant/accessControl/map'
    import Tooltip from '@/common/ellipsis/index.vue'

    import { useAuthStore } from '~/store/auth'
    import { storeToRefs } from 'pinia'

    export default defineComponent({
        name: 'EditorContext',
        components: {
            StatusBadge,
            Connector,
            AtlanBtn,
            ThreeDotMenu,
            AtlanIcon,
            Tooltip,
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
        emits: ['onClickSaveQuery', 'onClickRun', 'toggleVQB'],
        setup(props) {
            const {
                getConnectionName,
                setContextDataInInlineTab,
                getDatabaseName,
                getSchemaName,
                getConnectorName,
                getConnectionQualifiedName,
            } = useConnector()
            const { getFirstQueryConnection } = useUtils()
            const { modifyActiveInlineTab } = useInlineTab()

            const popoverVisible = ref(false)

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
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

            let userHasPermission = computed(() => {
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
                    : hasQueryWritePermission.value
                    ? false
                    : true
            )

            const store = useConnectionStore()

            const connectorName = computed(() =>
                getConnectorName(connectorsData.value.attributeValue)
            )
            const connectionName = computed(() => {
                // console.log('store list: ', store.getList)
                let data = getConnectionQualifiedName(
                    connectorsData.value.attributeValue
                )

                let connectionData = store.getList.find(
                    (connection) =>
                        connection?.attributes?.qualifiedName === data
                )
                let name = connectionData?.attributes?.name
                // console.log('connection data: ', connectionData)
                return name
            })
            const databaseName = computed(() =>
                getDatabaseName(connectorsData.value.attributeValue)
            )
            const schemaName = computed(() =>
                getSchemaName(connectorsData.value.attributeValue)
            )

            const connectorAsset = computed(() => {
                return SourceList.find(
                    (source) => source.id === connectorName.value
                )
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
                    } else {
                        connectorsData.value = {
                            attributeName: undefined,
                            attributeValue: undefined,
                        }
                    }
                },
                { immediate: true }
            )
            return {
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
