<template>
    <a-select
        v-model:value="localValue"
        placeholder="Select"
        class="w-full"
        :mode="multiple ? 'multiple' : null"
        @change="handleChange"
    >
        <a-select-option
            v-for="(item, x) in enumSelected?.elementDefs"
            :key="x"
            :value="item.value"
        >
            {{ item.value }}
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, computed } from 'vue'
    import { useVModels } from '@vueuse/core'

    import useTypedefData from '~/composables/typedefs/useTypedefData'

    export default defineComponent({
        name: 'EnumSelect',
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            enum: {
                type: String,
                required: false,
                default: () => '',
            },
            multiple: {
                type: Boolean,
                required: false,
                default: false,
            },
            modelValue: {
                type: [Array, String],
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const { enumList: list } = useTypedefData()

            const enumSelected = computed(() =>
                list.value.find((item) => item.name === props.enum)
            )

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                list,
                enumSelected,
                localValue,
                handleChange,
            }
        },
    })
</script>

