<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center h-full text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting Runs</span>
    </div>
    <template v-else-if="runList.records.length">
        <div class="flex px-4 mt-4 mb-4">
            <a-input-search
                v-model:value="searchText"
                placeholder="Search Members"
                class="mr-1"
                size="default"
                :allow-clear="true"
            ></a-input-search>
            <a-button class="p-2 ml-2 rounded">
                <AtlanIcon icon="FilterDot" class="h-4" />
            </a-button>
        </div>
        <RunCard
            v-for="(r, x) in searchText
                ? filterList(searchText)
                : runList.records"
            :key="x"
            :r="r"
            :curr-run-name="currRunName"
            :is-loading="isLoadingRunGraph"
            :select-enabled="true"
            @select="loadRunGraph"
        />
    </template>
    <EmptyView v-else empty="No Runs Available" />
</template>

<script lang="ts">
    import {
        watch,
        defineComponent,
        PropType,
        toRefs,
        ref,
        computed,
    } from 'vue'
    import { useRoute } from 'vue-router'

    import EmptyView from '@common/empty/index.vue'

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
        setup(props, { emit }) {
            const route = useRoute()
            const { selectedWorkflow: item } = toRefs(props)

            const searchText = ref('')
            const id = computed(() => route?.params?.id || '')
            const filter = {
                labels: {
                    $elemMatch: {
                        'workflows.argoproj.io/workflow-template': `${id.value}`,
                    },
                },
            }
            const { runList, error, isLoading, reFetch, filterList } =
                useArchivedRunList(JSON.stringify(filter), true)

            const isLoadingRunGraph = ref(false)
            const currRunName = ref('')

            const loadRunGraph = (id) => {
                if (currRunName.value === id) return
                currRunName.value = id
                isLoadingRunGraph.value = true
                emit('change', id)
                setTimeout(() => {
                    isLoadingRunGraph.value = false
                }, 2500)
            }

            watch(runList, (newVal) => {
                if (newVal) currRunName.value = newVal.records[0].name
            })

            // watch(
            //     item,
            //     (n, o) => {
            //         console.log(n, o)
            //         if (!o) reFetch(n.name)
            //         else if (n.name !== o.name) reFetch(n.name)
            //     },
            //     {
            //         immediate: true,
            //         deep: true,
            //     }
            // )

            return {
                filterList,
                item,
                searchText,
                runList,
                error,
                isLoading,
                emit,
                loadRunGraph,
                isLoadingRunGraph,
                currRunName,
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
