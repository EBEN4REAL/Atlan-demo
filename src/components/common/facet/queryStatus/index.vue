<template>
    <div class="w-full">
        <div class="w-full mt-1 overflow-y-auto" :style="{ height: height }">
            <a-checkbox-group
                v-model:value="localValue.status"
                class="w-full px-3"
            >
                <div class="flex flex-col w-full">
                    <template v-for="item in statusList" :key="item.value">
                        <div class="status">
                            <a-checkbox
                                :value="item.value"
                                class="flex flex-row-reverse items-center justify-between w-full px-1 rounded atlanReverse hover:bg-primary-light"
                            >
                                <div class="flex items-center px-0">
                                    <div
                                        class="w-2 h-2 mr-3 rounded-full"
                                        :class="`bg-${item.colorClass}`"
                                    ></div>
                                    <div class="mb-0 ml-1 text-gray">
                                        {{ item.displayName }}
                                    </div>
                                </div>
                            </a-checkbox>
                        </div>
                    </template>
                </div>
            </a-checkbox-group>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, toRefs, watch } from 'vue'

import { useVModels } from '@vueuse/core'

export default defineComponent({
    name: 'QueryStatusFacet',
    props: {
        modelValue: {
            type: Object,
            required: false,
            default() {
                return {}
            },
        },
    },
    emits: ['change', 'update:modelValue'],
    setup(props, { emit }) {
        const { modelValue } = useVModels(props, emit)
        const localValue = ref(modelValue.value)

        const statusList = [
            {
                displayName: 'Success',
                colorClass: 'green-500',
                value: 'success',
            },
            {
                displayName: 'Failed',
                colorClass: 'red-500',
                value: 'error',
            },
            {
                displayName: 'Aborted',
                colorClass: 'yellow-500',
                value: 'abort',
            },
        ]

        watch(localValue.value, () => {
            if (
                !localValue.value.status ||
                localValue.value.status?.length === 0
            ) {
                delete localValue.value.status
            }
            modelValue.value = localValue.value
            emit('change')
        })

        return {
            statusList,
            localValue,
        }
    },
})
</script>
