<template>
    <div class="add-label-modal">
        <a-form
            ref="formRef"
            layout="vertical"
            class="relative"
            :rules="rules"
            :model="form"
        >
            <a-form-item label="Enum name" name="name">
                <a-input
                    id="name-input"
                    v-model:value="form.name"
                    placeholder="Name the label"
                ></a-input>
            </a-form-item>

            <a-form-item label="Values" name="elementDefs">
                <a-select
                    mode="tags"
                    placeholder="Enter enum values"
                    :value="form.elementDefs"
                    :open="false"
                    @change="form.elementDefs = $event"
                />
            </a-form-item>
            <div
                v-if="isLoading"
                class="absolute top-0 flex items-center justify-center w-full h-full bg-white  bg-opacity-40"
            >
                <a-spin size="large" />
            </div>
        </a-form>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, DefineComponent, computed } from 'vue'
    import { message } from 'ant-design-vue'

    import { useAddEnums } from '@/governance/enums/composables/useModifyEnums'

    export default defineComponent({
        emits: ['success'],
        setup(props, context) {
            const enumDetailsComponent = ref<DefineComponent>()
            const formRef = ref(null)
            const form = ref({
                elementDefs: [],
                category: 'ENUM',
                description: null,
                name: null,
            })

            const { newEnum, addEnum, reset } = useAddEnums()
            const { error: updateError, isReady, state } = addEnum

            async function handleCreateEnum() {
                await formRef.value?.validate()
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
                    context.emit('success', state.value.enumDefs[0])
                }
                if (updateError.value) {
                    message.error('Failed to add your enum.')
                    reset()
                }
            })

            const rules = {
                name: [
                    {
                        required: true,
                        message: 'Please provide enum name',
                        trigger: 'change',
                    },
                ],
                elementDefs: [
                    {
                        type: 'array',
                        required: true,
                        message: 'Please provide enum values',
                        trigger: 'change',
                    },
                ],
            }

            return {
                form,
                enumDetailsComponent,
                handleCreateEnum,
                updateError,
                isReady,
                state,
                newEnum,
                isLoading,
                rules,
                formRef,
            }
        },
    })
</script>
