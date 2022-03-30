<template>
    <div class="flex flex-col flex-shrink-0 h-full bg-white">
        <div class="flex flex-col px-4 py-4 border-b border-gray-200">
            <div class="flex items-center text-sm gap-x-1">
                <img
                    v-if="icon(workflow)"
                    :src="icon(workflow)"
                    class="w-4 h-auto"
                />
                <span v-else class="w-4 text-xs"> {{ emoji(workflow) }}</span>
                <span class="text-gray-500 truncate">{{ name(workflow) }}</span>
            </div>

            <div class="flex items-center justify-between">
                <span
                    class="font-bold tracking-wide truncate cursor-pointer text-primary hover:underline"
                    >{{ dName }}</span
                >
                <IconButton icon="EnterProfile" />
            </div>
        </div>
        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.wfPreviewTabs"
            style="height: calc(100% - 84px)"
            tab-position="right"
            :destroy-inactive-tab-pane="true"
            class="w-full"
        >
            <a-tab-pane
                v-for="(tab, index) in workflowPreviewTabs"
                :key="index"
                :destroy-inactive-tab-pane="true"
                :class="index === activeKey ? 'flex flex-col' : ''"
            >
                <template #tab>
                    <PreviewTabsIcon
                        :title="tab.tooltip"
                        :icon="tab.icon"
                        :active-icon="tab.activeIcon"
                        :is-active="activeKey === index"
                    />
                </template>

                <component
                    :is="tab.component"
                    :tab="tab"
                    :workflow="workflow"
                    :runs="runs"
                />
            </a-tab-pane>

            <template #moreIcon>
                <div class="flex">
                    <AtlanIcon
                        icon="KebabMenuHorizontal"
                        class="text-primary"
                    ></AtlanIcon>
                </div>
            </template>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineAsyncComponent,
        defineComponent,
        ref,
        toRefs,
    } from 'vue'
    import { workflowPreviewTabs } from '~/workflowsv2/constants/tabs'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { useWorkflowStore } from '~/workflowsv2/store'

    export default defineComponent({
        name: 'WorkflowPreview',
        components: {
            PreviewTabsIcon,
            info: defineAsyncComponent(() => import('./tabs/info.vue')),
            runs: defineAsyncComponent(() => import('./tabs/runs.vue')),
        },
        props: {
            workflow: {
                type: Object,
                default: () => {},
            },
            runs: {
                type: Array,
                default: () => [],
            },
        },
        emits: [],
        setup(props) {
            const { workflow } = toRefs(props)
            const workflowStore = useWorkflowStore()
            const activeKey = ref(0)

            const { name, icon, emoji, type } = usePackageInfo()
            const { displayName } = useWorkflowInfo()

            const pkg = computed(
                () =>
                    workflowStore.packageMeta?.[
                        workflow.value?.metadata?.annotations?.[
                            'package.argoproj.io/name'
                        ]
                    ] || {}
            )

            const dName = computed(() =>
                workflow.value?.metadata?.name
                    ? displayName(pkg.value, workflow.value?.metadata?.name)
                    : 'Workflow Name'
            )

            return {
                workflowPreviewTabs,
                activeKey,
                name,
                icon,
                emoji,
                type,
                dName,
            }
        },
    })
</script>

<style lang="less" module>
    .wfPreviewTabs {
        &:global(.ant-tabs-right) {
            :global(.ant-tabs-nav-container) {
                width: 48px !important;
                @apply ml-0 !important;
            }
            :global(.ant-tabs-tab) {
                padding: 3px 8px !important;
                margin: 16px 0px 0px !important;
                @apply justify-center;
            }

            :global(.ant-tabs-tab:first-child) {
                padding: 3px 8px !important;
                @apply mt-3 !important;

                @apply justify-center;
            }

            :global(.ant-tabs-content) {
                @apply px-0 h-full !important;

                :global(.ant-tabs-tab:first-child) {
                    @apply mt-0 !important;
                }
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
                @apply bg-white;
            }
        }
    }
</style>
