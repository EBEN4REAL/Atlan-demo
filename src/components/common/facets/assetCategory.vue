<template>
    <a-dropdown :trigger="['click']" v-model:visible="dropdownVisible">
        <a-button
            @click.prevent
            class="flex items-center justify-between w-3/12 h-full p-3 bg-gray-100 border-none  category-selector"
            ><span class="text-xs text-gray-700 truncate">{{
                data.checked?.length > 0 ? getFiltersAppliedString() : 'All'
            }}</span>
            <AtlanIcon
                icon="ChevronDown"
                class="ml-3 text-gray-500 transition-transform duration-300 transform "
        /></a-button>

        <template #overlay>
            <a-checkbox-group
                v-model:value="data.checked"
                @change="handleChange"
                class="z-10 flex flex-col w-full px-4 pt-4 pb-6 bg-white rounded shadow  gap-y-3"
            >
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
            </a-checkbox-group>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import { List } from '~/constant/assetCategory'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        props: {
            data: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const dropdownVisible = ref(false)

            const list = computed(() => List)
            const { data } = toRefs(props)

            const handleChange = () => {
                emit('change', data.value)
                dropdownVisible.value = false
                useAddEvent('discovery', 'facet', 'changed', {
                    filter_type: 'category',
                    count: data.value?.checked?.length,
                })
            }
            function getFiltersAppliedString() {
                let filterData = data.value?.checked || []
                filterData = filterData?.map(
                    (assetCategoryId: string) =>
                        List?.find(
                            (assetCategory: any) =>
                                assetCategory.id === assetCategoryId
                        ).label
                )

                return filterData.join(', ')
            }

            return {
                data,
                list,
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
