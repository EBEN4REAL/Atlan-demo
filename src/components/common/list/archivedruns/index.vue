<template>
    <div class="w-full border rounded">
        <div
            class="flex justify-between w-full px-4 py-3  rounded-tl-md rounded-tr-md"
        >
            <div class="flex space-x-3">
                <Runstatus
                    v-model="phase"
                    style="min-width: 100px"
                    @change="handlePhaseChange"
                ></Runstatus>
                <!-- <WorkflowTypeSelector style="min-width: 150px"></WorkflowTypeSelector> -->
                <ConnectionSelector
                    v-model="connectionQf"
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
                v-else-if="
                    [STATES.PENDING].includes(state) ||
                    [STATES.VALIDATING].includes(state)
                "
                class="flex items-center h-full align-middle bg-white"
                style="min-height: 200px"
            >
                <LoadingView></LoadingView>
            </div>

            <table
                v-else
                class="table w-full mx-auto overflow-x-hidden table-report"
            >
                <tbody class="rounded-md">
                    <template v-for="item in data.records" :key="item.uid">
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

    import WorkflowTypeSelector from '@common/selector/workflowtype/index.vue'
    import ConnectionSelector from '@common/selector/connections/index.vue'
    import useRunList from '~/composables/bots/useRunList'
    import ItemView from './item.vue'
    import Runstatus from '../../selector/runstatus/index.vue'

    export default defineComponent({
        components: {
            ItemView,
            ErrorView,
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
            const params = ref({})

            const connectionQf = ref()
            const phase = ref()

            const initUrlParam = () => {
                const urlparam = new URLSearchParams()
                urlparam.append('limit', '10')
                urlparam.append('sort', '-finished_at')
                return urlparam
            }

            params.value = initUrlParam()

            const { data, refresh, state, STATES } = useRunList(
                now,
                params,
                'archived_list'
            )

            const updateLabel = () => {
                const urlparam = initUrlParam()

                // let labels = [];
                if (phase.value) {
                    urlparam.append(
                        'labels',
                        `workflows.argoproj.io/phase=${phase.value}`
                    )
                }
                if (connectionQf.value) {
                    urlparam.append(
                        'labels',
                        `connection-qualified-name=${connectionQf?.value.replaceAll(
                            '/',
                            '..'
                        )}`
                    )
                }
                params.value = urlparam
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
