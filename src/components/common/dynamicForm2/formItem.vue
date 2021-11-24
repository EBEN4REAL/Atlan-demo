<template>
    <Component
        v-for="property in list"
        :key="`${property.id}`"
        :is="componentName(property)"
        v-model="formState[property.id]"
        :property="property"
    ></Component>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        reactive,
        watch,
        inject,
        ref,
        onBeforeMount,
        onMounted,
    } from 'vue'
    import { useVModels } from '@vueuse/core'

    import Input from './widget/input.vue'
    import Boolean from './widget/boolean.vue'
    import InputNumber from './widget/inputNumber.vue'
    import Select from './widget/select.vue'
    import Radio from './widget/selectRadio.vue'
    import Nested from './widget/nested.vue'
    import Credential from './widget/credential.vue'
    // import Form from './widget/form.vue'
    // import Section from './widget/section.vue'
    import Sql from './widget/sql.vue'
    import Password from './widget/password.vue'

    export default defineComponent({
        name: 'DynamicForm',
        components: {
            Credential,
            Input,
            InputNumber,
            Boolean,
            Select,
            Radio,
            Sql,
            Password,
            Nested,
        },
        props: {
            configMap: {
                required: false,
                type: Object,
            },
            currentStep: {
                required: false,
                type: Object,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { configMap, currentStep } = toRefs(props)

            const formState = inject('formState')

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

            const setDefaultValue = () => {
                Object.keys(configMap?.value?.properties).forEach((key) => {
                    if (formState) {
                        if (!formState[key]) {
                            formState[key] =
                                configMap?.value?.properties[
                                    key
                                ]?.default?.toString()
                        }
                    }
                })
            }

            watch(formState, () => {
                calculateList()
            })

            onBeforeMount(() => {
                setDefaultValue()
                calculateList()
            })

            const list = ref([])
            const calculateList = () => {
                isImplied()
                const temp = []
                if (
                    configMap.value?.properties &&
                    currentStep.value?.properties
                ) {
                    Object.keys(configMap?.value?.properties).forEach((key) => {
                        if (currentStep.value?.properties?.includes(key)) {
                            if (!configMap.value?.properties[key].ui?.hidden) {
                                temp.push({
                                    id: `${key}`,
                                    name: `${key}`,
                                    ...configMap.value?.properties[key],
                                })
                            }
                        }
                    })
                } else {
                    Object.keys(configMap?.value?.properties).forEach((key) => {
                        if (!configMap.value?.properties[key]?.ui?.hidden) {
                            temp.push({
                                id: `${key}`,
                                name: `${key}`,
                                ...configMap.value?.properties[key],
                            })
                        }
                    })
                }
                list.value = temp
            }

            const isImplied = () => {
                console.log(configMap.value?.anyOf)
                console.log(formState)
                if (configMap.value?.anyOf) {
                    configMap.value.anyOf.forEach((item) => {
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
                                if (configMap.value.properties[i]) {
                                    configMap.value.properties[
                                        i
                                    ].ui.hidden = false
                                }
                            })
                        } else {
                            item.required.forEach((i) => {
                                if (configMap.value.properties[i]) {
                                    configMap.value.properties[
                                        i
                                    ].ui.hidden = true
                                }
                            })
                        }
                    })
                }
            }

            return {
                componentName,

                formState,
                setDefaultValue,
                configMap,
                calculateList,
                list,
                currentStep,
                isImplied,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
