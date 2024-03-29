<template>
    <div class="flex flex-col h-full overflow-y-hidden">
        <AssetDrawer
            :guid="selectedConnectionId"
            :show-drawer="isDrawerVisible && !!selectedConnectionId"
            :show-mask="false"
            :show-close-btn="true"
            @close-drawer="isDrawerVisible = false"
        />
        <div class="flex flex-col px-4 py-4 border-b border-gray-200">
            <div class="flex items-center" style="padding-bottom: 1px">
                <div class="flex items-center justify-between">
                    <div
                        class="flex items-center flex-grow border-gray-200"
                        v-if="item?.metadata?.annotations"
                    >
                        <div
                            class="relative w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
                        >
                            <img
                                v-if="
                                    item?.metadata?.annotations[
                                        'orchestration.atlan.com/icon'
                                    ]
                                "
                                class="self-center w-6 h-6"
                                :src="
                                    item?.metadata?.annotations[
                                        'orchestration.atlan.com/icon'
                                    ]
                                "
                            />
                            <span
                                v-else-if="
                                    item?.metadata?.annotations[
                                        'orchestration.atlan.com/emoji'
                                    ]
                                "
                                class="self-center w-6 h-6"
                            >
                                {{
                                    item?.metadata?.annotations[
                                        'orchestration.atlan.com/emoji'
                                    ]
                                }}</span
                            >
                            <span v-else class="self-center w-6 h-6">
                                {{ '\ud83d\udce6' }}</span
                            >

                            <div
                                v-if="
                                    item?.metadata?.labels[
                                        'orchestration.atlan.com/certified'
                                    ] === 'true'
                                "
                                class="absolute -right-1 -top-2"
                            >
                                <a-tooltip title="Certified" placement="left">
                                    <span>
                                        <AtlanIcon
                                            icon="Verified"
                                            class="ml-1"
                                        ></AtlanIcon
                                    ></span>
                                </a-tooltip>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div
                                class="flex items-center text-base font-semibold leading-none truncate overflow-ellipsis"
                            >
                                {{
                                    item?.metadata?.annotations[
                                        'orchestration.atlan.com/name'
                                    ]
                                }}
                            </div>

                            <div class="flex text-gray-500">
                                {{
                                    item?.metadata.annotations[
                                        'package.argoproj.io/name'
                                    ]
                                }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template v-if="mode === 'package'">
                <AtlanButton2
                    v-if="!route.params.id"
                    class="mt-2"
                    label="Setup Workflow"
                    @click="handleSetupWorkflow"
                />
            </template>
        </div>
        <div class="flex flex-col overflow-y-auto">
            <Property
                v-if="mode === 'package'"
                :item="item"
                :key="item.metadata.name"
                class="flex-none"
            />

            <Workflows
                v-if="mode === 'workflow'"
                :item="item"
                :key="item.metadata.name"
                class="flex-none"
            />

            <div
                v-if="packageType(item) === 'connector'"
                class="px-5 space-y-1.5 text-sm pb-4"
            >
                <span class="mb-1 text-gray-500"
                    >Existing Connections ({{
                        previousConnectors.length
                    }})</span
                >
                <template v-if="!prevConnLoading">
                    <template v-for="conn in previousConnectors" :key="conn.id">
                        <span
                            class="block font-medium cursor-pointer text-primary hover:underline"
                            @click="handleConnectionSelect(conn.connector)"
                            >{{ conn.label }}</span
                        >
                    </template>
                </template>
                <a-skeleton
                    v-else
                    active
                    :title="false"
                    :paragraph="{ rows: 5 }"
                />
            </div>
        </div>

        <!-- <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.previewtab"
            tab-position="left"
            :destroy-inactive-tab-pane="true"
            style="height: calc(100% - 74px)"
        >
            <a-tab-pane
                v-for="(tab, index) in filteredTabs"
                :key="tab.id"
                :destroy-inactive-tab-pane="true"
            >
                <template #tab>
                    <PreviewTabsIcon
                        :title="tab.tooltip"
                        :icon="tab.icon"
                        :image="tab.image"
                        :emoji="tab.emoji"
                        :active-icon="tab.activeIcon"
                        :is-active="activeKey === index"
                    />
                </template>

                <component
                    :is="tab.component"
                    :item="item"
                    :key="item?.metadata.name"
                ></component>
            </a-tab-pane>
        </a-tabs> -->
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        PropType,
        watch,
        toRefs,
        computed,
        provide,
        defineAsyncComponent,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import AssetDrawer from '@/common/assets/preview/drawer.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { useWorkflowDiscoverList } from '~/workflowsv2/composables/useWorkflowDiscoverList'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    export default defineComponent({
        name: 'PackageSidebar',
        components: {
            PreviewTabsIcon,
            Property: defineAsyncComponent(
                () => import('./workflows/preview/property/index.vue')
            ),
            Workflows: defineAsyncComponent(
                () => import('./workflows/preview/workflows/index.vue')
            ),
            AssetDrawer,
        },

        props: {
            item: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            mode: {
                type: String,
                required: false,
                default: () => 'workflow',
            },
        },
        emits: ['assetMutation', 'closeDrawer'],
        setup(props, { emit }) {
            const activeKey = ref('detail')
            const isDrawerVisible = ref(false)
            const selectedConnectionId = ref(undefined)
            const { item, mode } = toRefs(props)
            const {
                displayName,
                packageType,
                packageName,
                connectorGuid,
                name,
                refName,
            } = useWorkflowInfo()

            if (mode.value === 'workflow') {
                activeKey.value = 'workflow'
            }

            const route = useRoute()

            const tabs = [
                {
                    id: 'detail',
                    name: 'Details',
                    component: 'property',
                    icon: 'Property',
                    activeIcon: 'PropertyActive',
                    tooltip: 'Details',
                    scrubbed: false,
                    requiredInProfile: true,
                    analyticsKey: 'property',
                    mode: ['workflow', 'package'],
                },
                {
                    id: 'workflow',
                    name: 'Workflows',
                    component: 'workflows',
                    icon: 'Relation',

                    tooltip: 'Workflows',
                    scrubbed: false,
                    requiredInProfile: true,
                    analyticsKey: 'property',
                    mode: ['workflow'],
                },
            ]

            const filteredTabs = computed(() =>
                tabs.filter((tab) => tab.mode.includes(mode.value))
            )

            const router = useRouter()

            const handleSetupWorkflow = () => {
                // prettier-ignore
                router.push(`/workflows/setup/${item.value?.metadata?.name}`)
            }

            const {
                list,
                isLoading: prevConnLoading,
                quickChange,
            } = useWorkflowDiscoverList({
                facets: computed(() => ({
                    ui: true,
                    packageName: packageName(item.value),
                })),
                limit: ref(100),
                source: ref({
                    includes: [
                        'metadata.name',
                        'metadata.annotations.package.argoproj.io/name',
                        'metadata.annotations.orchestration.atlan.com/schedule',
                        'metadata.annotations.orchestration.atlan.com/atlanName',
                    ],
                }),
                preference: ref({
                    sort: 'metadata.creationTimestamp-desc',
                }),
            })

            const previousConnectors = computed(() =>
                list.value.map((workflow) => ({
                    id: refName(workflow),
                    connector: connectorGuid(item.value, name(workflow)),
                    label: displayName(item.value, name(workflow)),
                }))
            )

            watch(
                () => packageName(item.value),
                () => {
                    if (packageName(item.value)) {
                        quickChange()
                    }
                }
            )

            const handleConnectionSelect = (id: string) => {
                selectedConnectionId.value = id
                isDrawerVisible.value = true
            }

            return {
                filteredTabs,
                activeKey,
                item,
                mode,
                tabs,
                route,
                handleSetupWorkflow,
                router,
                previousConnectors,
                prevConnLoading,
                packageType,
                isDrawerVisible,
                selectedConnectionId,
                handleConnectionSelect,
            }
        },
    })
</script>

<style lang="less" module>
    .previewtab {
        &:global(.ant-tabs-left) {
            :global(.ant-tabs-nav-container) {
                width: 48px !important;
                @apply ml-0 !important;
            }
            :global(.ant-tabs-tab) {
                padding: 3px 8px !important;
                @apply justify-center;
            }

            :global(.ant-tabs-nav-wrap) {
                @apply pt-3;
            }

            :global(.ant-tabs-content) {
                @apply px-0 h-full !important;
            }
            :global(.ant-tabs-ink-bar) {
                @apply rounded-t-sm;
                margin-bottom: 1px;
            }
            :global(.ant-tabs-tabpane) {
                @apply px-0 !important;
                @apply pb-0 !important;
                @apply h-full !important;
            }

            :global(.ant-tabs-content-holder) {
                @apply h-full !important;
            }
        }
    }
</style>
