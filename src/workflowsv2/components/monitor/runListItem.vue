<template>
    <div
        class="border-b border-gray-300 run-list-item text-new-gray-800 group"
        :class="
            connectionDeleted
                ? 'cursor-not-allowed hover:bg-gray-100'
                : 'hover:bg-primary-menu'
        "
        @click="
            !connectionDeleted &&
                $router.push(
                    `/workflows/profile/${workflowTemplateName(
                        run
                    )}/runs?name=${name(run)}`
                )
        "
    >
        <div class="flex items-center col-span-4 text-new-gray-600 gap-x-3">
            <PackageIcon :package="pkg" />
            <div class="overflow-x-hidden">
                <router-link
                    v-if="!connectionDeleted"
                    :to="`/workflows/profile/${workflowTemplateName(
                        run
                    )}/runs?name=${name(run)}`"
                >
                    <p
                        class="text-sm font-bold truncate text-new-gray-700"
                        :class="
                            connectionDeleted
                                ? 'cursor-not-allowed'
                                : 'group-hover:underline'
                        "
                    >
                        {{ pkgName(pkg) || name(run) }}
                        <AtlanIcon
                            v-if="dName"
                            icon="CaretRight"
                            class="-ml-1 -mr-0.5 mb-0.5"
                        />
                        {{ dName }}
                    </p>
                </router-link>
                <div v-else class="flex items-center gap-x-2">
                    <p
                        class="text-sm font-bold truncate cursor-not-allowed text-new-gray-400"
                    >
                        {{ pkgName(pkg) || name(run) }}

                        <AtlanIcon
                            v-if="dName"
                            icon="CaretRight"
                            class="-ml-1 -mr-0.5 mb-0.5"
                        />
                        {{ dName }} {{ dName }}
                    </p>
                    <span
                        v-if="connectionDeleted"
                        class="p-1 pb-0.5 text-xs font-semibold tracking-wider text-gray-400 uppercase border border-gray-300 rounded whitespace-nowrap"
                    >
                        Connection Deleted
                    </span>
                </div>
                <div
                    class="flex items-center mt-1 overflow-hidden flex-nowrap gap-x-1"
                >
                    <template v-if="isCronRun(run)">
                        <span class="lg:whitespace-nowrap">Scheduled Run</span>
                        <AtlanIcon icon="Schedule" class="mx-1 text-success" />
                        <span
                            class="text-sm truncate text-new-gray-800 lg:whitespace-nowrap"
                            :title="cronString(workflow) || 'No info'"
                            >{{ cronString(workflow) || 'No info' }}</span
                        >
                    </template>
                    <template v-else>
                        <span class="lg:whitespace-nowrap">Manual Run by</span>
                        <UserWrapper
                            :username="creatorUsername(run)"
                            @click.stop=""
                        />
                    </template>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-center col-span-1">
            <span
                class="status-badge"
                style="padding: 7px 12px 5px"
                :class="[getRunTextClass(run), getRunClassBgLight(run)]"
            >
                <div class="dot" :class="getRunClassBg(run)" />
                {{ runStatusMap[run.status.phase]?.label || run.status.phase }}
            </span>
        </div>

        <!-- <div class="col-span-1 truncate text-new-gray-600">
                <template v-if="isCronRun(run)">
                    <p class="lg:whitespace-nowrap">Scheduled Run</p>
                    <div class="flex items-center overflow-hidden flex-nowrap">
                        <AtlanIcon icon="Schedule" class="mr-1 text-success" />
                        <span
                            class="text-sm truncate text-new-gray-800 lg:whitespace-nowrap"
                            :title="cronString(workflow) || 'No info'"
                            >{{ cronString(workflow) || 'No info' }}</span
                        >
                    </div>
                </template>
                <template v-else>
                    <p class="lg:whitespace-nowrap">Manual Run by</p>
                    <UserWrapper
                        class="flex items-center flex-nowrap gap-x-1"
                        :username="creatorUsername(run)"
                        @click.stop
                    />
                </template>
            </div> -->

        <a-tooltip :title="startedAt(run, false)">
            <div class="flex items-center justify-end col-span-1">
                <span>{{ startedAt(run, true) }}</span>
            </div>
        </a-tooltip>

        <div class="flex items-center justify-end col-span-1 gap-x-4">
            <span>{{ duration(run) }}</span>
        </div>
        <div v-if="!connectionDeleted" class="flex justify-center col-span-1">
            <IconButton
                icon="ArrowRight"
                class="-mr-12 opacity-0 group-hover:opacity-100 text-primary"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import { runStatusMap } from '~/workflowsv2/constants/maps'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    import { useWorkflowStore } from '~/workflowsv2/store'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'
    import PackageIcon from '~/workflowsv2/components/common/packageIcon.vue'

    export default defineComponent({
        name: 'RunListItem',
        components: { UserWrapper, PackageIcon },
        props: {
            run: {
                type: Object as PropType<LiveRun>,
                required: true,
            },
            workflow: {
                type: Object,
                default: () => ({}),
            },
        },
        emits: [],
        setup(props) {
            const { workflow } = toRefs(props)
            const workflowStore = useWorkflowStore()

            const connectionDeleted = computed(
                () => !workflow.value?.metadata?.name
            )

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
            } = useWorkflowInfo()

            const { name: pkgName } = usePackageInfo()

            const pkg = computed(() => {
                const pkgId = packageName(workflow.value)
                return pkgId ? workflowStore.packageMeta?.[pkgId] : {}
            })

            const dName = computed(() =>
                displayName(
                    pkg.value,
                    name(workflow.value),
                    workflow.value?.spec
                )
            )

            return {
                connectionDeleted,
                getRunTextClass,
                getRunClassBgLight,
                getRunClassBg,
                duration,
                startedAt,
                creatorUsername,
                cronString,
                isCronRun,
                workflowTemplateName,
                runStatusMap,
                pkg,
                name,
                dName,
                pkgName,
            }
        },
    })
</script>
<style lang="less" scoped>
    .run-list-item {
        padding: 14px 16px 14px 16px;
        @apply cursor-pointer;
        @apply grid grid-cols-8 items-center gap-x-4;
        @apply text-sm;
    }
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
