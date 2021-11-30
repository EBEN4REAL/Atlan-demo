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
                <AtlanIcon
                    icon="Error"
                    v-if="error"
                    style="height: 12px"
                ></AtlanIcon>
                <AtlanIcon icon="Chevron" v-else></AtlanIcon>
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

    import { useQueryCredential } from '~/composables/credential/useQueryCredential'
    import AtlanIcon from '../icon/atlanIcon.vue'

    export default defineComponent({
        name: 'testQuery',
        props: {
            modelValue: {
                type: [Array, String],
                required: false,
            },
            query: {
                type: String,
                required: false,
                default: () => '',
            },
            credential: {
                type: Object,
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { credential, query } = toRefs(props)

            const body = computed(() => {
                return {
                    ...credential.value,
                    query: query.value,
                }
            })
            const { data, refresh, isLoading, error } = useQueryCredential(body)

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
                credential,
                list,
                refresh,
                handleClick,
                isLoading,
                error,
                query,
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
