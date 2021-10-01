<!-- <template>
    <a-checkbox-group
        :value="filters"
        class="flex flex-col"
        @change="handleDataTypeChange"
    >
        <a-checkbox
            v-for="{ count, label, value } in options"
            :key="label"
            :value="value"
            :disabled="!count"
        >
            <span class="text-sm">{{ label }}</span>
            <span
                v-if="count"
                class="
                    p-0.5
                    pt-1
                    ml-1
                    text-sm
                    rounded
                    bg-primary-light
                    text-primary
                "
                >{{ count }}</span
            >
        </a-checkbox>
    </a-checkbox-group>
</template> -->

<template>
    <div class="flex flex-col py-1 rounded gap-y-3 preference-container">
        <div class="flex items-center justify-between text-gray">
            <span class="mr-6 text-sm text-gray">Order By</span>
            <a-select
                v-model:value="sorting"
                class="text-gray-500"
                style="width: 135px"
                @change="handeChangeSorting"
            >
                <a-select-option value="order">Default</a-select-option>
                <a-select-option value="name">Name</a-select-option>

                <a-select-option value="popularity">Popularity</a-select-option>
            </a-select>
        </div>
        <div class="pt-4">
            <div
                class="flex items-center justify-between mb-3 text-sm text-gray"
            >
                <span>Data type</span>

                <span
                    class="text-gray-500 cursor-pointer hover:text-gray"
                    @click="clearDataTypeFilters"
                    >Clear</span
                >
            </div>
            <div class="flex flex-wrap">
                <div
                    v-for="{ count, label, value } in options"
                    :key="label"
                    :value="value"
                >
                    <div
                        class="px-2 py-1 mb-1 mr-1 border rounded cursor-pointer "
                        :disabled="!count"
                        :class="
                            isDataTypeSelected(value)
                                ? 'bg-primary-light border-white hover:bg-primary-light text-gray'
                                : ' text-gray-500'
                        "
                        @click="() => toggleDataTypeSelect(value)"
                    >
                        <span class="text-sm">{{ label }}</span>
                        <span
                            v-if="count"
                            class="
                                p-0.5
                                pt-1
                                ml-1
                                text-sm
                                rounded
                                bg-primary-light
                                text-primary
                            "
                            >{{ count }}</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed, Ref, ref } from 'vue'
    import { dataTypeList } from '~/constant/datatype'

    export default defineComponent({
        name: 'DataTypeFacet',
        props: {
            dataTypeMap: {
                type: Object as PropType<Record<string, number>>,
                required: false,
            },
        },
        emits: ['dataTypeFilter', 'sort'],
        setup(props, { emit }) {
            const { dataTypeMap } = toRefs(props)
            const dataTypeFilters: Ref<any[]> = ref([])

            const sorting = ref('')

            sorting.value = 'order'
            const handeChangeSorting = () => {
                emit('sort', sorting.value)
            }
            const options = computed(() =>
                dataTypeList.map((dt) => ({
                    label: dt.label,
                    value: dt.id,
                    count: dt.type.reduce(
                        (acc, dtt) => acc + (dataTypeMap.value?.[dtt] || 0),
                        0
                    ),
                }))
            )

            function handleDataTypeChange() {
                emit('dataTypeFilter', dataTypeFilters.value)
            }

            const isDataTypeSelected = (type) =>
                dataTypeFilters.value.includes(type)

            const toggleDataTypeSelect = (type) => {
                if (dataTypeFilters.value.includes(type)) {
                    const index = dataTypeFilters.value.indexOf(type)
                    dataTypeFilters.value.splice(index, 1)
                } else {
                    dataTypeFilters.value.push(type)
                }
                handleDataTypeChange()
            }
            const clearDataTypeFilters = () => {
                dataTypeFilters.value = []
                handleDataTypeChange()
            }

            return {
                options,
                handleDataTypeChange,
                isDataTypeSelected,
                toggleDataTypeSelect,
                clearDataTypeFilters,
                handeChangeSorting,
                sorting,
            }
        },
    })
</script>

<style lang="less" scoped>
    .preference-container {
        width: 240px;
    }
</style>
