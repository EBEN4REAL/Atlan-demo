<template>
    <div class="w-full border rounded">
        <div
            class="
                flex
                justify-between
                w-full
                px-4
                py-3
                rounded-tl-md rounded-tr-md
            "
        >
            <div class="flex space-x-3">
                <WorkflowTypeSelector
                    style="min-width: 150px"
                ></WorkflowTypeSelector>
                <ConnectionSelector
                    v-model:value="connectionQf"
                    style="min-width: 150px"
                    :show-all="true"
                    @change="handleConnectionChange"
                ></ConnectionSelector>
            </div>
            <a-button @click="handleRefresh"
                ><fa icon="fal sync"></fa
            ></a-button>
        </div>
        <div class="w-full overflow-auto min-h-10">
            <div
                v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
                class="flex items-center h-full align-middle bg-white"
                style="min-height: 200px"
            >
                <ErrorView></ErrorView>
            </div>
            <div
                v-else-if="isLoading"
                class="flex items-center h-full align-middle bg-white"
                style="min-height: 200px"
            >
                <LoadingView></LoadingView>
            </div>
            <div
                v-else-if="!data.items"
                class="flex items-center h-full align-middle bg-white"
                style="min-height: 200px"
            >
                <EmptyView empty="No running jobs"></EmptyView>
            </div>

            <table
                v-else
                class="table w-full mx-auto overflow-x-hidden table-report"
            >
                <tbody class="rounded-md">
                    <template
                        v-for="item in data.items"
                        :key="item.workflowtemplate.metadata.uid"
                    >
                        <ItemView :item="item"></ItemView>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'

    import LoadingView from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import EmptyView from '@common/empty/index.vue'

    import WorkflowTypeSelector from '@common/selector/workflowtype/index.vue'
    import ConnectionSelector from '@common/selector/connections/index.vue'
    import useWorkflowList from '~/composables/bots/useWorkflowList'
    import ItemView from './item.vue'
    import Runstatus from '../../selector/runstatus/index.vue'

    export default defineComponent({
        components: {
            ItemView,
            ErrorView,
            EmptyView,
            LoadingView,
            WorkflowTypeSelector,
            ConnectionSelector,
            Runstatus,
        },
        props: {
            isArchived: {
                type: Boolean,
            },
        },
        setup(props) {
            const now = ref(true)
            const params = ref({}) as { [key: string]: any }

            const connectionQf = ref()
            const botTemplateName = ref()
            const phase = ref()

            const projection =
                'metadata,items.metadata.uid,items.metadata.name,items.metadata.namespace,items.metadata.creationTimestamp,items.metadata.labels,items.status.phase,items.status.message,items.status.finishedAt,items.status.startedAt,items.status.estimatedDuration,items.status.progress,items.spec.suspend'

            params.value = {
                'listOptions.limit': 50,
                'listOptions.labelSelector':
                    'workflows.argoproj.io/phase=Running',
                fields: projection,
            }

            const { data, refresh, state, STATES, isLoading, isValidating } =
                useWorkflowList(now, params, 'archived_list')

            const updateLabel = () => {
                const labels = []
                labels.push(`workflows.argoproj.io/phase=Running`)

                if (connectionQf.value) {
                    labels.push(
                        `connection-qualified-name=${connectionQf?.value.replaceAll(
                            '/',
                            '..'
                        )}`
                    )
                }
                if (botTemplateName.value) {
                    labels.push(`category=${botTemplateName.value}`)
                }
                params.value['listOptions.labelSelector'] = labels.join(',')
            }

            const handlePhaseChange = () => {
                updateLabel()
                refresh()
            }
            const handleConnectionChange = () => {
                updateLabel()
                refresh()
            }
            const handleRefresh = () => {
                refresh()
            }

            return {
                data,
                state,
                STATES,
                isLoading,
                isValidating,
                phase,
                handleRefresh,
                handlePhaseChange,
                connectionQf,
                handleConnectionChange,
            }
        },
        data() {
            return {
                list: [],
                msgServer: null,
            }
        },
        mounted() {},
    })
</script>

<style lang="less" scoped>
    .table-report {
        border-spacing: 0 2px;
    }
</style>
