<template>
    <div class="flex h-full overflow-y-hidden bg-white">
        <Loader v-if="isLoading" />
        <div
            v-else-if="!isLoading && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView />
        </div>

        <template v-else-if="configMap">
            <Config
                :workflow-template="packageObject"
                :workflow-object="workflowObject"
                :config-map="configMapParsed"
                :default-value="getGlobalArguments(workflowObject)"
            />
        </template>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, inject, toRefs } from 'vue'
    import Setup from '~/workflowsv2/migrated/packages/setup/index.vue'
    import Config from '~/workflowsv2/components/profile/config.vue'
    import { useConfigMapByName } from '~/workflows/composables/package/useConfigMapByName'
    import Loader from '@/common/loaders/page.vue'
    import ErrorView from '@/common/error/discover.vue'
    import Preview from '~/workflowsv2/migrated/packageSidebar.vue'

    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        name: 'WorkflowConfig',
        components: { Setup, Loader, ErrorView, Config, Preview },
        // mixins: [WorkflowMixin],
        props: {
            workflowObject: {
                type: Object,
                required: false,
                default: () => {},
            },
            packageObject: {
                type: Object,
                required: false,
                default: () => {},
            },
            // selectedPod: {
            //     type: Object,
            //     required: true,
            // },
            // activeKey: {
            //     type: Number,
            //     required: true,
            // },
        },
        setup(props) {
            const { packageObject } = toRefs(props)
            const refetchWorkflowObject = inject<() => void>(
                'refetchWorkflowObject'
            )
            const isWorkflowDirty = inject('isWorkflowDirty')

            const { getGlobalArguments } = useWorkflowInfo()

            const { isLoading, configMap, error } = useConfigMapByName(
                `${packageObject.value.metadata.name}`,
                true
            )

            const configMapParsed = computed(() => {
                try {
                    return JSON.parse(configMap.value.data.config)
                } catch (e) {
                    console.log(e)
                    return {}
                }
            })

            if (isWorkflowDirty.value) {
                refetchWorkflowObject()
                isWorkflowDirty.value = false
            }

            return {
                configMap,
                isLoading,
                error,
                configMapParsed,
                getGlobalArguments,
            }
        },
    })
</script>

<style lang="less" scoped></style>
