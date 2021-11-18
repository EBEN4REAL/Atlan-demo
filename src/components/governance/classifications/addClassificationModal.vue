<template>
    <a-modal
        :visible="modalVisible"
        width="50%"
        @cancel="closeModal"
        :class="$style.modal"
        :destroy-on-close="true"
        :closable="false"
        okText="Save"
        cancelText=""
        :footer="null"
    >
        <template #title>
            <div class="flex justify-between">
                <div class="px-3 flex items-center justify-between w-full text-base leading-6">
                    <div class="font-bold text-gray-700">New Classification</div>
                </div>
                <div class="flex space-x-1 p-1 rounded bg-indigo-50">
                    <AtlanIcon icon="Shield" class="text-blue-700 self-center"/>
                    <span class="text-xs self-center">Blue</span>
                </div>
            </div>
        </template>

        <div
            class="p-3 pt-0"
        >
            <a-input
                ref="titleBar"
                v-model:value="formState.name"
                :placeholder="`Untitled Classification`"
                class="text-lg pt-0 font-bold text-gray-700 border-0 shadow-none outline-none "
                :class="$style.placeholder"
            />
            <a-textarea
                v-model:value="formState.description"
                placeholder="Add description..."
                class="text-gray-500 border-0 shadow-none outline-none"
                :maxlength="140"
                :rows="2"
            />
        </div>
        <div class="flex items-center justify-end space-x-3 border-gray-200">
            <a-button @click="closeModal" class="border-0 shadow-none">Cancel</a-button>
            <a-button
                type="primary"
                @click="createClassification"
            >
                Create
            </a-button>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, reactive, watch, ref, PropType, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    import useCreateTypedefs from '~/composables/typedefs/useCreateTypedefs'

    export default defineComponent({
        name: 'AddClassificationModal',
        components: {
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: false,
            },
            modalVisible: {
                type: Boolean,
                required: true
            }
        },
        emits: ['update:modalVisible'],
        setup(props, { emit }) {
            const { classification: selectedClassification } = toRefs(props)
            const { modalVisible } = useVModels(props, emit)
            const createClassificationFormRef = ref()
            const createErrorText = ref('')
            const formState = reactive({
                name: '',
                description: '',
            })

            const closeModal = () => {
                modalVisible.value = false
                formState.name = '';
                formState.description = '';
            }

            const createClassification = () => {
                const { data, error, isLoading }  = useCreateTypedefs({
                    classificationDefs: [
                        {
                            attributeDefs: [],
                            displayName: formState.name,
                            description: formState.description,
                            superTypes: []
                        }
                    ]
                })

                watch(data, () => {
                    closeModal()
                })
                watch(error, (newError) => {
                    createErrorText.value = newError
                })
            }

            return {
                selectedClassification,
                modalVisible,
                closeModal,
                formState,
                createClassificationFormRef,
                createClassification,
                createErrorText
            }
        },
    })
</script>


<style lang="less" module>
    .modal {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
        :global(.ant-modal-header) {
            @apply border-0 px-4  !important;
        }
        :global(.ant-modal-body) {
            @apply p-4 pt-0 !important;
        }
    }
    .placeholder {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>

