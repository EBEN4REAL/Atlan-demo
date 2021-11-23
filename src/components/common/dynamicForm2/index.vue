<template>
    <a-form ref="formRef" :model="formState" :colon="false">
        <template v-for="property in sectionProperty()" :key="`${property.id}`">
            <a-form-item
                :label="property.ui?.label"
                v-if="!property.ui?.hidden"
                :class="itemClass(property)"
            >
                <Component
                    v-model="formState[property?.id]"
                    :is="componentName(property)"
                    :property="property"
                ></Component>
            </a-form-item>
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
    import Collapse from './widget/collapse.vue'
    import Sql from './widget/sql.vue'
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
            Collapse,
            Sql,
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
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            // const formRef = ref()
            // const configX = computed(() => props.config)
            // // const errorCaptured = ref(null)

            const { modelValue } = useVModels(props, emit)
            const { config, currentStep } = toRefs(props)

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
                                    id: key,
                                    ...localConfig.value?.properties[key],
                                })
                            }
                        }
                    )
                } else {
                    Object.keys(localConfig?.value?.properties).forEach(
                        (key) => {
                            list.push({
                                id: key,
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
                            if (formState[i] !== item.properties[i].const) {
                                loopStop = true
                            }
                        })
                        if (!loopStop) {
                            item.required.forEach((i) => {
                                localConfig.value.properties[
                                    i
                                ].ui.hidden = false
                            })
                        } else {
                            item.required.forEach((i) => {
                                localConfig.value.properties[i].ui.hidden = true
                            })
                        }
                    })
                }
            }

            watch(formState, () => {
                isImplied()
                modelValue.value = formState.value
                emit('change')
                // dirtyTimestamp.value = `dirty_${Date.now().toString()}`
            })

            onMounted(() => {
                isImplied()
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
                if (
                    componentName(property).toLowerCase() === 'form' ||
                    componentName(property).toLowerCase() === 'credential'
                )
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
            }
        },
    })
</script>

<style lang="scss" scoped></style>
