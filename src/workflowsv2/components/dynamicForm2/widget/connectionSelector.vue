<template>
    <Connection
        v-bind="componentProps"
        v-model="localValue"
        @change="handleChange"
        :connector="connectorName"
        :isAdmin="true"
    ></Connection>
</template>

<script>
    import { defineComponent, toRefs, computed, ref } from 'vue'

    import { useVModels } from '@vueuse/core'
    import Connection from '@/common/select/connection.vue'

    export default defineComponent({
        name: 'ConnectionSelectorWrapper',
        components: {
            Connection,
        },
        props: {
            property: {
                required: false,
                type: Object,
                default: () => ({}),
            },
            modelValue: {
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { property } = toRefs(props)
            const { modelValue } = useVModels(props, emit)

            const componentProps = computed(() => property.value.ui)

            const localValue = ref(modelValue.value)

            const list = computed(() => {
                const temp = []
                property.value.enum.forEach((item, index) => {
                    temp.push({
                        id: item,
                        label: property.value.enumNames[index] || item,
                    })
                })
                return temp
            })

            const connectorName = computed(() => {
                if (componentProps.value.connectorName) {
                    return componentProps.value.connectorName
                }
                return ''
            })

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change', localValue.value)
            }

            return {
                property,
                componentProps,
                list,
                localValue,
                handleChange,
                connectorName,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
