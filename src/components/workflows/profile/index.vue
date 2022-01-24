<template>
    <div class="flex flex-col w-full h-full">
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
            >
                <component
                    :is="tab.component"
                    :key="`${tab.id}_${runName}`"
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

            // const { getProfileTabs, isScrubbed } = useWorkflowInfo()

            const activeKey = ref()
            const route = useRoute()

            const router = useRouter()
            const handleChangeTab = (key) => {
                router.replace(`/workflow/${route.params.id}/${key}`)
            }

            onMounted(() => {
                activeKey.value = route?.params?.tab
            })

            const runName = ref('')

            const handleNewRun = (run) => {
                runName.value = run
            }

            return {
                activeKey,
                handleChangeTab,
                workflowObject,
                packageObject,
                workflowTabs,
                handleNewRun,
                runName,
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
            @apply bg-primary-light overflow-y-auto !important;
        }
        :global(.ant-tabs-content) {
            @apply min-h-full !important;
        }
    }
</style>
