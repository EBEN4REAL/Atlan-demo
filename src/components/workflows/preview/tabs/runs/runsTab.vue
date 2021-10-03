<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting Runs</span>
    </div>
    <template v-else-if="workflowList?.length">
        <div v-for="(r, x) in workflowList" :key="x" class="mx-4 mt-3">
            <div
                class="text-base font-bold truncate cursor-pointer text-primary hover:underline overflow-ellipsis whitespace-nowrap"
            >
                {{ r.metadata.name }}
            </div>
            <div>
                <p class="mb-1 text-sm tracking-wide text-gray-500">
                    Status:
                    <span class="text-gray-700">
                        {{ r.status.phase }}
                    </span>
                </p>
                <p>
                    <span class="mb-1 text-sm tracking-wide text-gray-500"
                        >Started:</span
                    >
                    <span class="text-gray-700"
                        >{{ timeAgo(r.status.startedAt) }},
                    </span>
                    <span class="mb-1 text-sm tracking-wide text-gray-500"
                        >finished:</span
                    >
                    <span class="text-gray-700">{{
                        timeAgo(r.status.finishedAt)
                    }}</span>
                </p>
            </div>
        </div>
    </template>
    <div v-else class="flex flex-col items-center">
        <img :src="emptyScreen" alt="No logs" class="w-2/5 m-auto mb-4" />
        <span class="text-gray-500">No runs found</span>
    </div>
</template>

<script lang="ts">
    import {
        watch,
        reactive,
        computed,
        defineComponent,
        PropType,
        toRefs,
        ref,
    } from 'vue'

    import { useTimeAgo } from '@vueuse/core'
    import emptyScreen from '~/assets/images/empty_search.png'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useArchivedWorkflowList } from '~/components/workflows/useWorkFlowList'

    export default defineComponent({
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },

        setup(props) {
            const { selectedAsset: item } = toRefs(props)

            const labelSelector = ref(
                `workflows.argoproj.io/workflow-template=${item.value.metadata.name}`
            )
            const { workflowList, error, isLoading, filterList, mutate, reFetch } =
                useArchivedWorkflowList(labelSelector.value)

            function timeAgo(time: number) {
                return useTimeAgo(time).value
            }

            watch(
                () => item,
                (newValue) => {
                    // fetchMoreAuditParams.startKey = ''
                    // fetchAudits(params, newValue)
                    console.log('asset cahnges')
                    reFetch(`workflows.argoproj.io/workflow-template=${item.value.metadata.name}`)
                },
                {
                    immediate: true,
                    deep: true,
                }
            )

            return {
                item,
                workflowList,
                error,
                isLoading,
                timeAgo,
                emptyScreen,
            }
        },
    })
</script>

<style lang="less" scoped>
    .ant-timeline-item {
        margin-bottom: 0 !important;
        padding-bottom: 40px !important;
    }
    .ant-timeline-item-dot {
        width: 13px;
        height: 13px;
        border-radius: 50%;
    }

    .name-time-separator {
        height: 5px;
        width: 5px;
        background-color: #c4c4c4;
        border-radius: 50%;
    }

    :global(.ant-timeline-item-content) {
        margin-left: 22px;
    }
    :global(.ant-timeline-item-head-custom) {
        padding: 0 !important;
    }
</style>
