<template>
    <div>{{ selectedWorkflow.name }}</div>
    <div class="">
        <a-modal
            v-model:visible="visible"
            title="Create Workflow"
            :class="$style.input"
        >
            <p>Name:</p>
            <a-input v-model:value="workflowName"></a-input>
            <template #footer>
                <div class="flex items-center justify-end space-x-3">
                    <a-button @click="visible = false">Cancel</a-button>
                    <a-button
                        type="primary"
                        @click="handleCreate"
                        :loading="isLoading"
                        >Create</a-button
                    >
                </div>
            </template>
        </a-modal>
    </div>
    <AtlanButton
        class="absolute bottom-0 m-2"
        size="sm"
        color="primary"
        padding="compact"
        @click="handleSetupWorkflow"
    >
        Setup
    </AtlanButton>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        onMounted,
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
        provide,
        computed,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { createWorkflow } from '~/composables/workflow/useWorkFlowList'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'SetupWorkflowPreview',
        components: {
            AtlanButton,
        },
        props: {
            selectedWorkflow: {
                type: Object,
                required: true,
            },

            showCrossIcon: {
                type: Boolean,
                required: false,
            },
        },
        emits: ['assetMutation', 'closeSidebar'],
        setup(props, { emit }) {
            const { selectedWorkflow } = toRefs(props)

            const isLoaded: Ref<boolean> = ref(true)
            const visible: Ref<boolean> = ref(false)
            const router = useRouter()

            const workflowName = ref('')

            const handleSetupWorkflow = () => {
                visible.value = true
            }

            const body = computed(() => ({
                metadata: {
                    name: workflowName.value,
                },
                spec: {
                    arguments: {
                        parameters: [
                            ...selectedWorkflow.value?.workflowtemplate?.spec?.arguments?.parameters
                                .filter((p) => !p.value)
                                .map((e) => ({ name: e.name, value: '' })),
                        ],
                    },
                    workflowTemplateRef: {
                        name: selectedWorkflow.value.name,
                        clusterScope: true,
                    },
                },
            }))

            const { data, error, isLoading, mutate } = createWorkflow(
                body,
                false
            )
            const handleCreate = () => {
                mutate()

                watch([data, error], (v) => {
                    if (data.value && !error.value) {
                        visible.value = false
                        router.push(
                            `/workflows/${data.value.metadata.name}/setup`
                        )
                    }
                })
            }

            function init() {
                isLoaded.value = false
            }

            watch(selectedWorkflow, init, { deep: true })

            return {
                handleSetupWorkflow,
                handleCreate,
                isLoading,
                body,
                visible,
                workflowName,
            }
        },
    })
</script>
<style lang="less" scoped>
    .icon-btn {
        @apply flex;
        @apply py-2 ml-2 px-3;
        @apply rounded;
        @apply text-gray;
        @apply border border-gray-300;
        @apply cursor-pointer;
        @apply hover:bg-gray-100;
    }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0 !important;
            @apply mt-4 !important;
        }

        :global(.ant-tabs-bar) {
            margin-bottom: 0px !important;
        }
        :global(.ant-tabs-nav-container) {
            width: 48px !important;
            @apply ml-0 !important;
        }
        :global(.ant-tabs-tab) {
            height: 48px !important;
            width: 48px !important;
            @apply p-0 !important;
        }

        :global(.ant-tabs-content) {
            @apply px-0 !important;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 !important;
            @apply pb-0 !important;
        }
    }

    .input {
        :global(.ant-input:focus
                .ant-input:hover
                .ant-input::selection
                .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
        }
        // :global(.ant-input) {
        //     @apply shadow-none outline-none px-0 border-0 !important;
        // }
        :global(.ant-modal-header) {
            @apply border-0 border-t-0 border-b-0 px-4  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-4 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply px-4 pt-0 pb-4 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
