<template>
    <div class="w-full my-4 bg-gray-100 rounded-lg">
        <div class="flex p-4 items-center w-full">
            <atlan-icon :icon="WFIcon" class="h-5 mr-2" />
            <div class="w-full">
                <div class="flex justify-between items-center w-full">
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-gray-500 font-base">{{
                            name(run)
                        }}</span>
                        <span
                            class="status-badge text-xs"
                            style="padding: 7px 12px 5px"
                            :class="[
                                getRunTextClass(run),
                                getRunClassBgLight(run),
                            ]"
                        >
                            <div class="dot" :class="getRunClassBg(run)" />
                            {{
                                runStatusMap[run.status.phase]?.label ||
                                run?.status?.phase
                            }}
                        </span>
                    </div>
                    <div
                        v-if="phase(run)==='Succeeded'"
                        class="items-center justify-end"
                    >
                        <div
                            class="border w-40 border-gray-200 bg-white cursor-pointer rounded-lg px-2 py-1"
                            @click="handleDownloadArtifacts"
                        >
                            <atlan-icon icon="Download" class="mx-1" />
                            Download CSV
                        </div>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <span class="flex items-center text-gray-500"
                        ><atlan-icon icon="User" class="h-4 mr-1 mb-0.5" />
                        Initiated by
                        <Avatar
                            :image-url="creatorUsername(run)"
                            :avatar-name="creatorUsername(run)"
                            :avatar-size="16"
                            avatar-shape="circle"
                            class="mx-1"
                        />

                        {{ creatorUsername(run) }}
                    </span>
                    <span class="text-gray-500 text-xs">{{
                        startedAt(run, true)
                    }}</span>
                </div>
            </div>
        </div>
        <div
            v-if="
                finalStatus?.terms?.total_count ||
                finalStatus?.categories?.total_count
            "
            class="bg-white p-4 rounded-b-lg border-t"
        >
            <div
                v-if="finalStatus?.terms?.total_count"
                class="flex items-center space-x-1"
            >
                <atlan-icon icon="Term" class="mb-0.5" />
                <span class="text-gray-500 text-xs"
                    >{{ finalStatus?.terms?.total_count }} terms uploaded</span
                >
                <span
                    v-if="finalStatus?.terms?.updated_count"
                    class="text-gray-500 text-xs"
                    >-</span
                >
                <span
                    v-if="finalStatus?.terms?.updated_count"
                    class="text-gray-500 text-xs"
                    >{{ finalStatus?.terms?.updated_count }} updated</span
                >
                <span
                    v-if="finalStatus?.terms?.created_count"
                    class="text-gray-500 text-xs"
                    >-</span
                >
                <span
                    v-if="finalStatus?.terms?.created_count"
                    class="text-gray-500 text-xs"
                    >{{ finalStatus?.terms?.created_count }} created</span
                >
                <span
                    v-if="finalStatus?.terms?.error_count"
                    class="text-gray-500 text-xs"
                    >-</span
                >
                <span
                    v-if="finalStatus?.terms?.error_count"
                    class="text-error text-xs"
                    >{{ finalStatus?.terms?.error_count }} failed</span
                >
            </div>
            <div
                v-if="finalStatus?.categories?.total_count"
                class="flex items-center space-x-1 mt-1"
            >
                <atlan-icon icon="Category" class="mb-0.5" />
                <span class="text-gray-500 text-xs"
                    >{{ finalStatus?.categories?.total_count }} new categories
                    detected</span
                >
                <span
                    v-if="finalStatus?.categories?.created_count"
                    class="text-gray-500 text-xs"
                    >-</span
                >
                <span
                    v-if="finalStatus?.categories?.created_count"
                    class="text-gray-500 text-xs"
                    >{{ finalStatus?.categories?.created_count }} created</span
                >
                <span
                    v-if="finalStatus?.categories?.error_count"
                    class="text-gray-500 text-xs"
                    >-</span
                >
                <span
                    v-if="finalStatus?.categories?.error_count"
                    class="text-error text-xs"
                    >{{ finalStatus?.categories?.error_count }} failed</span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        watch,
        defineComponent,
        ref,
        PropType,
        computed,
        toRefs,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import { runStatusMap } from '~/workflowsv2/constants/maps'
    // composables
    import { useArtifacts } from '@/glossary/modal/useBulkUpload'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import useRunItem from '~/workflows/composables/package/useRunItem'
    import { downloadFile } from '~/utils/library/download'
    // components
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'UploadHistoryItem',
        components: { Avatar },
        props: {
            run: {
                type: Object as PropType<LiveRun>,
                required: true,
            },
        },
        setup(props) {
            const finalStatus = ref({})
            const {
                displayName,
                getRunTextClass,
                getRunClassBgLight,
                getRunClassBg,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                workflowTemplateName,
                packageName,
                name,
                phase,
            } = useWorkflowInfo()
            const path = computed(() => ({
                name: name(props?.run),
            }))
            const WFIcon = computed(() => {
                if (
                    phase(props.run) === 'Succeeded' &&
                    !(
                        finalStatus.value?.categories?.error_count ||
                        finalStatus.value?.terms?.error_count
                    )
                )
                    return 'RunSuccess'
                if (phase(props.run) === 'Failed') return 'IssuesAnnouncement'
                if (phase(props.run) === 'Running') return 'RunProgress'
                return 'WarningAnnouncement'
            })

            const {
                data: selectedRun,
                mutate,
                isLoading,
                error,
            } = useRunItem(path, true)

            // returns filter nodes containing results
            const getFilteredNodes = (nodes) => {
                // these two nodes contain data about finally created terms and categories
                const nodesContainingResults = [
                    'create-final-csv',
                    'extract-category-status',
                ]
                // convert nodes object to array of objects
                const nodesArray = Object.keys(nodes)?.map((i) => nodes[i])
                const filteredNodes = nodesArray?.filter((el) =>
                    nodesContainingResults?.includes(el?.displayName)
                )
                return filteredNodes
            }

            const getResults = (nodes) => {
                const filteredNodes = getFilteredNodes(nodes)
                filteredNodes?.forEach((el) => {
                    const status = el.outputs?.parameters.find(
                        (i) => (i.name = 'status')
                    )
                    if (el?.displayName === 'create-final-csv') {
                        finalStatus.value.terms = JSON.parse(status?.value)
                    } else if (el?.displayName === 'extract-category-status') {
                        finalStatus.value.categories = JSON.parse(status?.value)
                    }
                })
                console.log(finalStatus.value)
            }

            const getArtifacts = (
                WFRunName: String,
                nodeName: String,
                outputName: String
            ) => {
                const { data, error, isLoading, mutate } = useArtifacts({
                    WFRunName,
                    nodeName,
                    outputName,
                })
                watch(data, () => {
                    if (data.value && !error.value) {
                        const fileName = 'Results CSV'
                        downloadFile(data.value, fileName)
                    } else {
                        message.error(`Could not get file!`, 5)
                    }
                })
            }
            const handleDownloadArtifacts = () => {
                const filteredNodes = getFilteredNodes(
                    selectedRun.value?.status?.nodes
                )
                const nodeName = filteredNodes?.find(
                    (i) => i?.displayName === 'create-final-csv'
                )?.name

                getArtifacts(name(props.run), nodeName, 'results')
            }

            watch(selectedRun, () => {
                if (!['Running', 'Pending'].includes(phase(props.run)))
                    getResults(selectedRun.value?.status?.nodes)
            })

            return {
                getRunClassBg,
                getRunClassBgLight,
                getRunTextClass,
                runStatusMap,
                startedAt,
                name,
                displayName,
                creatorUsername,
                finalStatus,
                phase,
                handleDownloadArtifacts,
                WFIcon,
            }
        },
    })
</script>

<style lang="less" scoped>
    .status-badge {
        @apply flex items-center;
        @apply text-xs font-bold tracking-wider uppercase;
        @apply rounded-full;
    }
    .dot {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        margin-bottom: 2px;
        margin-right: 6px;
    }
</style>
