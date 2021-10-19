<template>
    <div class="pb-6 mt-1">
        <div class="">
            <SearchAndFilter
                v-model:value="classificationSearchText"
                :placeholder="`Search ${classificationsList.length} classifications`"
                :autofocus="true"
                size="minimal"
            >
                <template #filter>
                    <div class="p-0">
                        <div class="flex justify-between mb-2">
                            <p class="mb-0 text-sm text-gray-500">Sort by</p>
                        </div>
                        <CustomRadioButton
                            v-model:data="classificationFilterOptionsData"
                            class="pb-4 border-b"
                            :list="classificationFilterCheckboxes"
                        />
                    </div>
                    <div class="mt-4">
                        <div class="flex justify-between mb-2">
                            <p class="mb-0 text-sm text-gray-500">Operator</p>
                        </div>
                        <CustomRadioButton
                            :data="data.operator"
                            class="pb-4 border-b"
                            :list="operationFilterCheckboxes"
                            @change="handleOperatorChange"
                        />
                    </div>
                    <div class="pb-2 mt-4">
                        <div class="flex justify-between mb-2">
                            <p class="mb-0 text-sm text-gray-500">Added by</p>
                        </div>
                        <a-radio-group
                            :value="data.addedBy"
                            class="rounded"
                            @update:value="handleAddedByChange"
                        >
                            <a-radio-button
                                v-for="filter in addedByFilterCheckboxes"
                                :value="filter.value"
                                >{{ filter.label }}</a-radio-button
                            >
                        </a-radio-group>
                    </div>
                </template>
            </SearchAndFilter>
        </div>

        <div class="mt-4">
            <a-checkbox-group
                v-if="classificationsList.length > 0"
                v-model:value="data.checked"
                class="w-full"
                @change="handleChange"
            >
                <div class="flex flex-col w-full">
                    <div class="h-40 overflow-y-scroll">
                        <template
                            v-for="item in classificationsList"
                            :key="item?.guid + classificationFilterOptionsData"
                        >
                            <a-tooltip
                                placement="top"
                                :mouse-enter-delay="0.5"
                                :title="item?.displayName"
                            >
                                <a-checkbox
                                    v-if="item?.displayName"
                                    :value="item.displayName"
                                    class="w-full mb-3 truncate ..."
                                >
                                    <span class="mb-0">
                                        {{ item?.displayName }}
                                    </span>
                                </a-checkbox>    
                            </a-tooltip>
                            
                        </template>
                    </div>
                </div>
            </a-checkbox-group>
            <p v-else class="py-3 text-center text-gray-500">
                No classifications
            </p>
            <div>
                <a-checkbox
                    :checked="data.noClassificationsAssigned"
                    class="w-full py-3 border-t"
                    @change="noClassificationsToggle"
                >
                    No Classifications assigned
                </a-checkbox>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        toRefs,
        toRaw,
        computed,
    } from 'vue'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { Collapse } from '~/types'
    import { classificationInterface } from '~/types/classifications/classification.interface'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'Classifications',
        components: { CustomRadioButton, SearchAndFilter },
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        emits: ['change', 'update:data'],
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const hideClassifications = ref(true)
            const classificationFilterOptionsData = ref('asc')

            const classificationsStore = useClassificationStore()

            const classificationFilterCheckboxes = [
                {
                    id: 'asc',
                    label: 'A-Z',
                },
                {
                    id: 'dsc',
                    label: 'Z-A',
                },
            ]
            const addedByFilterCheckboxes = [
                {
                    value: 'all',
                    label: 'All',
                },
                {
                    value: 'users',
                    label: 'Users',
                },
                {
                    value: 'propagation',
                    label: 'Propagation',
                },
            ]
            const operationFilterCheckboxes = [
                {
                    id: 'OR',
                    label: 'OR',
                },
                {
                    id: 'AND',
                    label: 'AND',
                },
            ]

            const handleChange = () => {
                useAddEvent('discovery', 'facet', 'changed', {
                    filter_type: 'classifications',
                    count: data.value?.checked?.length,
                })

                emit('change')
            }

            const handleAddedByChange = (val: string) => {
                emit('update:data', {
                    ...data.value,
                    addedBy: val,
                })

                // if there are no classifications selected, do not trigger the API call
                if (!data?.value?.checked?.length) return
                handleChange()
            }

            const handleOperatorChange = (val: string) => {
                emit('update:data', {
                    ...data.value,
                    operator: val,
                })
                // if there are no classifications selected, do not trigger the API call
                if (!data?.value?.checked?.length) return
                handleChange()
            }

            const noClassificationsToggle = () => {
                emit('update:data', {
                    ...data.value,
                    noClassificationsAssigned:
                        !data.value.noClassificationsAssigned,
                })
                emit('change')
            }
            const sortClassificationsByOrder = (
                sortingOrder: string | null,
                data: any
            ) => {
                console.log(toRaw(data), 'hello')
                let classifications = []
                switch (sortingOrder) {
                    case 'asc': {
                        classifications = toRaw(data).sort(
                            (
                                classificationA: classificationInterface,
                                classificationB: classificationInterface
                            ) => {
                                const a =
                                    classificationA.displayName.toLowerCase()
                                const b =
                                    classificationB.displayName.toLowerCase()
                                if (a < b) {
                                    return -1
                                }
                                if (a > b) {
                                    return 1
                                }
                                return 0
                            }
                        )
                        break
                    }
                    case 'dsc': {
                        classifications = toRaw(data).sort(
                            (
                                classificationA: classificationInterface,
                                classificationB: classificationInterface
                            ) => {
                                const a =
                                    classificationA.displayName.toLowerCase()
                                const b =
                                    classificationB.displayName.toLowerCase()
                                if (a < b) {
                                    return 1
                                }
                                if (a > b) {
                                    return -1
                                }
                                return 0
                            }
                        )
                        break
                    }
                    default: {
                        break
                    }
                }
                console.log('classifications', classifications)
                return classifications
            }

            // Main Classification list - Source of truth
            const classifications = computed(
                () => classificationsStore.classifications
            )

            // classification Search
            const classificationSearchText = ref('')

            const classificationsList = computed(() => {
                const sortedClassifications: classificationInterface[] =
                    sortClassificationsByOrder(
                        classificationFilterOptionsData.value,
                        classifications.value
                    )

                if (classificationSearchText.value) {
                    return sortedClassifications.filter((clsf) =>
                        clsf.displayName
                            .toLowerCase()
                            .includes(
                                classificationSearchText.value.toLowerCase()
                            )
                    )
                } else return sortedClassifications
            })

            // will be called from parent to clear the filter
            const clear = () => {
                data.value.checked = []
                handleChange()
            }

            return {
                data,
                clear,
                classificationsList,
                classificationSearchText,
                handleOperatorChange,
                handleChange,
                noClassificationsToggle,
                hideClassifications,
                classificationFilterCheckboxes,
                classificationFilterOptionsData,
                operationFilterCheckboxes,
                addedByFilterCheckboxes,
                handleAddedByChange,
            }
        },
        mounted() {},
    })
</script>
