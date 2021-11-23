<template>
    <Component
        v-for="property in properties"
        :key="`${property.id}`"
        :is="componentName(property)"
        v-model="formState[property.id]"
        :property="property"
    ></Component>
</template>

<script>
    import { defineComponent, toRefs, reactive, watch, inject } from 'vue'
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
            properties: {
                required: false,
                type: Array,
                default() {
                    return []
                },
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            // const { modelValue } = useVModels(props, emit)
            const { properties } = toRefs(props)
            // const localValue = reactive({ ...modelValue.value })

            // watch(localValue, () => {
            //     modelValue.value = localValue
            //     emit('change')
            // })

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

            const isImplied = () => {
                // localConfig.value = props.config
                // if (localConfig.value?.anyOf) {
                //     localConfig.value.anyOf.forEach((item) => {
                //         let loopStop = false
                //         Object.keys(item.properties).some((i) => {
                //             if (loopStop) {
                //                 return
                //             }
                //             if (formState[i] !== item.properties[i]?.const) {
                //                 loopStop = true
                //             }
                //         })
                //         if (!loopStop) {
                //             item.required.forEach((i) => {
                //                 console.log(i, localConfig.value.properties[i])
                //                 if (localConfig.value.properties[i]) {
                //                     localConfig.value.properties[
                //                         i
                //                     ].ui.hidden = false
                //                 }
                //             })
                //         } else {
                //             item.required.forEach((i) => {
                //                 if (localConfig.value.properties[i]) {
                //                     localConfig.value.properties[
                //                         i
                //                     ].ui.hidden = true
                //                 }
                //             })
                //         }
                //     })
                // }
            }

            return {
                componentName,
                properties,
                formState,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
