<template>
    <div class="flex flex-col w-full h-full px-6">
        <a-tabs v-model:activeKey="activeKey" :class="$style.sandboxtab">
            <a-tab-pane key="template" tab="Template"> </a-tab-pane>
            <a-tab-pane key="config" tab="Parameters"> </a-tab-pane>
        </a-tabs>
        <a-radio-group v-model:value="mode" button-style="solid" class="mb-3">
            <a-radio-button value="tree">Tree</a-radio-button>
            <a-radio-button value="code">Code</a-radio-button>

            <a-radio-button value="text">Raw</a-radio-button>
        </a-radio-group>

        <Vue3JsonEditor
            v-if="activeKey == 'config'"
            :key="`config_${mode}`"
            v-model="configMap"
            :mode="mode"
            :show-btns="false"
            class="overflow-y-auto"
            style="height: calc(100% - 40px)"
            @json-change="handleConfigInput"
        />
        <Vue3JsonEditor
            v-else
            :key="`workflow_${mode}`"
            v-model="workflowTemplate"
            :mode="mode"
            :show-btns="false"
            class="overflow-y-auto"
            style="height: calc(100% - 40px)"
            @json-change="handleWorkflowChange"
        />
    </div>
</template>

<script lang="ts">
    // Vue
    import { useDebounceFn, useVModels } from '@vueuse/core'
    import { defineComponent, inject, ref } from 'vue'
    import { Vue3JsonEditor } from 'vue3-json-editor'

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: {
            Vue3JsonEditor,
        },
        props: {
            workflowTemplate: {
                type: Object,
                required: false,
            },
            configMap: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['update:configMap', 'update:workflowTemplate'],
        setup(props, { emit }) {
            const activeKey = ref('config')

            const mode = ref('code')

            const { workflowTemplate, configMap } = useVModels(props, emit)

            const handleConfigInput = useDebounceFn((e) => {
                configMap.value = e
            }, 500)

            const handleWorkflowChange = useDebounceFn((e) => {
                workflowTemplate.value = e
            }, 500)

            return {
                activeKey,
                workflowTemplate,
                configMap,
                handleConfigInput,
                mode,
                handleWorkflowChange,
            }
        },
    })
</script>

<style lang="less">
    .jsoneditor-vue {
        @apply h-full;
    }
    .jsoneditor {
        @apply border-0  !important;
    }
    .jsoneditor-menu {
        @apply hidden;
    }
    .jsoneditor-dragarea {
        @apply hidden;
    }
    .jsoneditor-contextmenu {
        @apply hidden;
    }
    td:first-child {
        display: none !important;
    }
    td:nth-child(2) {
        display: none !important;
    }
    div.jsoneditor .jsoneditor-expandable {
        td:first-child {
            display: none !important;
        }
        td:nth-child(2) {
            display: none !important;
        }
    }
    div.jsoneditor .jsoneditor-values {
        td:first-child {
            display: table-cell !important;
        }
        td:nth-child(2) {
            display: table-cell !important;
        }
    }
    .jsoneditor-outer {
        height: 100% !important;
        min-height: 100% !important;
    }

    .ace-jsoneditor {
        height: 100% !important;
        min-height: 100% !important;
    }

    .jsoneditor-text {
        height: 100% !important;
        min-height: 100% !important;
    }
</style>

<style lang="less" module>
    .sandboxtab {
        :global(.ant-tabs-nav-container) {
            width: 48px !important;
            @apply ml-0 !important;
        }
        :global(.ant-tabs-tab) {
            padding: 3px 8px !important;
            @apply justify-center;
        }

        :global(.ant-tabs-nav-wrap) {
            @apply pt-3;
        }

        :global(.ant-tabs-content) {
            @apply px-0 h-full !important;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 !important;
            @apply pb-0 !important;
            @apply h-0 !important;
        }

        :global(.ant-tabs-content-holder) {
            @apply hidden !important;
        }
    }
</style>
