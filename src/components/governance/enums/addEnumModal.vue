<template>
    <a-modal
        :visible="true"
        class="add-label-modal"
        :confirm-loading="!isReady"
        :closable="false"
        :footer="false"
        destroy-on-close
    >
        <div class="p-4">
            <div class="mb-2 font-bold text-gray-700">New Option</div>
            <a-form layout="vertical">
                <a-form-item label="Name">
                    <a-input
                        id="name-input"
                        v-model:value="form.name"
                        placeholder="Name of the Option"
                    ></a-input>
                    <div v-if="errorMessage" class="mt-2 text-xs text-red-500">
                        {{ errorMessage }}
                    </div>
                </a-form-item>

                <a-form-item label="Values">
                    <MultiInput
                        ref="valuesRef"
                        placeholder='Enter values separated by a  ";" or "↵"'
                        :value="form.elementDefs"
                        delimiter=";"
                        @change="handleChange"
                    />
                </a-form-item>
                <div class="flex items-center justify-end space-x-3">
                    <a-button class="border-0" @click="$emit('close')"
                        >Cancel</a-button
                    >
                    <a-button
                        type="primary"
                        :loading="isLoading"
                        :disabled="!form.name || !form.elementDefs?.length"
                        @click="handleOK"
                        >{{ isEdit ? 'Update' : 'Create' }}</a-button
                    >
                </div>
            </a-form>
        </div>
        <!-- <EnumDetails
            ref="enumDetailsComponent"
            :is-new="true"
            :selected-enum="defaultEnum"
        /> -->
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, DefineComponent, computed } from 'vue'
    import { message } from 'ant-design-vue'

    import EnumDetails from './enumDetails.vue'
    import { useAddEnums } from './composables/useModifyEnums'
    import MultiInput from '@/common/input/customizedTagInput.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'AddEnumModal',
        components: { EnumDetails, MultiInput },
        props: {
            isEdit: {
                type: Boolean,
                default: false,
            },
            enum: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['add', 'close'],
        setup(props, context) {
            const enumDetailsComponent = ref<DefineComponent>()
            const errorMessage = ref('')
            const form = ref({
                elementDefs: [],
                category: 'ENUM',
                description: null,
                name: null,
            })

            const { newEnum, addEnum, reset } = useAddEnums()
            const { error: updateError, isReady, state } = addEnum

            const resetError = () => {
                if (errorMessage.value) errorMessage.value = ''
            }

            function handleChange(values: String[]) {
                resetError()
                form.value.elementDefs = values
            }

            function handleOK() {
                resetError()
                const tempForm = { ...form.value }
                tempForm.elementDefs = tempForm.elementDefs.map((x, index) => ({
                    value: x,
                    ordinal: index,
                }))
                newEnum.value = tempForm
                addEnum.execute()
            }

            const isLoading = computed(() => !isReady.value)

            // FIXME: May be simplified
            watch([updateError, isReady], () => {
                if (isReady && state.value.enumDefs.length) {
                    message.success('Option has been created')
                    context.emit('add', state.value.enumDefs[0])
                    context.emit('close')
                    useAddEvent('governance', 'options', 'created', {
                        title: form.value.name,
                    })
                }
                if (updateError.value) {
                    message.error('Failed to create Ooption.')
                    console.error(updateError.value)
                    errorMessage.value =
                        updateError.value?.response?.data?.errorMessage || ''
                    reset()
                }
            })

            return {
                errorMessage,
                handleChange,
                form,
                enumDetailsComponent,
                handleOK,
                updateError,
                isReady,
                state,
                newEnum,
                isLoading,
            }
        },
    })
</script>
