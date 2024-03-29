<template>
    <div class="w-full my-4 bg-gray-100 rounded-lg shadow-md">
        <div class="flex items-center w-full p-4">
            <div
                class="flex items-center justify-center p-2 m-1 mr-2 bg-white rounded-lg"
            >
                <atlan-icon :icon="WFIcon" class="h-5" />
            </div>
            <div class="w-full">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-gray-500 font-base">{{
                            runName
                        }}</span>
                        <span
                            class="mb-1 text-xs status-badge"
                            style="padding: 7px 12px 5px"
                            :class="[getCustomClassesByPhase(run)]"
                        >
                            <div
                                class="dot"
                                :class="
                                    getRunStatus(
                                        runStatusMap[run.status.phase]?.label
                                    )?.toLowerCase() === 'needs attention'
                                        ? 'bg-yellow-300'
                                        : getRunClassBg(run)
                                "
                            />
                            <span>
                                {{
                                    getRunStatus(
                                        runStatusMap[run.status.phase]?.label
                                    ) ||
                                    runStatusMap[run.status.phase]?.label ||
                                    run?.status?.phase
                                }}
                            </span>
                        </span>
                    </div>
                    <div
                        v-if="phase(run) === 'Succeeded'"
                        class="items-center justify-end"
                    >
                        <div
                            class="px-2 py-1 bg-white border border-gray-200 rounded-lg cursor-pointer"
                            @click="handleDownloadArtifacts"
                        >
                            <atlan-icon icon="Download" class="mx-1" />
                            Results CSV
                        </div>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <span class="flex items-center text-gray-500">
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
                    <span class="text-xs text-gray-500">{{
                        startedAt(run, true)
                    }}</span>
                    <span
                        v-if="!['Running', 'Pending'].includes(phase(run))"
                        class="mx-2 text-xs text-gray-500"
                        >|</span
                    >
                    <span
                        v-if="!['Running', 'Pending'].includes(phase(run))"
                        class="text-xs text-gray-500"
                        >Completed in {{ duration(run) }}</span
                    >
                </div>
            </div>
            <!-- hidden for v1 -->
            <!-- <a-tooltip> -->
            <!--     <template #title>Retry Run</template> -->
            <!--     <div -->
            <!--         v-if="['Failed'].includes(phase(run))" -->
            <!--         class="p-1 px-2 mr-2 bg-white border rounded-lg cursor-pointer" -->
            <!--         @click="handleRetry" -->
            <!--     > -->
            <!--         <atlan-icon icon="Retry" class="h-4" /> -->
            <!--     </div> -->
            <!-- </a-tooltip> -->
        </div>
        <div
            v-if="
                finalStatus?.terms?.total_count ||
                finalStatus?.categories?.total_count
            "
            class="p-4 px-0 bg-white border-t rounded-b-lg"
        >
            <div
                v-if="finalStatus?.terms?.total_count"
                class="flex items-center px-4 space-x-2"
            >
                <atlan-icon icon="Term" class="mb-0.5" />
                <span
                    v-if="finalStatus?.terms?.updated_count"
                    class="text-sm text-gray-500"
                    >{{ finalStatus?.terms?.updated_count }} updated</span
                >
                <div
                    v-if="
                        finalStatus?.terms?.created_count &&
                        finalStatus?.terms?.updated_count
                    "
                    class="w-1 h-1 bg-gray-400 rounded-full"
                ></div>
                <span
                    v-if="finalStatus?.terms?.created_count"
                    class="text-sm text-gray-500"
                    >{{ finalStatus?.terms?.created_count }} created</span
                >
                <div
                    v-if="
                        finalStatus?.terms?.error_count &&
                        (finalStatus?.terms?.created_count ||
                            finalStatus?.terms?.updated_count)
                    "
                    class="w-1 h-1 bg-gray-400 rounded-full"
                ></div>
                <span
                    v-if="finalStatus?.terms?.error_count"
                    class="text-sm text-error"
                    >{{ finalStatus?.terms?.error_count }} failed</span
                >
            </div>
            <div
                v-if="finalStatus?.categories?.total_count"
                class="flex items-center px-4 mt-2 space-x-2"
            >
                <atlan-icon icon="Category" class="mb-0.5" />
                <span
                    v-if="finalStatus?.categories?.created_count"
                    class="text-sm text-gray-500"
                    >{{ finalStatus?.categories?.created_count }} created</span
                >
                <div
                    v-if="
                        finalStatus?.categories?.error_count &&
                        finalStatus?.categories?.created_count
                    "
                    class="w-1 h-1 bg-gray-400 rounded-full"
                ></div>
                <span
                    v-if="finalStatus?.categories?.error_count"
                    class="text-sm text-error"
                    >{{ finalStatus?.categories?.error_count }} failed</span
                >
            </div>
            <div
                v-if="
                    getRunStatus(
                        runStatusMap[run.status.phase]?.label
                    )?.toLowerCase() === 'needs attention'
                "
                class="pt-2 mt-2 text-gray-500 border-t"
            >
                <atlan-icon icon="Info" class="h-4 ml-4 mr-1" />
                Re-upload the updated file to successfully resolve the errors.
            </div>
        </div>
        <div
            v-if="['Running', 'Failed', 'Pending'].includes(phase(run))"
            class="flex flex-col py-2 bg-white rounded-b-lg"
        >
            <span
                v-if="phase(run) === 'Running'"
                class="px-4 pt-1 pb-2 text-gray-500 border-b"
                >This upload will take some time, please check back later.</span
            >
            <span
                v-if="phase(run) === 'Failed'"
                class="px-4 pt-1 pb-2 text-gray-500 border-b"
                >Sorry, we've encountered an error while processing your
                file.</span
            >
            <span
                class="flex items-center px-4 pt-2 space-x-1 cursor-pointer text-primary parent"
                @click="handleRedirectToWF"
            >
                View upload details here
                <atlan-icon
                    icon="ArrowRight"
                    class="h-4 mb-0.5 ml-1 text-primary child"
                />
            </span>
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
    import { useRoute, useRouter } from 'vue-router'
    import { message } from 'ant-design-vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import { runStatusMap } from '~/workflowsv2/constants/maps'
    // composables
    import { useArtifacts } from '@/glossary/modal/useBulkUpload'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { retryRunByName } from '~/workflowsv2/composables/useWorkflowList'
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
            runName: {
                type: String,
                required: true,
            },
            glossaryName: {
                type: String,
                required: true,
            },
        },
        emits: ['refetch'],
        setup(props, { emit }) {
            const finalStatus = ref({})
            const {
                displayName,
                getRunTextClass,
                getRunTextClassByPhase,
                getRunClassByPhase,
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
                finishedAt,
            } = useWorkflowInfo()
            const router = useRouter()
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
                if (phase(props.run) === 'Pending') return 'Upload'
                if (phase(props.run) === 'Stopped') return 'Stopped'
                return 'WarningAnnouncement'
            })

            const {
                data: selectedRun,
                mutate,
                isLoading,
                error,
            } = useRunItem(path, true)

            const handleRetry = () => {
                const {
                    data: retriedRun,
                    error,
                    isLoading,
                } = retryRunByName(name(props.run))
                watch(retriedRun, () => {
                    console.log(retriedRun)
                })
                emit('refetch')
            }

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
                    if (
                        el?.displayName === 'create-final-csv' &&
                        status?.value
                    ) {
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
                        const fileName = `${props.glossaryName} - Atlan Bulk Terms Results`
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

            const getRunStatus = (value: String): String => {
                if (
                    value?.toLowerCase() === 'success' &&
                    (finalStatus.value?.terms?.error_count ||
                        finalStatus.value?.categories?.error_count)
                )
                    return 'Needs attention'
                if (value?.toLowerCase() === 'running') return 'In progress'
                return value
            }

            const handleRedirectToWF = () => {
                const url = `/workflows/profile/${workflowTemplateName(
                    props.run
                )}/runs?name=${name(props.run)}`

                router.push(url)
            }

            const getCustomClassesByPhase = (run) => {
                if (
                    getRunStatus(
                        runStatusMap[run.status.phase]?.label
                    )?.toLowerCase() === 'needs attention'
                )
                    return 'text-new-yellow-600 bg-new-yellow-100'
                return `${getRunTextClass(run)} ${getRunClassBgLight(run)}`
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
                getRunStatus,
                handleRedirectToWF,
                handleRetry,
                getRunTextClassByPhase,
                getRunClassByPhase,
                getCustomClassesByPhase,
                finishedAt,
                duration,
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
    .parent:hover > .child {
        animation: move-right 1s cubic-bezier(0, 0, 0.2, 1) infinite;

        @keyframes move-right {
            from {
                transform: translate(0px);
                translate: scaleX(1);
            }
            to {
                transform: translate(6px);
                translate: scaleX(1.5);
                height: 30px;
            }
        }
    }
</style>
