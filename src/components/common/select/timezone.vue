<template>
    <a-select
        placeholder="Select"
        v-model:value="localValue"
        class="w-full"
        @change="handleChange"
        @dropdownVisibleChange="dropdownVisibleChange"
        :allowClear="allowClear"
        :showSearch="true"
    >
        <template #suffixIcon>
            <AtlanIcon
                :icon="!dropdownOpen ? 'ChevronDown' : 'ChevronUp'"
                class="w-4 h-4 text-gray-500"
                style="min-width: 16px"
            />
        </template>
        <a-select-option
            v-for="item in list"
            :value="item.value"
            :key="item.value"
        >
            {{ item.label }}
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, computed, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'

    import { timezones } from '~/constant/timezone'

    export default defineComponent({
        name: 'Timezone Select',
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            modelValue: {
                type: [Array, String],
                required: false,
            },
            allowClear: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const dropdownOpen = ref(false)

            const list = ref(
                timezones.sort(function (a, b) {
                    var re = /^.*\(GMT ([+-]\d{1,2}):(\d{1,2})\).*$/m
                    var aOffset = parseFloat(a.label.replace(re, '$1.$2'))
                    var bOffset = parseFloat(b.label.replace(re, '$1.$2'))
                    return aOffset < bOffset ? -1 : aOffset > bOffset ? 1 : 0
                })
            )
            const _index = list.value.findIndex(
                (item) => item.value === localValue.value
            )
            const t = list.value[_index]
            list.value.splice(_index, 1)
            list.value.unshift(t)

            const handleChange = () => {
                modelValue.value = localValue.value
                const _index = list.value.findIndex(
                    (item) => item.value === localValue.value
                )
                const t = list.value[_index]
                list.value.splice(_index, 1)
                list.value.unshift(t)
                emit('change')
            }
            const dropdownVisibleChange = (open: boolean) => {
                dropdownOpen.value = open
            }

            return {
                list,
                localValue,
                dropdownOpen,
                handleChange,
                dropdownVisibleChange,
            }
        },
    })
</script>
