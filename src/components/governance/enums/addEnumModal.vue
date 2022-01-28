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
            <div class="mb-2 font-bold text-gray-700">New Enum</div>
            <a-form layout="vertical">
                <a-form-item label="Name">
                    <a-input
                        id="name-input"
                        v-model:value="form.name"
                        placeholder="Name the label"
                    ></a-input>
                </a-form-item>

                <a-form-item label="Values">
                    <a-select
                        mode="tags"
                        placeholder="Enter enum values"
                        :value="form.elementDefs"
                        :open="false"
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

    export default defineComponent({
        name: 'AddEnumModal',
        components: { EnumDetails },
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
            const form = ref({
                elementDefs: [],
                category: 'ENUM',
                description: null,
                name: null,
            })

            const { newEnum, addEnum, reset } = useAddEnums()
            const { error: updateError, isReady, state } = addEnum

            function handleChange(values: String[]) {
                const finalValue = values.reduce((acc, cur) => {
                    acc.push(...cur.split(','))
                    return acc
                }, [])

                form.value.elementDefs = finalValue
            }

            function handleOK() {
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
                    message.success('Enumeration added.')
                    context.emit('add', state.value.enumDefs[0])
                    context.emit('close')
                }
                if (updateError.value) {
                    message.error('Failed to add your enum.')
                    console.error(updateError.value)
                    reset()
                }
            })

            return {
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
