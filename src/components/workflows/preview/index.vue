<template>
    <div class="flex flex-col h-full">
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
            <div v-if="mode === 'package'">
                <a-button
                    type="primary"
                    class="mt-2"
                    v-if="!route.params.id"
                    @click="handleSetupWorkflow"
                    block
                >
                    <span> Setup Workflow</span>
                </a-button>
            </div>
        </div>

        <Property
            :item="item"
            v-if="mode === 'package'"
            :key="item.metadata.name"
        ></Property>

        <Workflows
            :item="item"
            v-if="mode === 'workflow'"
            :key="item.metadata.name"
        ></Workflows>

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

    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import { useRoute, useRouter } from 'vue-router'

    export default defineComponent({
        name: 'AssetPreview',
        components: {
            PreviewTabsIcon,
            Property: defineAsyncComponent(
                () => import('./property/index.vue')
            ),
            Workflows: defineAsyncComponent(
                () => import('./workflows/index.vue')
            ),
        },

        props: {
            item: {
                type: Object,
                required: false,
                default: () => {},
            },
            mode: {
                type: String,
                required: false,
                default() {
                    return 'workflow'
                },
            },
        },
        emits: ['assetMutation', 'closeDrawer'],
        setup(props, { emit }) {
            const activeKey = ref('detail')
            const { item, mode } = toRefs(props)

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
                router.push(`/workflows/setup/${item.value?.metadata?.name}`)
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
