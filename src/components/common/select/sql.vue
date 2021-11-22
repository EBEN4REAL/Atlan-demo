<template>
    <a-select
        placeholder="Select"
        v-model:value="localValue"
        class="w-full"
        @change="handleChange"
    >
        <!-- <a-select-option
            :value="item.value"
            v-for="item in enumSelected?.elementDefs"
        >
            {{ item.value }}
        </a-select-option> -->
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, computed } from 'vue'
    import { useVModels } from '@vueuse/core'

    import useSQLTest from '~/composables/package/useSQLTest'

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
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const body = ref({
                className: 'net.snowflake.client.jdbc.SnowflakeDriver',
                connector: 'snowflake',
                query: 'show roles',
                username: 'test',
                password: 'test',
            })

            const {} = useSQLTest(body)

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                localValue,
                handleChange,
                body,
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
