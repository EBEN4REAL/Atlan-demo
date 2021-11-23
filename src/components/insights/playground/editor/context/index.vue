<template>
    <div class="flex items-center justify-between w-full px-3 mt-2">
        <!-- <div class="flex items-center mr-3" v-if="activeInlineTab?.queryId"> -->

        <div class="flex items-center mr-3">
            <div>
                <AtlanIcon
                    :icon="
                        getEntityStatusIcon('query', activeInlineTab?.status)
                    "
                    class="w-4 h-4 my-auto mr-1 -mt-0.5"
                ></AtlanIcon>
            </div>
            <span
                class="mr-1 text-base text-gray-500"
                v-if="activeInlineTab?.savedQueryParentFolderTitle"
                >{{ activeInlineTab?.savedQueryParentFolderTitle }} /
            </span>
            <span class="mr-1 text-base text-gray-700">{{
                activeInlineTab.label
            }}</span>
            <!-- <div class="-mt-0.5">
                <StatusBadge
                    :status-id="activeInlineTab.status"
                    show-no-status
                ></StatusBadge>
            </div> -->
        </div>
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
                class="
                    flex
                    items-center
                    text-gray-500
                    border border-white
                    rounded
                    cursor-pointer
                    hover:bg-gray-light
                    p-0.5
                "
                :class="popoverVisible ? 'bg-gray-light' : ''"
            >
                <div class="flex items-center">
                    <img
                        v-if="connectionName"
                        :src="connectorAsset?.image"
                        class="w-4 h-4 mx-1 connector_icon"
                    />
                    <!-- <span v-if="connectionName">{{ connectionName }}</span> -->
                    <span v-else class="text-gray-500">Select Connector</span>
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
                        :class="schemaName ? `text-gray-700` : `text-gray-500`"
                        class="text-base font-bold"
                    >
                        .
                    </div>
                    <span v-else class="text-gray-500">Select database</span>
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
                    <span v-else class="text-gray-500">select schema</span>
                </div>
                <div class="flex items-center">
                    <AtlanIcon
                        class="w-4 h-4 ml-1 -mt-0.5"
                        icon="ChevronDown"
                    />
                </div>
            </div>
        </a-popover>
        <!-- <a-dropdown :trigger="['click']">
            <div
                class="flex items-center text-gray-500 border border-white rounded cursor-pointer "
            >
                <div class="flex items-center">
                    <img
                        v-if="connectionName"
                        :src="connectorAsset?.image"
                        class="w-4 h-4 -mt-0.5 mx-1"
                    />
                    <span v-if="connectionName">{{ connectionName }}</span>
                    <span v-else>Select Connection</span>
                </div>
                <div class="flex items-center">
                    <div class="mx-1">/</div>
                    <AtlanIcon
                        class="w-4 h-4 mr-1 -mt-0.5"
                        icon="DatabaseGrayscale"
                    />
                    <div v-if="databaseName">{{ databaseName }}</div>
                    <span v-else>Select database</span>
                    <div class="mx-1">/</div>
                </div>
                <div class="flex items-center">
                    <AtlanIcon
                        class="w-4 h-4 mr-1 -mt-0.5"
                        icon="SchemaGrayscale"
                    />
                    <span v-if="schemaName">{{ schemaName }}</span>
                    <span v-else>Select schema</span>
                </div>
                <div class="flex items-center">
                    <AtlanIcon
                        class="w-4 h-4 ml-1 -mt-0.5"
                        icon="ChevronDown"
                    />
                </div>
            </div>
            <template #overlay>
                <a-menu>
                    <div class="p-4">
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
                </a-menu>
            </template>
        </a-dropdown> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, ref, watch, computed } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import StatusBadge from '@common/badge/status/index.vue'
    import { SourceList } from '~/constant/source'
    import Connector from '~/components/insights/common/connector/connector.vue'
    import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'

    export default defineComponent({
        name: 'Editor Context',
        components: { StatusBadge, Connector },
        props: {},
        setup(props) {
            const {
                getConnectionName,
                setContextDataInInlineTab,
                getDatabaseName,
                getSchemaName,
                getConnectorName,
            } = useConnector()
            const { getFirstQueryConnection } = useUtils()
            const { modifyActiveInlineTab } = useInlineTab()
            const popoverVisible = ref(false)

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>

            const connectorsData: Ref<connectorsWidgetInterface> = ref(
                activeInlineTab.value?.playground?.editor?.context ?? {
                    attributeName: undefined,
                    attributeValue: undefined,
                }
            )

            const connectorName = computed(() =>
                getConnectorName(connectorsData.value.attributeValue)
            )
            const connectionName = computed(() =>
                getConnectionName(connectorsData.value.attributeValue)
            )
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
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
