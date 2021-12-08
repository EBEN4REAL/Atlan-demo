<template>
    <a-select
        v-model:value="localValue"
        placeholder="Groups"
        class="w-full"
        :show-search="true"
        :mode="multiple ? 'multiple' : null"
        @change="handleChange"
        @search="handleSearch"
    >
        <a-select-option v-for="(item, x) in list" :key="x" :value="item.name">
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
            multiple: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { multiple } = toRefs(props)
            const localValue: any = ref(modelValue.value)

            // // set proper default value
            // if (multiple.value && !localValue.value) localValue.value = []
            // else if (!localValue.value) localValue.value = ''

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
