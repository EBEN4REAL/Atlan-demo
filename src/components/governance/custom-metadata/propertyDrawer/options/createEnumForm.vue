<template>
    <div class="add-label-modal">
        <a-form
            ref="formRef"
            layout="vertical"
            class="relative space-y-4"
            :rules="rules"
            :model="form"
        >
            <a-form-item label="Enum name" name="name" class="mb-0">
                <a-input
                    id="name-input"
                    ref="nameRef"
                    v-model:value="form.name"
                    placeholder="Name of the Option"
                ></a-input>
            </a-form-item>

            <a-form-item label="Values" name="elementDefs" class="mb-0">
                <MultiInput
                    ref="valuesRef"
                    placeholder='Enter values separated by a  ";" or "↵"'
                    :value="form.elementDefs"
                    delimiter=";"
                    @change="(v) => (form.elementDefs = v)"
                />
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs, onMounted } from 'vue'
    import { message } from 'ant-design-vue'
    import MultiInput from '@/common/input/customizedTagInput.vue'
    import {
        formRef,
        form,
        error,
        isReady,
        state,
    } from '@/governance/custom-metadata/propertyDrawer/options/useCreateEnum'

    export default defineComponent({
        components: { MultiInput },
        props: { enumSearchValue: { type: String, default: '' } },
        emits: ['success'],
        setup(props, { emit }) {
            const nameRef = ref<any>()
            const valuesRef = ref<any>()

            const { enumSearchValue } = toRefs(props)

            onMounted(() => {
                if (enumSearchValue.value) {
                    form.value.name = enumSearchValue.value
                    valuesRef.value.focus()
                } else {
                    nameRef.value.focus()
                }
            })

            const rules = {
                name: [
                    {
                        required: true,
                        message: 'Please provide Option name',
                        trigger: 'change',
                    },
                ],
                elementDefs: [
                    {
                        type: 'array',
                        required: true,
                        message: 'Please provide Option values',
                        trigger: 'change',
                    },
                ],
            }

            watch([error, isReady], () => {
                if (isReady && state?.value?.enumDefs?.length) {
                    message.success('Option created')
                    emit('success', state.value.enumDefs[0])
                }
                if (error.value) {
                    const errMsg =
                        error.value?.response?.data?.errorMessage || ''
                    message.error({
                        duration: 4,
                        content: errMsg ?? 'Failed to add your Option.',
                    })
                }
            })

            return {
                form,
                formRef,
                rules,
                nameRef,
                valuesRef,
            }
        },
    })
</script>
