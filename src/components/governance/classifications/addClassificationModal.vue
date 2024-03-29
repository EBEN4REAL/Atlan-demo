<template>
    <a-modal
        :visible="modalVisible"
        width="40%"
        :class="$style.modal"
        :destroy-on-close="true"
        :closable="false"
        ok-text="Save"
        cancel-text=""
        :footer="null"
        @cancel="closeModal"
    >
        <!-- <template #title>
            <div class="flex justify-between">
                <div
                    class="flex items-center justify-between w-full px-3 text-base leading-6"
                >
                    <div class="font-bold text-gray-500">
                        New Classification
                    </div>
                </div>
                <ClassificationColorSelector
                    v-model:selectedColor="classificationColor"
                />
            </div>
        </template> -->

        <div class="">
            <div class="flex justify-between">
                <a-input
                    ref="titleBar"
                    v-model:value="name"
                    :placeholder="`Untitled Classification`"
                    class="pt-0 text-lg font-bold text-gray-700 border-0 shadow-none outline-none"
                    :class="$style.placeholder"
                />
                <ClassificationColorSelector
                    v-model:selectedColor="classificationColor"
                />
            </div>

            <a-textarea
                v-model:value="description"
                placeholder="Add description..."
                class="text-gray-500 border-0 shadow-none outline-none"
                :maxlength="140"
                :rows="2"
            />
        </div>
        <div
            class="flex items-center justify-end mt-4 space-x-3 border-gray-200"
        >
            <a-button class="border-0 shadow-none" @click="closeModal"
                >Cancel
            </a-button>
            <a-button
                type="primary"
                :loading="mode === 'create' ? createLoading : editLoading"
                @click="handleOk"
            >
                {{ mode === 'create' ? 'Create' : 'Update' }}
            </a-button>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        reactive,
        watch,
        ref,
        PropType,
        toRefs,
        nextTick,
        Ref,
    } from 'vue'
    import { useVModels, whenever } from '@vueuse/core'
    import { message, message } from 'ant-design-vue'
    import { useRouter } from 'vue-router'

    import ClassificationColorSelector from '@/governance/classifications/classificationColorSelector.vue'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    import useCreateTypedefs from '~/composables/typedefs/useCreateTypedefs'
    import useEditTypedefs from '~/composables/typedefs/useEditTypedefs'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'AddClassificationModal',
        components: {
            ClassificationColorSelector,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: false,
            },
            modalVisible: {
                type: Boolean,
                required: true,
            },
            mode: {
                type: String as PropType<'create' | 'edit'>,
                required: false,
                default: 'create',
            },
        },
        emits: ['update:modalVisible'],
        setup(props, { emit }) {
            const { classification: selectedClassification } = toRefs(props)
            const { modalVisible } = useVModels(props, emit)
            const router = useRouter()
            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const name = ref(selectedClassification.value?.displayName ?? '')
            const description = ref(
                selectedClassification.value?.description ?? ''
            )
            const classificationColor = ref(
                selectedClassification?.value?.options?.color ?? 'Green'
            )

            const body = ref<Record<string, any>>({})
            const {
                data: createData,
                isLoading: createLoading,
                mutate: mutateCreate,
                isReady: isCreateReady,
            } = useCreateTypedefs(body)
            const {
                isLoading: editLoading,
                mutate: mutateEdit,
                isReady: isUpdateReady,
            } = useEditTypedefs(body)

            const closeModal = () => {
                modalVisible.value = false
                if (props.mode === 'create') {
                    name.value = ''
                    description.value = ''
                    classificationColor.value = 'Green'
                } else {
                    name.value = selectedClassification.value?.displayName ?? ''
                    description.value =
                        selectedClassification.value?.description ?? ''
                    classificationColor.value =
                        selectedClassification.value?.options?.color ?? 'Green'
                }
            }

            const createClassification = () => {
                body.value = {
                    classificationDefs: [
                        {
                            attributeDefs: [],
                            displayName: name.value,
                            description: description.value,
                            superTypes: [],
                            options: {
                                color: classificationColor.value,
                            },
                        },
                    ],
                }
                mutateCreate()
            }

            const editClassification = () => {
                body.value = {
                    classificationDefs: [
                        {
                            ...selectedClassification.value,
                            displayName: name.value,
                            description: description.value,
                            options: {
                                ...selectedClassification.value?.options,
                                color: classificationColor.value,
                            },
                        },
                    ],
                }
                mutateEdit()
            }

            const handleOk = async () => {
                if (!name.value) {
                    message.error('Classification name cannot be blank')
                } else if (props.mode === 'create') {
                    createClassification()
                } else {
                    editClassification()
                }
            }
            watch(modalVisible, async (newVisible) => {
                if (newVisible) {
                    await nextTick()
                    titleBar.value?.focus()
                }
            })

            watch(selectedClassification, (newSelectedClassification) => {
                if (newSelectedClassification) {
                    name.value = newSelectedClassification.displayName
                    description.value =
                        newSelectedClassification?.description ?? ''
                    classificationColor.value =
                        newSelectedClassification?.options?.color ?? 'Green'
                }
            })

            whenever(isCreateReady, () => {
                message.success(`${name.value} Created!`)
                closeModal()
                if (createData.value?.classificationDefs[0]?.name) {
                    router.push(
                        `/governance/classifications/${createData.value?.classificationDefs[0]?.name}`
                    )
                }
                useAddEvent('governance', 'classification', 'created')
            })

            whenever(isUpdateReady, () => {
                message.success(`${name.value} Updated!`)
                useAddEvent('governance', 'classification', 'updated')
                closeModal()
            })

            return {
                selectedClassification,
                modalVisible,
                closeModal,
                name,
                description,
                createClassification,
                createLoading,
                editClassification,
                editLoading,
                handleOk,
                titleBar,
                classificationColor,
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
            @apply p-4  !important;
        }
    }
    .placeholder {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
