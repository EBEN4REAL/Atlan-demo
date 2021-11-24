<template>
    <a-form ref="formRef" :model="formState" :colon="false" type="flex">
        <template v-for="property in sectionProperty()" :key="`${property.id}`">
            <Component
                v-model="formState[property?.id]"
                :is="componentName(property)"
                :property="property"
            ></Component>
        </template>
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
        // onErrorCaptured,
        // Suspense,
    } from 'vue'

    import Input from './widget/input.vue'
    import Boolean from './widget/boolean.vue'
    import InputNumber from './widget/inputNumber.vue'
    import Select from './widget/select.vue'
    import Radio from './widget/selectRadio.vue'
    import Credential from './widget/credential.vue'
    import Form from './widget/form.vue'
    import Section from './widget/section.vue'
    import Sql from './widget/sql.vue'
    import Password from './widget/password.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'DynamicForm',
        components: {
            Input,
            InputNumber,
            Boolean,
            Select,
            Credential,
            Radio,
            Form,
            Section,
            Sql,
            Password,
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
                console.log(props.config)
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
                isImplied()
                modelValue.value = formState
                emit('change')
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

            const componentName = (property) => {
                if (!property.ui?.widget) {
                    switch (property.type) {
                        case 'string':
                            return 'Input'
                        case 'number':
                            return 'InputNumber'
                        case 'boolean':
                            return 'Boolean'
                        case 'array':
                            return 'Select'
                        case 'object':
                            return 'Form'
                        default:
                            return 'Input'
                    }
                } else {
                    return property.ui.widget
                }
            }

            const itemClass = (property) => {
                if (componentName(property).toLowerCase() === 'form')
                    return 'mb-0'
                return ''
            }

            return {
                config,
                sectionProperty,
                componentName,
                formState,
                currentStep,
                isImplied,
                localConfig,
                dirtyTimestamp,
                modelValue,
                setDefaultValue,
                itemClass,
                removeNesting,
                validateForm,
                formRef,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
