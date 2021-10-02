<template>
    <div class="flex flex-col py-1 rounded gap-y-3 preference-container">
        <div class="flex items-center justify-between pb-2 text-gray">
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
        <div class="py-2">
            <div
                class="flex items-center justify-between mb-3 text-sm text-gray"
            >
                <span>Data type</span>

                <div
                    class="text-xs text-gray-500 cursor-pointer  hover:text-primary"
                    @click.stop.prevent="clearDataTypeFilters"
                >
                    Clear
                </div>
            </div>
            <div class="flex flex-wrap">
                <div
                    v-for="{ count, label, value, icon } in options"
                    :key="label"
                    :value="value"
                >
                    <a-button
                        class="flex items-center px-2 py-1 mb-1 mr-1 border rounded cursor-pointer "
                        :disabled="!count"
                        :class="
                            isDataTypeSelected(value)
                                ? 'bg-primary-light border-white hover:bg-primary-light text-gray'
                                : ' text-gray-500'
                        "
                        @click="() => toggleDataTypeSelect(value)"
                    >
                        <component
                            :is="icon"
                            class="w-auto h-4 mr-1 text-gray-500"
                        ></component>
                        <span class="text-sm">{{ label }}</span>
                        <span
                            v-if="count"
                            class="ml-1 text-sm font-bold rounded"
                            :class="
                                isDataTypeSelected(value)
                                    ? 'text-primary'
                                    : ' text-gray'
                            "
                            >{{ count }}</span
                        >
                    </a-button>
                </div>
            </div>
        </div>
        <div class="flex justify-between py-2">
            <div class="w-3/4">
                <a-collapse
                    v-model:activeKey="activeKey"
                    expand-icon-position="right"
                    :bordered="false"
                    class="relative bg-transparent"
                    :class="$style.filter"
                >
                    <template #expandIcon="{ isActive }">
                        <div>
                            <AtlanIcon
                                icon="ChevronDown"
                                class="mb-1 mr-8 transition-transform duration-300 transform  text-gray"
                                :class="isActive ? '-rotate-180' : 'rotate-0'"
                            />
                        </div>
                    </template>
                    <a-collapse-panel key="certification">
                        <template #header>
                            <div class="flex flex-col flex-1">
                                <span class="text-sm uppercase text-gray"
                                    >Certification</span
                                >
                                <div
                                    v-if="activeKey !== 'certification'"
                                    class="mt-1 text-xs text-primary"
                                >
                                    {{ getCertificationsAppliedString() }}
                                </div>
                            </div>
                        </template>
                        <a-checkbox-group
                            v-model:value="certificationFilters"
                            class="w-full px-2 pt-4 pb-0"
                            @change="handeChangeCertification"
                        >
                            <div class="flex flex-col w-full">
                                <template v-for="item in list" :key="item.id">
                                    <div class="mb-3 status">
                                        <a-checkbox
                                            :value="item.id"
                                            class="w-full"
                                        >
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
                    </a-collapse-panel></a-collapse
                >
            </div>
            <div
                v-if="certificationFilters !== []"
                class="text-xs text-gray-500 cursor-pointer hover:text-primary"
                @click.stop.prevent="clearCertificationFilters"
            >
                Clear
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed, Ref, ref } from 'vue'
    import { dataTypeList } from '~/constant/datatype'
    import { List } from '~/constant/status'

    export default defineComponent({
        name: 'DataTypeFacet',
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
            const activeKey = ref('')

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
                    icon: dt.image,
                }))
            )

            function handleDataTypeChange() {
                emit('dataTypeFilter', dataTypeFilters.value)
            }

            const isDataTypeSelected = (type) =>
                dataTypeFilters.value.includes(type)

            const getCertificationsAppliedString = () => {
                const selectedCertifications = certificationFilters.value.map(
                    (statusId: string) =>
                        List?.find((status: any) => status.id === statusId)
                            .label
                )
                if (selectedCertifications.length > 3) {
                    return `${selectedCertifications.slice(0, 3).join(', ')} +${
                        selectedCertifications.length - 3
                    } others`
                }

                return selectedCertifications.slice(0, 3).join(', ')
            }

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
            const clearCertificationFilters = () => {
                certificationFilters.value = []
                handeChangeCertification()
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
                clearCertificationFilters,
                activeKey,
                getCertificationsAppliedString,
            }
        },
    })
</script>

<style lang="less" scoped>
    .preference-container {
        width: 240px;
    }
    .status:last-child {
        margin-bottom: 0 !important;
    }
</style>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-none;
        }

        :global(.ant-collapse-header) {
            @apply px-0 !important;
            @apply py-0 !important;

            @apply border-none;
        }

        :global(.ant-collapse-content-box) {
            @apply p-0 !important;
        }
    }
</style>
