<template>
    <a-select
        placeholder="Groups"
        v-model:value="localValue"
        class="w-full"
        @change="handleChange"
        :showSearch="true"
        mode="multiple"
        @search="handleSearch"
    >
        <a-select-option :value="item.name" v-for="item in list">
            {{ item.alias || item.name }}
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useFacetGroups from '~/composables/group/useFacetGroups'

    export default defineComponent({
        name: 'GroupsSelect',
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            modelValue: {
                type: Array,
                required: false,
                default: () => [],
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const { list, handleSearch, total } = useFacetGroups()

            watch(
                () => props.queryText,
                () => {
                    handleSearch(props.queryText)
                }
            )

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                list,

                handleSearch,
                total,
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
