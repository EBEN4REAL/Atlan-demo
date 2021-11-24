<template>
    <a-form ref="formRef" :model="formState" :colon="false" type="flex">
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
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const formRef = ref()

            const { modelValue } = useVModels(props, emit)
            const { config, currentStep, baseKey } = toRefs(props)

            const localConfig = ref(config.value)

            const formState = reactive(modelValue.value)
            provide('formState', formState)

            const validateForm = () => {
                if (formRef.value) {
                    console.log('validate', formState)
                    formRef.value
                        .validate()
                        .then(() => {
                            console.log('values', formState, toRaw(formState))
                        })
                        .catch((error) => {
                            console.log('error', formState, error)
                        })
                }
            }

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
            }
        },
    })
</script>

<style lang="scss" scoped></style>
