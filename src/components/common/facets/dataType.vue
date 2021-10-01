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
                <a-select-option value="default">Default</a-select-option>
                <a-select-option value="Asset.name.keyword|ascending"
                    >Name</a-select-option
                >

                <a-select-option value="Catalog.popularityScore|descending"
                    >Most Popular</a-select-option
                >
                <a-select-option value="Catalog.popularityScore|ascending"
                    >Least popular</a-select-option
                >
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
        <div class="pt-4">
            <p class="mb-3 text-sm text-gray">Certification</p>
            <div class="">
                <a-checkbox-group
                    v-model:value="certificationFilters"
                    class="w-full px-4 py-1 pb-3"
                    @change="handeChangeCertification"
                >
                    <div class="flex flex-col w-full">
                        <template v-for="item in list" :key="item.id">
                            <div class="mb-3 status">
                                <a-checkbox :value="item.id" class="w-full">
                                    <component
                                        :is="item.icon"
                                        class="inline-flex self-center w-auto h-4 mb-1 "
                                    />
                                    <span class="mb-0 ml-1 text-gray">
                                        {{ item.label }}
                                    </span>
                                </a-checkbox>
                            </div>
                        </template>
                    </div>
                </a-checkbox-group>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed, Ref, ref } from 'vue'
    import { dataTypeList } from '~/constant/datatype'
    import Status from '@/common/facets/status.vue'
    import { List } from '~/constant/status'

    export default defineComponent({
        name: 'DataTypeFacet',
        components: { Status },
        props: {
            dataTypeMap: {
                type: Object as PropType<Record<string, number>>,
                required: false,
            },
        },
        emits: ['dataTypeFilter', 'sort', 'certification'],
        setup(props, { emit }) {
            const { dataTypeMap } = toRefs(props)
            const dataTypeFilters: Ref<any[]> = ref([])
            const sorting = ref('')
            const certificationFilters: Ref<any[]> = ref([])

            sorting.value = 'default'

            const list = computed(() => List)

            const handeChangeSorting = () => {
                emit('sort', sorting.value)
            }
            const handeChangeCertification = () => {
                emit('certification', certificationFilters.value)
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
                list,
                sorting,
                handeChangeCertification,
                certificationFilters,
            }
        },
    })
</script>

<style lang="less" scoped>
    .preference-container {
        width: 240px;
    }
</style>
