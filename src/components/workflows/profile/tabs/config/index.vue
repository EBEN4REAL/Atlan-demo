<template>
    <div class="flex flex-col flex-grow h-full overflow-hidden">
        <Loader v-if="isLoading"></Loader>
        <div
            v-else-if="!isLoading && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>
        <div class="flex h-full" v-else-if="configMap">
            <Setup
                :workflowTemplate="workflowObject"
                :configMap="configMapParsed"
                :isEdit="true"
                :defaultValue="getGlobalArguments(workflowObject)"
            ></Setup>
            <div class="bg-white" style="max-width: 360px">
                <Preview :item="packageObject"></Preview>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, watch, ref, toRefs } from 'vue'
    import Setup from '@/packages/setup/index.vue'
    import { useConfigMapByName } from '~/composables/package/useConfigMapByName'
    import Loader from '@/common/loaders/page.vue'
    import ErrorView from '@common/error/discover.vue'
    import Preview from '@/workflows/preview/property/index.vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        name: 'WorkflowConfig',
        components: { Setup, Loader, ErrorView, Preview },
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
        setup(props, { emit }) {
            const { workflowObject, packageObject } = toRefs(props)

            const { getGlobalArguments } = useWorkflowInfo()

            console.log(workflowObject.value)

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

            return {
                workflowObject,
                configMap,
                packageObject,
                isLoading,
                error,
                configMapParsed,
                getGlobalArguments,
            }
        },
    })
</script>

<style lang="less" scoped></style>
