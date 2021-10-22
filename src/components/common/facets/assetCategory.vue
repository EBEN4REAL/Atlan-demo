<template>
    <a-dropdown :trigger="['click']" v-model:visible="dropdownVisible">
        <a-button
            @click.prevent
            class="flex items-center justify-between w-3/12 h-full p-3 bg-gray-100 border-none  category-selector"
            ><span class="text-xs text-gray-700 capitalize truncate">{{
                applied?.length > 0 ? getFiltersAppliedString : 'All'
            }}</span>
            <AtlanIcon
                icon="ChevronDown"
                class="ml-3 text-gray-500 transition-transform duration-300 transform "
        /></a-button>

        <template #overlay>
            <a-checkbox-group
                v-model:value="applied"
                @change="handleChange"
                class="z-10 flex flex-col w-full px-4 pt-4 pb-6 bg-white rounded shadow  gap-y-3"
            >
                <div
                    v-for="item in List"
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
            </a-checkbox-group>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import { List } from '~/constant/assetCategory'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        props: {
            checked: {
                type: Array as PropType<string[]>,
                default: () => [],
            },
        },
        emits: ['change', 'update:checked'],
        setup(props, { emit }) {
            const { checked } = toRefs(props)

            const applied = computed({
                get: () => checked.value,
                set: (val) => emit('update:checked', val),
            })

            const dropdownVisible = ref(false)

            const handleChange = (event: any) => {
                emit('change', event)
                dropdownVisible.value = false

                useAddEvent('discovery', 'facet', 'changed', {
                    filter_type: 'category',
                    count: checked.value?.length,
                })
            }

            const getFiltersAppliedString = computed(() =>
                checked.value.join(', ')
            )

            return {
                applied,
                List,
                handleChange,
                dropdownVisible,
                getFiltersAppliedString,
            }
        },
    })
</script>

<style scoped>
    .category-selector {
        max-width: 150px;
    }
</style>
