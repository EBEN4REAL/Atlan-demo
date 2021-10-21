<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center h-full text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting Runs</span>
    </div>
    <template v-else-if="runList?.length">
        <RunCard
            v-for="(r, x) in runList"
            :key="x"
            :r="r"
            :select-enabled="false"
        />
    </template>
    <EmptyView
        v-else
        :desc="
            !error
                ? 'There are no runs for this workflow. '
                : 'Sorry, we couldn’t find sthe workflow you were looking for.'
        "
        :EmptyScreen="EmptyScreen"
        descClass="text-center w-56"
        buttonIcon="ArrowRight"
        :buttonText="error ? '' : 'Run Workflow'"
    />
</template>

<script lang="ts">
    import { watch, computed, defineComponent, PropType, toRefs } from 'vue'

    import { useTimeAgo } from '@vueuse/core'
    import EmptyView from '@common/empty/index.vue'
    import EmptyScreen from '~/assets/images/workflows/empty_tab.png'

    import { assetInterface } from '~/types/assets/asset.interface'
    import { useArchivedRunList } from '~/composables/workflow/useWorkFlowList'
    import RunCard from '@/workflows/shared/runCard.vue'

    export default defineComponent({
        components: { RunCard, EmptyView },
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
        setup(props) {
            const { selectedWorkflow } = toRefs(props)

            const { runList, error, isLoading, reFetch } = useArchivedRunList(
                '',
                false
            )

            function timeAgo(time: number) {
                return useTimeAgo(time).value
            }

            watch(
                selectedWorkflow,
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
                runList,
                error,
                isLoading,
                EmptyScreen,
                timeAgo,
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
