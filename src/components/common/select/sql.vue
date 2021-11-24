<template>
    <a-input-group compact class="flex w-full mb-0">
        <a-select
            style="width: 80%"
            placeholder="Select"
            v-model:value="localValue"
            @change="handleChange"
            class="flex-1"
            :allowClear="true"
        >
            <template #suffixIcon>
                <AtlanIcon icon="Error" v-if="error"></AtlanIcon>
                <AtlanIcon icon="ChevronDown" v-else></AtlanIcon>
            </template>
            <a-select-option :value="item.value" v-for="item in list">
                {{ item.label }}
            </a-select-option>
        </a-select>
        <a-button style="width: 20%" @click="handleClick">
            <a-spin size="small" class="mt-1" v-if="isLoading"></a-spin>
            <AtlanIcon icon="Refresh" v-else></AtlanIcon>
        </a-button>
    </a-input-group>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, computed, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'

    import useSQLTest from '~/composables/package/useSQLTest'
    import AtlanIcon from '../icon/atlanIcon.vue'

    export default defineComponent({
        name: 'testQuery',
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
            body: {
                type: Object,
                required: false,
                default: () => {},
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { body } = toRefs(props)
            const { data, refresh, isLoading, error } = useSQLTest(body.value)
            watch(body, () => {
                console.log('change')
                refresh()
            })
            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }
            const list = ref([])
            watch(data, () => {
                list.value = data.value.results?.map((item) => ({
                    value: item.name,
                    label: item.name,
                }))
            })

            const handleClick = () => {
                refresh()
            }

            return {
                localValue,
                handleChange,
                body,
                list,
                refresh,
                handleClick,
                isLoading,
                error,
            }
        },
        components: { AtlanIcon },
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
