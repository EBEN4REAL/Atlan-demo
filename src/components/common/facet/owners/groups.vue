<template>
    <div class="w-full overflow-y-auto h-44">
        <div
            v-if="list.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <span class="text-gray-500">No groups found</span>
            </div>
        </div>
        <div class="flex flex-col w-full">
            <a-checkbox-group
                class="w-full px-4"
                v-model:value="localValue"
                @change="handleChange"
            >
                <template v-for="item in list" :key="item.name">
                    <a-checkbox
                        :value="item.name"
                        :class="$style.atlanReverse"
                        class="inline-flex flex-row-reverse items-center w-full px-1 py-1 rounded  hover:bg-primary-light"
                    >
                        <div class="flex items-center">
                            <div class="flex flex-col">
                                <div
                                    class="mb-1 text-sm leading-none capitalize  text-gray"
                                >
                                    {{ item.alias || item.name }}
                                </div>
                            </div>
                        </div>
                    </a-checkbox>
                </template>
            </a-checkbox-group>
        </div>
        <p class="px-4 mt-1 text-xs text-gray-500">
            showing {{ list.length }} of {{ total }} groups
        </p>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, computed, watch } from 'vue'

    import { useVModels } from '@vueuse/core'
    import useFacetGroups from '~/composables/group/useFacetGroups'

    export default defineComponent({
        name: 'OwnersFilter',

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
            cacheKey: {
                type: String,
                required: false,
                default: () => 'DEFAULT_USERS',
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = computed(() => modelValue.value)

            const { list, handleSearch, total, filterTotal } = useFacetGroups()

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
            return { list, handleChange, localValue, total, filterTotal }
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
