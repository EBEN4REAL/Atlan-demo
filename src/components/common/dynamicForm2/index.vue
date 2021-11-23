<template>
    <a-form ref="formRef" :model="formState" :colon="false" type="flex">
        <FormItem :properties="sectionProperty()"></FormItem>
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
            // const configX = computed(() => props.config)
            // // const errorCaptured = ref(null)

            const { modelValue } = useVModels(props, emit)
            const { config, currentStep, removeNesting, baseKey } =
                toRefs(props)

            const localConfig = ref(config.value)

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            const formState = reactive(modelValue.value)

            provide('formState', formState)

            const sectionProperty = () => {
                const list = []

                if (
                    localConfig.value?.properties &&
                    currentStep.value?.properties
                ) {
                    Object.keys(localConfig?.value?.properties).forEach(
                        (key) => {
                            if (currentStep.value?.properties?.includes(key)) {
                                list.push({
                                    id: `${key}`,
                                    name: `${baseKey.value}${key}`,
                                    ...localConfig.value?.properties[key],
                                })
                            }
                        }
                    )
                } else {
                    Object.keys(localConfig?.value?.properties).forEach(
                        (key) => {
                            list.push({
                                id: `${key}`,
                                name: `${baseKey.value}${key}`,
                                ...localConfig.value?.properties[key],
                            })
                        }
                    )
                }
                return list
            }

            const isImplied = () => {
                localConfig.value = props.config
                if (localConfig.value?.anyOf) {
                    localConfig.value.anyOf.forEach((item) => {
                        let loopStop = false
                        Object.keys(item.properties).some((i) => {
                            if (loopStop) {
                                return
                            }
                            if (formState[i] !== item.properties[i]?.const) {
                                loopStop = true
                            }
                        })
                        if (!loopStop) {
                            item.required.forEach((i) => {
                                console.log(i, localConfig.value.properties[i])

                                if (localConfig.value.properties[i]) {
                                    localConfig.value.properties[
                                        i
                                    ].ui.hidden = false
                                }
                            })
                        } else {
                            item.required.forEach((i) => {
                                if (localConfig.value.properties[i]) {
                                    localConfig.value.properties[
                                        i
                                    ].ui.hidden = true
                                }
                            })
                        }
                    })
                }
            }

            onMounted(() => {
                isImplied()
            })

            // const { resetFields, validate, validateInfos, mergeValidateInfo } =
            //     useForm(formState)

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

            watch(formState, () => {
                console.log(formState)
                // isImplied()
                // modelValue.value = formState
                // emit('change')
            })

            onBeforeMount(() => {
                setDefaultValue()
            })

            const setDefaultValue = () => {
                Object.keys(localConfig.value.properties).forEach((key) => {
                    if (modelValue.value) {
                        if (!modelValue.value[key]) {
                            modelValue.value[key] =
                                localConfig.value.properties[
                                    key
                                ]?.default?.toString()
                        }
                    }
                })
            }

            return {
                config,
                sectionProperty,

                formState,
                currentStep,
                isImplied,
                localConfig,
                dirtyTimestamp,
                modelValue,
                setDefaultValue,

                validateForm,
                formRef,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
