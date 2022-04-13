<template>
    <div class="flex w-full h-full overflow-hidden">
        <div
            class="flex-grow px-5 py-5 space-y-4 overflow-y-scroll border-r lg:px-10 xl:px-16"
        >
            <div
                v-for="(step, index) in steps"
                :key="`form_${index}`"
                class="px-4 py-3 border rounded-lg shadow-sm"
            >
                <div v-if="!['connection', 'credential'].includes(step.id)">
                    <p class="text-base font-bold capitalize text-new-gray-800">
                        {{ step.title }}
                    </p>
                    <a-divider class="mt-3 mb-2" />
                </div>
                <DynamicForm
                    v-model="modelValue"
                    :key="`form_${index}`"
                    :config="localConfigMap"
                    :current-step="step"
                    :workflow-template="workflowTemplate"
                    label-align="left"
                    :is-edit="true"
                    class="mx-auto"
                />
            </div>
            <div
                v-if="allowSchedule(workflowObject)"
                class="px-4 py-3 border rounded-lg shadow-sm"
            >
                <div class="flex items-center">
                    <span class="text-base font-bold text-new-gray-800">
                        Enable Schedule
                    </span>
                    <a-switch v-model:checked="cronEnabled" class="ml-auto" />
                </div>
                <template v-if="cronEnabled">
                    <a-divider class="mt-3 mb-4" />
                    <Schedule v-model="cron" />
                </template>
            </div>
        </div>
        <WorkflowPreview
            v-if="workflowTemplate"
            :item="workflowTemplate"
            mode="package"
            style="width: 360px"
            class="flex-none"
        />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import WorkflowPreview from '~/workflows/components/workflows/preview/index.vue'
    import DynamicForm from '~/workflows/components/dynamicForm2/index.vue'
    import Schedule from '~/workflowsv2/components/marketplace/setup/schedule.vue'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    export default defineComponent({
        name: 'WorkflowConfig',
        components: { WorkflowPreview, DynamicForm, Schedule },
        props: {
            workflowTemplate: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            workflowObject: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            configMap: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            defaultValue: {
                type: Object,
                required: false,
                default: () => ({}),
            },
        },
        emits: [],
        setup: (props) => {
            const {
                workflowTemplate,
                configMap,
                defaultValue,
                workflowObject,
            } = toRefs(props)

            const { allowSchedule } = useWorkflowInfo()

            const localTemplate = ref(workflowTemplate.value)
            const localConfigMap = ref(configMap.value)
            const modelValue = ref(defaultValue.value)

            const steps = computed(() => localConfigMap?.value?.steps || [])

            const cron = ref({
                cron: workflowTemplate.value?.metadata?.annotations[
                    'orchestration.atlan.com/schedule'
                ],
                timezone:
                    workflowTemplate.value?.metadata?.annotations[
                        'orchestration.atlan.com/timezone'
                    ],
            })
            const cronEnabled = ref(!!cron.value.cron)

            return {
                localTemplate,
                localConfigMap,
                modelValue,
                steps,
                cron,
                cronEnabled,
                allowSchedule,
            }
        },
    })
</script>
