<template>
    <tr class="bg-white border-b border-gray-200">
        <td class="w-3 pr-0">
            <div class="flex items-center align-middle">
                <a-tooltip :title="phase" placement="left">
                    <fa
                        icon="fas check-circle"
                        class="text-xl text-green-500"
                        v-if="phase == 'Succeeded'"
                    ></fa>
                    <fa
                        icon="fas exclamation-triangle"
                        class="text-xl text-red-500"
                        v-else-if="phase == 'Failed' || phase === 'Error'"
                    ></fa>
                    <a-spin v-else-if="phase == 'Running'"></a-spin>

                    <fa
                        icon="fas exclamation-circle"
                        class="text-xl text-yellow-500"
                        v-else
                    ></fa>
                </a-tooltip>
            </div>
        </td>
        <td class="">
            <div class="flex flex-col align-middle">
                <p class="mb-1 tracking-wide text-gray-700">
                    {{ category }}
                </p>

                <div class="flex">
                    <img :src="connectionImage" class="w-4 h-auto mr-1" />
                    <p class="mb-0 text-sm leading-none text-gray-700">
                        {{ connectionDisplayName }}
                    </p>

                    <!-- <p class="mb-0 text-gray-400" >{{ item.name }}</p> -->
                </div>
            </div>
        </td>
        <td class="text-gray-500" style="min-width: 50px">
            <a-tooltip title="Scheduled" placement="left">
                <fa icon="fal calendar-alt" v-if="isCron"></fa>
            </a-tooltip>
        </td>
        <td class="text-xs text-gray-500" style="min-width: 140px">
            <div class="flex flex-col space-y-1">
                <a-tooltip placement="left" :title="startedAt(false)">
                    <fa icon="fal hourglass-start" class="mr-1 pushtop"></fa
                    >{{ startedAt(true) }} ago
                </a-tooltip>
                <a-tooltip
                    placement="left"
                    :title="finishedAt(false)"
                    v-if="finishedAt(true)"
                >
                    <fa icon="fal hourglass-end" class="mr-1 pushtop"></fa
                    >{{ finishedAt(true) }} ago
                </a-tooltip>
            </div>
        </td>

        <td class="text-xs text-gray-500" style="min-width: 160px">
            {{ duration(item) }}
            <a-progress
                :percent="progressPercent(item)"
                size="small"
                v-if="phase == 'Running'"
            >
                <template #format="percent, successPercent">
                    {{ progress(item) }}
                </template>
            </a-progress>
        </td>

        <td class="text-xs text-gray-500">
            <p class="mb-0">{{ creator }}</p>
        </td>
        <td class="text-gray-500">
            <a-dropdown>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1">Details</a-menu-item>
                        <a-menu-item key="1">View Logs</a-menu-item>
                        <a-menu-item key="2">View Metrics</a-menu-item>
                        <a-menu-divider></a-menu-divider>
                        <a-menu-item
                            key="3"
                            class="text-red-500"
                            @click="handleStop"
                            >Stop Run</a-menu-item
                        >
                    </a-menu>
                </template>
                <a-button>
                    Actions
                    <fa icon="fal chevron-down" class="ml-1 text-sm"></fa>
                </a-button>
            </a-dropdown>
        </td>
    </tr>
</template>

<script lang="ts">
    import { Modal } from 'ant-design-vue'
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    dayjs.extend(relativeTime)
    import { defineComponent, computed, ref } from 'vue'
    import useRunStop from '~/composables/bots/useRunStop'

    import WorkflowMixin from '~/mixins/workflow'
    import { useConnectionsStore } from '~/store/connections'

    export default defineComponent({
        mixins: [WorkflowMixin],
        components: {},
        props: {
            item: {
                type: Object,
                required: false,
                default(): any {
                    return {}
                },
            },
        },
        setup(props) {
            const phase = computed(() => {
                return props.item?.status?.phase
            })

            const titleCase = (text: string, delimiter: string) => {
                if (text) {
                    return text
                        .split(delimiter)
                        .map(
                            (word: string) =>
                                `${word.charAt(0).toUpperCase()}${word
                                    .substr(1)
                                    .toLowerCase()}`
                        )
                        .join(delimiter)
                }
                return text
            }

            const category = computed(() => {
                return (
                    titleCase(props.item?.metadata?.labels['category'], ' ') ||
                    props.item.metadata.name
                )
            })

            const creator = computed(() => {
                return (
                    props.item?.metadata?.labels['created-by'] ||
                    props.item?.metadata?.labels[
                        'workflows.argoproj.io/creator'
                    ]
                )
            })

            const name = computed(() => {
                return props.item?.metadata.name
                // return (
                //     props.item?.metadata?.labels['created-by'] ||
                //     props.item?.metadata?.labels[
                //         'workflows.argoproj.io/creator'
                //     ]
                // )
            })

            const startedAt = (relative: boolean) => {
                if (props.item.status.startedAt) {
                    if (relative) {
                        return dayjs().from(props.item.status.startedAt, true)
                    }
                    return dayjs(props.item.status.startedAt).format(
                        'dddd MMMM D YYYY HH:mm:ss'
                    )
                }
                return ''
            }
            const finishedAt = (relative: boolean) => {
                if (props.item.status.finishedAt) {
                    if (relative) {
                        return dayjs().from(props.item.status.finishedAt, true)
                    }
                    return dayjs(props.item.status.finishedAt).format(
                        'dddd MMMM D YYYY HH:mm:ss'
                    )
                }

                return ''
            }

            const isCron = computed(() => {
                if (
                    props.item?.metadata?.labels[
                        'workflows.argoproj.io/cron-workflow'
                    ]
                ) {
                    return true
                }
                return false
            })

            const store = useConnectionsStore()

            const connectionDisplayName = computed(() => {
                const guid = props.item?.metadata?.labels['connection-guid']
                if (guid) {
                    return (
                        store.getList.find((item) => item.guid == guid)
                            ?.attributes.displayName || ''
                    )
                }
                return ''
            })

            const connectionImage = computed(() => {
                const guid = props.item?.metadata?.labels['connection-guid']
                if (guid) {
                    console.log(guid)

                    const integrationName = store.getList.find(
                        (item) => item.guid === guid
                    )?.attributes.integrationName
                    console.log(integrationName)
                    return store.getImage(integrationName) || ''
                }

                return ''
            })

            const now = ref(false)

            const { isLoading, refresh } = useRunStop(now, name)

            const handleStop = () => {
                console.log('stop')
                Modal.confirm({
                    title: 'Are you sure you want to stop the run?',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    okButtonProps: {
                        loading: isLoading.value && now.value,
                    },
                    onOk() {
                        console.log('OK')
                        if (!now.value) {
                            now.value = true
                        } else {
                            refresh()
                        }
                    },
                    onCancel() {
                        console.log('Cancel')
                    },
                    class: 'test',
                })
            }

            return {
                phase,
                category,
                connectionDisplayName,
                creator,
                isCron,
                startedAt,
                finishedAt,
                connectionImage,
                handleStop,
                isLoading,
            }
        },
    })
</script>

<style lang="less" scoped>
    .table td,
    .table th {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }
</style>
