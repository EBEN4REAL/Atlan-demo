<template>
    <div
        class="flex flex-col w-full px-6 py-3 mb-3 overflow-y-auto"
        v-if="workflowTemplate"
    >
        <div
            class="flex items-center mb-1"
            v-if="workflowTemplate?.metadata.annotations"
        >
            <img
                v-if="
                    workflowTemplate?.metadata.annotations[
                        'com.atlan.orchestration/icon'
                    ]
                "
                class="self-center w-5 h-auto mr-2"
                :src="
                    workflowTemplate?.metadata.annotations[
                        'com.atlan.orchestration/icon'
                    ]
                "
            />
            <div class="text-base font-bold truncate overflow-ellipsis">
                {{
                    workflowTemplate?.metadata.annotations[
                        'workflows.argoproj.io/name'
                    ]
                }}
            </div>
        </div>

        <div class="text-sm line-clamp-4">
            <span v-if="workflowTemplate?.metadata.annotations">
                {{
                    workflowTemplate?.metadata.annotations[
                        'workflows.argoproj.io/description'
                    ]
                }}</span
            >
        </div>
        <div
            class="flex mt-1 text-gray-500"
            v-if="workflowTemplate?.metadata.annotations"
        >
            <div class="text-sm truncate overflow-ellipsis">
                {{
                    workflowTemplate?.metadata.annotations[
                        'com.atlan.orchestration/packageName'
                    ]
                }}
            </div>
            <div class="text-sm truncate overflow-ellipsis">
                (v{{
                    workflowTemplate?.metadata.labels[
                        'org.argopm.package.version'
                    ]
                }})
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, toRefs } from 'vue'

    // Composables

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: {},
        props: {
            workflowTemplate: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        setup(props, { emit }) {
            const { workflowTemplate } = toRefs(props)

            return {
                workflowTemplate,
            }
        },
    })
</script>
