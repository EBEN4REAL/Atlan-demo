<template>
    <div class="w-full">
        <div class="w-full mt-1 overflow-y-auto" :style="{ height: height }">
            <a-checkbox-group
                v-model:value="localValue.userTypes"
                class="w-full px-3"
            >
                <div class="flex flex-col w-full">
                    <template v-for="item in userTypeList" :key="item.value">
                        <a-checkbox
                            :value="item.value"
                            class="inline-flex items-center w-full px-1 py-1 hover:bg-primary-light"
                        >
                            <div class="text-sm text-gray">
                                {{ item.displayName }}
                            </div>
                        </a-checkbox>
                    </template>
                </div>
            </a-checkbox-group>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'

    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'UserTypesFilter',
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

            const userTypeList = [
                {
                    displayName: 'User',
                    value: 'user',
                },
                {
                    displayName: 'Atlan BOT',
                    value: 'service-account',
                },
                {
                    displayName: 'API Key',
                    value: 'apikey',
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
                userTypeList,
                localValue,
            }
        },
    })
</script>
