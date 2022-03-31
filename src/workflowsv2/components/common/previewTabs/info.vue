<template>
    <div class="flex flex-col h-full overflow-y-hidden text-sm bg-white">
        <div
            class="flex items-center justify-between px-5 py-2 border-b border-gray-200 bg-gray-50"
        >
            <span class="flex items-center">
                <PreviewTabsIcon :icon="tab.icon" height="h-4" class="mb-0.5" />
                <span class="ml-1 font-semibold text-gray-500">Overview</span>
            </span>
        </div>
        <div class="flex flex-col p-5 overflow-y-scroll gap-y-4">
            <div class="grid grid-cols-3">
                <div>
                    <p class="info-title">Run Count</p>
                    <p class="font-bold text-primary">N</p>
                </div>
                <div class="col-span-2">
                    <p class="info-title">Average Runtime</p>
                    <p class="italic text-gray">X min Y seconds</p>
                </div>
            </div>
            <div v-if="isCronWorkflow(workflow)">
                <p class="info-title">Schedule</p>

                <AtlanIcon icon="Schedule" class="text-success" />
                <span class="ml-1 pt-0.5">{{ cronString(workflow) }}</span>
            </div>

            <div v-if="creatorUsername(workflow)">
                <p class="info-title">Created</p>
                <span>{{ creationTimestamp(workflow, true) }} ago by </span>
                <span
                    class="cursor-pointer hover:underline"
                    @click="() => openUserSidebar(creatorUsername(workflow))"
                >
                    <img
                        v-if="showCreatorImage"
                        :src="avatarUrl(creatorUsername(workflow))"
                        class="flex-none inline-block h-4 rounded-full"
                        @error="showCreatorImage = false"
                    />
                    {{ creatorUsername(workflow) }}
                </span>
            </div>

            <div v-if="creatorUsername(workflow)">
                <p class="info-title">Modified</p>
                <span>By </span>
                <span
                    class="cursor-pointer hover:underline"
                    @click="() => openUserSidebar(creatorUsername(workflow))"
                >
                    <img
                        v-if="showModifierImage"
                        :src="avatarUrl(creatorUsername(workflow))"
                        class="flex-none inline-block h-4 rounded-full"
                        @error="showModifierImage = false"
                    />
                    {{ creatorUsername(workflow) }}
                </span>
            </div>

            <div>
                <p class="info-title">Last 5 runs</p>
                <RunIndicators
                    :workflow="wfName(workflow)"
                    :runs="runs"
                    type="vertical"
                />
            </div>
            <a-divider class="mt-5 mb-0" />
            <div class="mb-1">
                <p class="info-title">Package and Type</p>

                <div class="flex mb-2 gap-x-2">
                    <span class="font-bold truncate text-primary">
                        {{ name(workflow) }}
                    </span>
                    <span class="italic text-gray-500"
                        >v{{ version(workflow) }}</span
                    >
                </div>

                <div v-if="packageType(workflow)" class="badge">
                    <span style="margin-top: 1px">{{
                        packageType(workflow)
                    }}</span>
                </div>
            </div>
            <div>
                <p class="info-title">Workflow ID</p>
                <p class="text-gray-700">{{ wfName(workflow) }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'

    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { avatarUrl } from '~/composables/user/useUsers'

    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import RunIndicators from '~/workflowsv2/components/common/runIndicators.vue'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

    export default defineComponent({
        name: 'WorkflowInfo',
        components: { PreviewTabsIcon, RunIndicators },
        props: {
            tab: {
                type: Object,
                default: () => ({}),
            },
            workflow: {
                type: Object,
                default: () => {},
            },
            runs: {
                type: Array,
                default: () => [],
            },
        },
        emits: [],
        setup(props) {
            const { workflow } = toRefs(props)
            const {
                isCronWorkflow,
                cronString,
                creatorUsername,
                creationTimestamp,
                modifierUsername,
                name: wfName,
                packageType,
            } = useWorkflowInfo()

            const { name, version } = usePackageInfo()

            const showCreatorImage = ref(true)
            const showModifierImage = ref(true)

            const { openUserSidebar } = useUserPreview()

            watch(workflow, () => {
                showCreatorImage.value = true
                showModifierImage.value = true
            })

            return {
                wfName,
                avatarUrl,
                openUserSidebar,
                showCreatorImage,
                showModifierImage,
                isCronWorkflow,
                cronString,
                creatorUsername,
                modifierUsername,
                creationTimestamp,
                packageType,
                name,
                version,
            }
        },
    })
</script>

<style scoped>
    .info-title {
        @apply font-medium text-gray-500;
        @apply mb-2;
    }

    .badge {
        @apply inline-flex items-center justify-center;
        @apply h-5 rounded uppercase px-2;
        @apply text-xs tracking-wider bg-gray-200 text-gray;
    }
</style>
