<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting Runs</span>
    </div>
    <template v-else-if="runList?.length">
        <div v-for="(r, x) in runList" :key="x" class="mx-4 mt-3">
            <div
                class="
                    text-base
                    truncate
                    cursor-pointer
                    text-primary
                    hover:underline
                    overflow-ellipsis
                    whitespace-nowrap
                "
                :class="{ 'font-bold underline': currRunId === r.uid }"
                @click="loadRunGraph(r.uid)"
            >
                <span>
                    {{ r.name }}
                </span>
                <a-spin v-if="isLoadingRunGraph && currRunId === r.uid" />
            </div>
            <div>
                <p class="mb-1 text-sm tracking-wide text-gray-500">
                    Status:
                    <span class="text-gray-700">
                        {{ r.phase }}
                    </span>
                </p>
                <p>
                    <span class="mb-1 text-sm tracking-wide text-gray-500"
                        >Started:</span
                    >
                    <span class="text-gray-700"
                        >{{ timeAgo(r.started_at) }},
                    </span>
                    <span class="mb-1 text-sm tracking-wide text-gray-500"
                        >finished:</span
                    >
                    <span class="text-gray-700">{{
                        timeAgo(r.finished_at)
                    }}</span>
                </p>
            </div>
        </div>
    </template>
    <div v-else class="flex flex-col items-center">
        <img :src="emptyScreen" alt="No Runs" class="w-2/5 m-auto mb-4" />
        <span class="text-gray-500">No runs found</span>
    </div>
</template>

<script lang="ts">
    import {
        watch,
        computed,
        defineComponent,
        PropType,
        toRefs,
        ref,
    } from 'vue'

    import { useTimeAgo } from '@vueuse/core'
    import emptyScreen from '~/assets/images/empty_search.png'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useArchivedRunList } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        components: {},
        props: {
            selectedWorkflow: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isLoaded: {
                type: Boolean,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { selectedWorkflow: item } = toRefs(props)

            const { runList, error, isLoading, reFetch } = useArchivedRunList(
                '',
                false
            )

            function timeAgo(time: number) {
                return useTimeAgo(time).value
            }

            const isLoadingRunGraph = ref(false)
            const currRunId = ref('')

            const loadRunGraph = (id) => {
                if (currRunId.value === id) return
                currRunId.value = id
                isLoadingRunGraph.value = true
                emit('change', id)
                setTimeout(() => {
                    isLoadingRunGraph.value = false
                }, 2500)
            }

            watch(runList, (newVal) => {
                if (newVal) currRunId.value = newVal[0].uid
            })

            watch(
                item,
                (n, o) => {
                    console.log(n, o)
                    if (!o) reFetch(n.name)
                    else if (n.name !== o.name) reFetch(n.name)
                },
                {
                    immediate: true,
                    deep: true,
                }
            )

            return {
                item,
                runList,
                error,
                isLoading,
                timeAgo,
                emptyScreen,
                emit,
                loadRunGraph,
                isLoadingRunGraph,
                currRunId,
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
