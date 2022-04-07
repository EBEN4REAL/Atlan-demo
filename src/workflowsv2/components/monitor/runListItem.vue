<template>
    <router-link
        :to="`/workflows/profile/${workflowTemplateName(run)}/runs?name=${
            run.metadata.name
        }`"
    >
        <div
            class="border-b border-gray-300 run-list-item hover:bg-primary-menu text-new-gray-800"
        >
            <div class="flex items-center col-span-4 text-new-gray-600 gap-x-3">
                <div class="package-icon">
                    <img v-if="icon(pkg)" :src="icon(pkg)" class="w-6 h-6" />
                    <div
                        v-else
                        class="w-6 h-6 mt-1 text-xl leading-none text-center"
                    >
                        {{ emoji(pkg) || '📦' }}
                    </div>
                </div>
                <div>
                    <p class="text-base font-medium text-new-gray-800">
                        {{ pkgName(pkg) || run.metadata.name }}
                        <AtlanIcon v-if="dName" icon="CaretRight" />
                        {{ dName }}
                    </p>
                    <p class="text-sm">{{ run.metadata.name }}</p>

                    <!-- <div class="flex items-center gap-x-2">
                    <span class="font-medium text-primary">{{
                        startedAt(run, false)
                    }}</span>
                </div> -->
                </div>
            </div>

            <div class="flex items-center justify-center col-span-1">
                <span
                    class="status-badge"
                    style="padding: 7px 12px 5px"
                    :class="[getRunTextClass(run), getRunClassBgLight(run)]"
                >
                    <div class="dot" :class="getRunClassBg(run)" />
                    {{
                        runStatusMap[run.status.phase]?.label ||
                        run.status.phase
                    }}
                </span>
            </div>

            <div class="col-span-1 text-new-gray-600">
                <template v-if="isCronRun(run)">
                    <p>Scheduled Run</p>
                    <AtlanIcon icon="Schedule" class="mr-1 text-success" />
                    <span class="text-sm text-new-gray-800">{{
                        cronString(workflow) || 'No info'
                    }}</span>
                </template>
                <template v-else>
                    <p>Manually Run by</p>
                    <UserWrapper :username="creatorUsername(run)" @click.stop />
                </template>
            </div>

            <a-tooltip :title="startedAt(run, false)">
                <div class="flex items-center justify-end col-span-1">
                    <span>{{ startedAt(run, true) }}</span>
                </div>
            </a-tooltip>

            <div class="flex items-center justify-end col-span-1">
                <span>{{ duration(run) }}</span>
            </div>
            <!-- <div class="col-span-2">Output</div> -->
        </div>
    </router-link>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'
    import { runStatusMap } from '~/workflowsv2/constants/maps'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    import UserWrapper from '~/workflowsv2/components/common/user.vue'
    import { useWorkflowStore } from '~/workflowsv2/store'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

    export default defineComponent({
        name: 'RunListItem',
        components: { UserWrapper },
        props: {
            run: {
                type: Object as PropType<LiveRun>,
                required: true,
            },
            workflow: {
                type: Object,
                default: () => ({}),
            },
            wfLoading: {
                type: Boolean,
                default: () => false,
            },
        },
        emits: [],
        setup(props) {
            const { workflow } = toRefs(props)
            const workflowStore = useWorkflowStore()

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

            const { icon, emoji, name: pkgName } = usePackageInfo()

            const pkg = computed(() => {
                const pkgId = packageName(workflow.value)
                return pkgId ? workflowStore.packageMeta?.[pkgId] : {}
            })

            const dName = computed(() =>
                displayName(pkg.value, name(workflow.value))
            )

            return {
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
                icon,
                emoji,
                dName,
                pkgName,
            }
        },
    })
</script>
<style lang="less" scoped>
    .run-list-item {
        padding: 14px 64px 14px 12px;
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
    .package-icon {
        @apply rounded-lg border bg-white p-2 flex-none;
    }
</style>
