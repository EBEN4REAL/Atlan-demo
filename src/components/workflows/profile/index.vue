<template>
    <div class="flex flex-col w-full h-full bg-white">
        <WorkflowHeader
            :packageObject="packageObject"
            :workflow-object="workflowObject"
            @newrun="handleNewRun"
        />

        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.profiletab"
            class="flex-1"
            :destroy-inactive-tab-pane="true"
            @change="handleChangeTab"
        >
            <a-tab-pane
                v-for="tab in workflowTabs"
                :key="tab.id"
                :tab="tab.label"
                class="h-auto"
            >
                <component
                    :is="tab.component"
                    :key="`${tab.id}_${searchDirtyTimestamp}`"
                    :workflowObject="workflowObject"
                    :runId="runId"
                    :packageObject="packageObject"
                    :workflowName="workflowObject?.metadata?.name"
                ></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        defineAsyncComponent,
        onMounted,
        PropType,
        watch,
        toRefs,
        provide,
        computed,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import WorkflowHeader from './header/index.vue'
    import { workflowTabs } from '~/constant/workflowTabs'

    export default defineComponent({
        name: 'WorkflowProfile',
        components: {
            WorkflowHeader,

            Runs: defineAsyncComponent(() => import('./tabs/runs/index.vue')),
            Config: defineAsyncComponent(
                () => import('./tabs/config/index.vue')
            ),
        },
        props: {
            workflowObject: {
                type: Object,
                required: false,
                default: () => {},
            },
            packageObject: {
                type: Object,
                required: false,
                default: () => {},
            },
        },
        setup(props) {
            const { workflowObject, packageObject } = toRefs(props)

            const route = useRoute()

            const activeKey = ref()

            const runId = computed(() => route?.query?.name)

            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            const router = useRouter()
            const handleChangeTab = (key) => {
                router.replace(`/workflows/${route.params.id}/${key}`)
            }

            watch(
                () => route?.params?.tab,
                () => {
                    activeKey.value = route?.params?.tab
                },
                { immediate: true }
            )

            const runName = ref('')

            const handleNewRun = (run) => {
                searchDirtyTimestamp.value = `dirty_${Date.now().toString()}`
                // runName.value = run
                router.push({
                    params: { tab: 'runs' },
                    query: {
                        name: run,
                    },
                })
            }
            provide('newrun', handleNewRun)

            return {
                activeKey,
                handleChangeTab,
                workflowTabs,
                handleNewRun,
                runName,
                route,
                searchDirtyTimestamp,
                runId,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>

<style lang="less" module>
    .profiletab {
        :global(.ant-tabs-tab:first-child) {
            @apply ml-6;
        }

        :global(.ant-tabs-tab-active) {
            -webkit-text-stroke: 0.65px !important;
            -moz-text-stroke: 0.65px !important;
        }

        :global(.ant-tabs-nav) {
            @apply mb-0 !important;
        }

        :global(.ant-tabs-content-holder) {
            @apply bg-primary-light h-full overflow-y-hidden  !important;
        }
        :global(.ant-tabs-content) {
            @apply h-full overflow-y-hidden  !important;
        }
    }
</style>
