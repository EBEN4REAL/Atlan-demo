<template>
    <a-dropdown :trigger="['click']">
        <a-button @click.prevent>
            All
            <AtlanIcon
                icon="ChevronDown"
                class="ml-3 text-gray-500 transition-transform duration-300 transform "
        /></a-button>

        <template #overlay>
            <a-checkbox-group
                v-model:value="data.checked"
                class="w-full py-1 pb-6"
                @change="handleChange"
            >
                <div class="flex flex-col w-full gap-y-3">
                    <div
                        v-for="item in list"
                        :key="item.id"
                        class="flex items-center justify-between"
                    >
                        <a-checkbox :value="item.id"
                            ><span class="mb-0 ml-1 text-gray">
                                {{ item.label }}
                            </span>
                        </a-checkbox>

                        <a-tooltip placement="right" color="white">
                            <AtlanIcon
                                icon="Overview"
                                class="opacity-50 hover:opacity-100"
                            />
                            <template #title>
                                <span class="text-gray-500">
                                    {{ item.popoverText }}
                                </span>
                            </template>
                        </a-tooltip>
                    </div>
                </div>
            </a-checkbox-group>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import { List } from '~/constant/assetCategory'
    import { Collapse } from '~/types'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        props: {
            data: {
                type: Object,
                required: true,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const list = computed(() => List)
            const { data } = toRefs(props)
            const handleChange = () => {
                emit('change')
                useAddEvent('discovery', 'facet', 'changed', {
                    filter_type: 'category',
                    count: data.value?.checked?.length,
                })
            }
            return {
                data,
                list,
                handleChange,
            }
        },
    })
</script>

<style scoped>
    :global(.ant-tooltip-arrow) {
        display: none;
    }
</style>
