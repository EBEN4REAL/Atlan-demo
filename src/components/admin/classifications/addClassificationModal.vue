<template>
    <a-modal
        :visible="modalVisible"
        title="Add"
        @cancel="closeModal"
        :destroyOnClose="true"
        :footer="null"
    >
        <a-form
            ref="createClassificationFormRef"
            :model="formState"
            :rules="rules"
            layout="vertical"
        >
            <a-form-item ref="name" label="Name" name="name">
                <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item
                ref="description"
                label="Description"
                name="description"
            >
                <a-textarea v-model:value="formState.description" />
            </a-form-item>

            <div class="flex justify-end w-full">
                <a-button class="mr-4" @click="closeModal">Cancel</a-button>
                <a-button
                    type="primary"
                    @click="createClassification"
                    >Create</a-button
                >
            </div>
        </a-form>
        <!-- <p v-if="createErrorText" class="mt-4 mb-0 text-sm text-red-500">
            {{ createErrorText }}
        </p> -->
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, reactive, UnwrapRef, ref, PropType, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

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
            const formState = reactive({
                name: '',
                description: '',
            })

            const closeModal = () => {
                modalVisible.value = false
                formState.name = '';
            }

            const urlValidationRegex = new RegExp(
                '^[a-zA-Z][a-zA-Z0-9\s_]*',
                'g'
            )
            const rules = {
                name: [
                    {
                        required: true,

                        pattern: urlValidationRegex,
                        message:
                            'Names must consist of a letter followed by a sequence of letter, number, space, or _ characters',

                        trigger: 'blur',
                    },
                ],
            }

            return {
                selectedClassification,
                modalVisible,
                closeModal,
                rules,
                formState
            }
        },
    })
</script>

<style lang="less">

</style>
