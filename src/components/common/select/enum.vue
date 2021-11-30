<template>
    <a-select
        placeholder="Select"
        v-model:value="localValue"
        class="w-full"
        @change="handleChange"
    >
        <a-select-option
            :value="item.value"
            v-for="item in enumSelected?.elementDefs"
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

            const enumSelected = computed(() => {
                return list.value.find((item) => item.name === props.enum)
            })

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

<style lang="less" module>
    .atlanReverse {
        > span:nth-child(2) {
            @apply w-full pl-0;
        }

        :global(.ant-checkbox) {
            top: 0px !important;
        }
    }
</style>
