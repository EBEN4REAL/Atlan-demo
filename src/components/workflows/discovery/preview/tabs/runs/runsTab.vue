<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center h-full text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting Runs</span>
    </div>
    <div v-else-if="list.length" v-auth="access.LIST_RUNS">
        <!-- <div class="flex px-4 mt-4 mb-4">
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
        </div> -->
        <RunCard
            v-for="(r, x) in searchText ? filterList(searchText) : list"
            :key="x"
            :r="r"
            :select-enabled="true"
            @click="handleClickRunCard(r)"
        />
    </div>
    <EmptyView
        v-else
        :desc="
            !error
                ? 'There are no runs for this workflow. '
                : 'Sorry, we couldn’t find the workflow you were looking for.'
        "
        empty-screen="WFEmptyTab"
        desc-class="w-56 text-center"
        button-icon="ArrowRight"
        :button-text="error ? '' : 'Open Profile'"
        @event="() => $router.push(`/workflows/${selectedWorkflow.name}/setup`)"
    />
</template>

<script lang="ts">
    // Vue
    import { watch, defineComponent, PropType, toRefs, ref } from 'vue'
    import { useRouter } from 'vue-router'

    // Components
    import EmptyView from '@common/empty/index.vue'
    import RunCard from '@/workflows/shared/runCard.vue'

    // Assets

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    // Composables
    import { getArchivedRunList } from '~/composables/workflow/useWorkflowList'
    import access from '~/constant/accessControl/map'

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
            const router = useRouter()
            const { selectedWorkflow: item } = toRefs(props)
            const searchText = ref('')
            const list = ref([])

            // getArchivedRunList
            const { archivedList, error, isLoading, filterList } =
                getArchivedRunList(item.value.name, true)

            // watcher
            watch(archivedList, (newVal) => {
                if (newVal) {
                    let archivedRunItems = []

                    if (newVal?.records?.length)
                        archivedRunItems = newVal.records

                    list.value = [...archivedRunItems]
                }
            })
            const handleClickRunCard = (prop) => {
              const {name} = item.value
              const id = prop.uid
              router.push(`/workflows/${name}/monitor?idmonitoring=${id}`)
            }

            return {
                access,
                searchText,
                list,
                filterList,
                archivedList,
                error,
                isLoading,
                emit,
                handleClickRunCard
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
