<template>
    <div
        class="w-full p-3 mb-3 text-sm border border-gray-300 rounded-lg hover:border-primary group"
        :class="selectedCardKey === item.metadata.uid ? 'selected-card' : ''"
        @click="() => onSelectCard(item.metadata.uid)"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center" style="flex: 1">
                <AtlanIcon
                    :icon="
                        getEntityStatusIcon(
                            savedQueryMetData?.attributes?.isVisualQuery
                                ? 'Vqb'
                                : 'Query',
                            certificateStatus(savedQueryMetData)
                        )
                    "
                    class="text-primary -mt-0.5 mr-1"
                />
                <p class="w-full text-gray-500">
                    <Tooltip
                        clampPercentage="99%"
                        :tooltip-text="title(savedQueryMetData)"
                        :rows="1"
                        classes="text-gray-500"
                    />
                </p>
            </div>
            <div class="" style="">
                <div class="items-center hidden h-5 group-hover:flex">
                    <!-- <a-tooltip color="#363636" placement="top">
                        style="min-width: 44px"
                        <template #title>Open preview sidebar</template>

                        <AtlanIcon
                            icon="SidebarSwitch"
                            class="w-4 h-4 my-auto mr-1 text-gray-500 outline-none"
                            style="min-width: 16px"
                        ></AtlanIcon>
                    </a-tooltip> -->
                    <!-- <AtlanIcon
                        icon="KebabMenuHorizontal"
                        class="w-4 h-4 pl-2 my-auto text-gray-500 outline-none"
                        style="min-width: 16px"
                    /> -->
                    <ThreeDotMenu :dropdownOptions="dropdownOptions" />
                </div>
                <AtlanIcon
                    icon="Mail"
                    class="visible text-gray-500 group-hover:hidden"
                />
            </div>
        </div>
        <div class="w-full pb-3 mt-1 mb-3 font-bold border-b border-gray-300">
            <Tooltip
                clampPercentage="99%"
                :tooltip-text="scheduleQueryName"
                :rows="2"
            />
        </div>
        <div class="flex items-center text-xs text-gray-500">
            <span class="capitalize">{{ frequency }}</span>
            <div class="w-1 h-1 bg-gray-300 mx-1.5 rounded-full"></div>
            <span
                >Next run at {{ _date?.format(format) }}
                {{ _date?.format('DD MMMM') }}
            </span>
            <div
                v-if="Object.keys(queryVariables).length"
                class="w-1 h-1 bg-gray-300 mx-1.5 rounded-full"
            ></div>
            <div v-if="Object.keys(queryVariables).length">
                <AtlanIcon icon="Flash" class="mr-1 -mt-0.5" />
                <span>{{ Object.keys(queryVariables).length }}</span>
            </div>
        </div>
        <div class="flex items-center mt-3">
            <!-- <div class="w-6 h-1 mr-1 rounded bg-success"></div>
            <div class="w-6 h-1 mr-1 rounded bg-success"></div>
            <div class="w-6 h-1 mr-1 rounded bg-success"></div> -->
            <div class="flex items-center w-full">
                <RunWidget
                    :item="runMap[item.metadata.name]"
                    :workflow="item.metadata.name"
                    :runs="runs(item.metadata.name)"
                    statusType="line"
                ></RunWidget>
            </div>
        </div>
    </div>
    <a-modal
        :visible="scheduleQueryModal"
        :footer="null"
        :closable="false"
        width="700px"
        :destroyOnClose="true"
    >
        <ScheduleQuery
            v-if="savedQueryMetData"
            :item="savedQueryMetData"
            v-model:scheduleQueryModal="scheduleQueryModal"
            style="min-height: 610px"
            class="rounded-lg"
            mode="update"
            :cronModel="cronModel"
            :workflowParameters="workflowParameters"
        />
    </a-modal>
</template>

<script lang="ts">
    import {
        watch,
        defineComponent,
        PropType,
        toRefs,
        computed,
        inject,
        Ref,
        ref,
    } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import parser from 'cron-parser'
    import dayjs from 'dayjs'
    import RunWidget from '~/workflows/components/workflows/preview/workflows/run.vue'
    import Ellipsis from '@/common/ellipsis/index.vue'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useVModels } from '@vueuse/core'
    import ThreeDotMenu from './threeDotMenu.vue'
    import ScheduleQuery from '~/components/insights/explorers/queries/schedule/index.vue'
    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'
    import { getCronFrequency } from '~/components/insights/explorers/queries/schedule/composables/useSchedule'

    export default defineComponent({
        components: {
            Tooltip,
            RunWidget,
            Ellipsis,
            ThreeDotMenu,
            ScheduleQuery,
        },
        props: {
            item: {
                required: true,
                type: Object as PropType<any>,
            },
            selectedCardKey: {
                required: true,
                type: String,
            },
        },
        emits: ['archive', 'update'],
        setup(props, { emit }) {
            const { item } = toRefs(props)
            const scheduleQueryModal = ref(false)
            const { title, certificateStatus } = useAssetInfo()
            const {
                name,
                creationTimestamp,
                creatorUsername,
                displayName,
                cronString,
                cron,

                cronObject,
            } = useWorkflowInfo()
            const { selectedCardKey } = useVModels(props)
            const format = 'hh:MM A,'
            const runMap = inject('runMap') as Ref<any>
            const savedQueryMetaMap = inject('savedQueryMetaMap') as Ref<
                Record<string, any>
            >

            const workflowParameters = computed(() => {
                if (
                    item.value.spec.templates.length &&
                    item.value.spec.templates[0].dag.tasks.length
                ) {
                    return item.value.spec.templates[0].dag.tasks[0].arguments
                        .parameters
                }
                return []
            })

            const scheduleQueryName = computed(() => {
                return (
                    workflowParameters.value.find(
                        (e) => e.name === 'report-name'
                    ).value ?? '-'
                )
            })
            const queryVariables = computed(() => {
                return (
                    JSON.parse(
                        workflowParameters.value.find(
                            (e) => e.name === 'query-variables'
                        ).value
                    ) ?? []
                )
            })

            const interval = parser.parseExpression(
                item.value.metadata.annotations[
                    'orchestration.atlan.com/schedule'
                ]
            )

            const _date = dayjs(interval.next().toString())

            const frequency = computed(() =>
                getCronFrequency(
                    item.value.metadata.annotations[
                        'orchestration.atlan.com/schedule'
                    ]
                )
            )
            const savedQueryMetData = computed(() => {
                const guid = workflowParameters.value.find(
                    (e) => e.name === 'saved-query-id'
                ).value
                const t = savedQueryMetaMap.value[guid]

                return t
            })

            const runs = (workflow) => runMap.value[workflow]

            const onSelectCard = (key: string) => {
                selectedCardKey.value = key
            }

            const dropdownOptions = [
                {
                    title: 'Delete',
                    icon: 'Trash',
                    class: 'text-red-700',
                    handleClick: () => {
                        emit(
                            'archive',
                            item.value?.metadata?.name,
                            scheduleQueryName.value
                        )
                    },
                },
                // {
                //     title: 'Edit',
                //     icon: 'Edit',
                //     class: 'text-gray-700',
                //     handleClick: () => {
                //         scheduleQueryModal.value = !scheduleQueryModal.value
                //     },
                // },
            ]

            const cronModel = ref(cronObject(item.value))

            return {
                title,
                certificateStatus,
                runMap,
                format,
                _date,
                item,
                scheduleQueryName,
                queryVariables,
                frequency,
                runs,
                getEntityStatusIcon,
                savedQueryMetData,
                onSelectCard,
                selectedCardKey,
                dropdownOptions,
                scheduleQueryModal,
                cronModel,
                workflowParameters,
            }
        },
    })
</script>
<style lang="less" scoped>
    .shadow-custom {
        box-shadow: 1px 2px 3px 3px #0000000d;
    }
    .selected-card {
        @apply border border-primary !important;
        background: #fbfbfe;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
