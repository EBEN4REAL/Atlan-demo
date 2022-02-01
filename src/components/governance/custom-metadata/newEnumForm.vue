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
                    ref="nameRef"
                    v-model:value="form.name"
                    placeholder="Name the label"
                ></a-input>
            </a-form-item>

            <a-form-item label="Values" name="elementDefs">
                <MultiInput
                    ref="valuesRef"
                    placeholder='Enter values separated by a  ";" or "↵"'
                    :value="form.elementDefs"
                    delimiter=";"
                    @change="handleChange"
                />
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        DefineComponent,
        computed,
        toRefs,
        onMounted,
    } from 'vue'
    import { message } from 'ant-design-vue'

    import { useAddEnums } from '@/governance/enums/composables/useModifyEnums'
    import MultiInput from '@/common/input/customizedTagInput.vue'

    export default defineComponent({
        components: { MultiInput },
        props: { enumSearchValue: { type: String, default: '' } },
        emits: ['success', 'changedLoading'],
        setup(props, { emit }) {
            const enumDetailsComponent = ref<DefineComponent>()
            const formRef = ref(null)
            const nameRef = ref(null)
            const valuesRef = ref(null)
            const initializeForm = () => ({
                elementDefs: [],
                category: 'ENUM',
                description: null,
                name: null,
            })
            const form = ref(initializeForm())
            // set form name if enumSearchValue
            const { enumSearchValue } = toRefs(props)

            onMounted(() => {
                if (enumSearchValue.value) {
                    form.value.name = enumSearchValue.value
                    valuesRef.value.focus()
                } else {
                    nameRef.value.focus()
                }
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

            watch(isLoading, (n) => {
                emit('changedLoading', n)
            })

            // FIXME: May be simplified
            watch([updateError, isReady], () => {
                if (isReady && state.value.enumDefs.length) {
                    message.success('Enumeration added.')
                    emit('success', state.value.enumDefs[0])
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
            function handleChange(values: String[]) {
                form.value.elementDefs = values
            }

            return {
                handleChange,
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
                nameRef,
                valuesRef,
            }
        },
    })
</script>
