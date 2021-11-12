<template>
    <div class="add-label-modal">
        <a-form layout="vertical" class="relative">
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
                    @change="form.elementDefs = $event"
                />
            </a-form-item>
            <div
                v-if="isLoading"
                class="absolute top-0 flex items-center justify-center w-full h-full bg-white bg-opacity-40"
            >
                <a-spin size="large" />
            </div>
        </a-form>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, DefineComponent, computed } from 'vue'
    import { message } from 'ant-design-vue'

    import { useAddEnums } from '@/admin/enums/composables/useModifyEnums'

    export default defineComponent({
        emits: ['success'],
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

            function handleCreateEnum() {
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

            return {
                form,
                enumDetailsComponent,
                handleCreateEnum,
                updateError,
                isReady,
                state,
                newEnum,
                isLoading,
            }
        },
    })
</script>
