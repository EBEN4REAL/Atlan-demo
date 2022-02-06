<template>
    <a-input-group compact class="flex w-full mb-0">
        <a-select
            style="width: 80%"
            placeholder="Select"
            v-model:value="localValue"
            @change="handleChange"
            class="flex-1"
            :allowClear="true"
            @dropdownVisibleChange="handleDropdownVisibleChange"
        >
            <template #notFoundContent v-if="isLoading || error">
                <div
                    class="flex items-center justify-center w-full h-10"
                    v-if="isLoading"
                >
                    <a-spin size="small" class="mt-1 mr-2" /> Loading
                </div>
                <div
                    class="flex items-center justify-center w-full h-10 text-red-500"
                    v-if="error"
                >
                    <AtlanIcon icon="Error" class="mr-1"></AtlanIcon> Please
                    check your credential and try again.
                </div>
            </template>
            <template #suffixIcon>
                <AtlanIcon icon="CaretDown" />
            </template>

            <a-select-option :value="item.value" v-for="item in list">
                {{ item.label }}
            </a-select-option>
        </a-select>
        <a-button @click="handleClick" class="px-2">
            <a-spin size="small" class="mt-1" v-if="isLoading"></a-spin>
            <AtlanIcon icon="Retry" class="text-primary" v-else></AtlanIcon>
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

            const handleDropdownVisibleChange = (open) => {
                if (list.value?.length === 0 && open) {
                    refresh()
                }
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
                handleDropdownVisibleChange,
            }
        },
    })
</script>
