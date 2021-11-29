<template>
    <a-form
        ref="formRef"
        :model="formState"
        :colon="false"
        layout="vertical"
        :scrollToFirstError="true"
    >
        <FormItem
            :configMap="localConfig"
            :currentStep="currentStep"
        ></FormItem>
    </a-form>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        reactive,
        onMounted,
        watch,
        ref,
        onBeforeMount,
        toRaw,
        provide,
        // onErrorCaptured,
        // Suspense,
    } from 'vue'

    import { useVModels } from '@vueuse/core'

    import FormItem from './formItem.vue'

    export default defineComponent({
        name: 'DynamicForm',
        components: {
            FormItem,
            // Suspense,
        },
        props: {
            config: {
                required: false,
                type: Object,
                default: () => {},
            },
            modelValue: {
                required: false,
                type: Object,
                default: () => {},
            },
            currentStep: {
                required: false,
                type: Object,
                default: () => {},
            },
            removeNesting: {
                required: false,
                type: Boolean,
            },
            baseKey: {
                required: false,
                type: String,
                default() {
                    return ''
                },
            },
            workflowTemplate: {
                required: false,
                type: Object,
                default: () => {},
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const formRef = ref()

            const { modelValue } = useVModels(props, emit)
            const { config, currentStep, baseKey, workflowTemplate } =
                toRefs(props)

            const localConfig = ref(config.value)

            const formState = reactive(modelValue.value)

            const validateForm = async () => {
                if (formRef.value) {
                    try {
                        await formRef.value.validate()
                        return
                    } catch (e) {
                        console.log('error')
                        return e
                    }
                }
                return {
                    message: 'Form is not ready',
                }
            }

            provide('formState', formState)
            provide('validateForm', validateForm)
            provide('workflowTemplate', workflowTemplate)

            // watch(formState, () => {
            //     // console.log(formState)
            //     // // isImplied()
            //     // // modelValue.value = formState
            //     // // emit('change')
            // })

            return {
                config,

                formState,
                currentStep,

                localConfig,

                modelValue,

                validateForm,
                formRef,
                workflowTemplate,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
