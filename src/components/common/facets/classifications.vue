<template>
    <div class="px-4 mt-1">
        <div class="">
            <SearchAndFilter
                v-model:value="classificationSearchText"
                :placeholder="`Search ${classificationsList.length} classifications`"
                :autofocus="true"
                @change="handleClassificationsSearch"
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
                            v-model:data="data.operator"
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
                            v-model:value="data.addedBy"
                            class="rounded"
                            @change="handleAddedByChange"
                        >
                            <a-radio-button value="all">All</a-radio-button>
                            <a-radio-button value="user">User</a-radio-button>
                            <a-radio-button value="propagation"
                                >Propagation</a-radio-button
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
                    <div
                        v-if="classificationSearchText === ''"
                        ref="classificationsScrollContainer"
                        class="h-40 overflow-y-scroll"
                    >
                        <template
                            v-for="item in classificationsList"
                            :key="item?.guid + classificationFilterOptionsData"
                        >
                            <a-checkbox
                                v-if="item?.displayName"
                                :value="item.name"
                                class="w-full mb-3"
                            >
                                <span class="mb-0 truncated">
                                    {{ item?.displayName }}
                                </span>
                            </a-checkbox>
                        </template>
                    </div>
                    <div
                        v-else
                        ref="classificationsScrollContainer"
                        class="overflow-y-scroll h-36"
                    >
                        <template
                            v-for="item in filteredClassificationList"
                            :key="item?.guid + classificationFilterOptionsData"
                        >
                            <a-checkbox
                                v-if="item?.displayName"
                                :value="item.guid"
                                class="w-full mb-3"
                            >
                                <span class="mb-0 ml-1 text-gray-500 truncated">
                                    {{ item?.displayName }}
                                </span>
                            </a-checkbox>
                        </template>
                    </div>
                </div>
            </a-checkbox-group>
            <p v-else class="text-center text-gray-300">No Classifications</p>
            <div>
                <a-checkbox
                    v-model:checked="data.noClassificationsAssigned"
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
import { defineComponent, PropType, ref, toRefs, toRaw, watchEffect } from 'vue'
import CustomRadioButton from '@common/radio/customRadioButton.vue'
import SearchAndFilter from '@/common/input/searchAndFilter.vue'
import { Collapse } from '~/types'
import { Components } from '~/api/atlas/client'
import { classificationInterface } from '~/types/classifications/classification.interface'

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
    emits: ['change'],
    setup(props, { emit }) {
        const classificationsList = ref([])
        const filteredClassificationList = ref([])
        const { data } = toRefs(props)
        const hideClassifications = ref(true)
        const noClassificationsAssigned = ref(false)
        const classificationFilterOptionsData = ref('asc')
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
        const addedByFilterOptionsData = ref('all')
        const addedByFilterCheckboxes = [
            {
                id: 'users',
                label: 'Users',
            },
            {
                id: 'propagation',
                label: 'Propagation',
            },
        ]
        const operationFilterOptionsData = ref('OR')
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
            const criterion: Components.Schemas.FilterCriteria[] = []
            // make no classifications unchecked
            data.value.noClassificationsAssigned = false
            // eslint-disable-next-line default-case
            switch (data.value.addedBy) {
                case 'all': {
                    // Case `all` will always be a OR bw __classificationNames and __propagatedClassificationNames
                    data.value.checked.forEach((val) => {
                        const subFilter: Components.Schemas.FilterCriteria = {
                            condition: 'OR',
                            criterion:
                                [] as Components.Schemas.FilterCriteria[],
                        }
                        const subFilterCriterion: Components.Schemas.FilterCriteria[] =
                            []
                        subFilterCriterion.push({
                            attributeName: '__classificationNames',
                            attributeValue: val,
                            operator: 'eq',
                        })
                        subFilterCriterion.push({
                            attributeName: '__propagatedClassificationNames',
                            attributeValue: val,
                            operator: 'eq',
                        })
                        subFilter.criterion = subFilterCriterion
                        criterion.push(subFilter)
                    })
                    break
                }
                case 'user': {
                    data.value.checked.forEach((val) => {
                        criterion.push({
                            attributeName: '__classificationNames',
                            attributeValue: val,
                            operator: 'eq',
                        })
                    })
                    break
                }
                case 'propagation': {
                    data.value.checked.forEach((val) => {
                        criterion.push({
                            attributeName: '__propagatedClassificationNames',
                            attributeValue: val,
                            operator: 'eq',
                        })
                    })
                    break
                }
            }
            emit('change', {
                id: props.item.id,
                payload: {
                    condition: data.value.operator,
                    criterion,
                } as Components.Schemas.FilterCriteria,
            })
        }
        const handleAddedByChange = () => {
            // if there are no classifications selected, do not trigger the API call
            if (!data?.value?.checked?.length) return
            handleChange()
        }
        const handleOperatorChange = () => {
            // if there are no classifications selected, do not trigger the API call
            if (!data?.value?.checked?.length) return
            handleChange()
        }
        const noClassificationsToggle = () => {
            let criterion: Components.Schemas.FilterCriteria[] = []

            if (data.value.noClassificationsAssigned) {
                data.value.checked = []
                criterion.push({
                    attributeName: '__classificationNames',
                    attributeValue: '-',
                    operator: 'is_null',
                })
                criterion.push({
                    attributeName: '__propagatedClassificationNames',
                    attributeValue: '-',
                    operator: 'is_null',
                })
            } else {
                data.value.checked = []
                criterion = []
            }
            console.log(props.item.id, 'idd')
            emit('change', {
                id: props.item.id,
                payload: {
                    condition: data.value.operator,
                    criterion,
                } as Components.Schemas.FilterCriteria,
            })
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
                            const a = classificationA.displayName.toLowerCase()
                            const b = classificationB.displayName.toLowerCase()
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
                            const a = classificationA.displayName.toLowerCase()
                            const b = classificationB.displayName.toLowerCase()
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

        watchEffect(() => {
            classificationsList.value = sortClassificationsByOrder(
                classificationFilterOptionsData.value,
                props.data.classifications
            )
            if (filteredClassificationList.value.length > 0) {
                filteredClassificationList.value = sortClassificationsByOrder(
                    classificationFilterOptionsData.value,
                    filteredClassificationList.value
                )
            }
        })

        // will be called from parent to clear the filter
        const clear = () => {
            data.value.checked = []
            handleChange()
        }

        // classification Search
        const classificationSearchText = ref('')
        const handleClassificationsSearch = (e: any) => {
            const searchText = e.target.value
            filteredClassificationList.value = classificationsList.value.filter(
                (classification: classificationInterface) =>
                    classification.displayName
                        .toLowerCase()
                        .includes(searchText)
            )
        }

        const clearSearchText = () => {
            classificationSearchText.value = ''
        }

        const showScrollBar = (el) => {
            el.value.scrollTop = 1
            el.value.scrollTop = 0
        }

        const toggleClassifications = () => {
            hideClassifications.value = !hideClassifications.value
            if (hideClassifications.value) {
                showScrollBar(classificationsScrollContainer)
            } else {
                showScrollBar(classificationsScrollContainer)
            }
        }

        const classificationsScrollContainer = ref(null)

        const handleClassificationFilterChange = (e: Event) => {
            const filterValue = e.target.value
        }

        return {
            data,
            clear,
            filteredClassificationList,
            classificationsList,
            classificationSearchText,
            clearSearchText,
            handleOperatorChange,
            handleChange,
            noClassificationsAssigned,
            noClassificationsToggle,
            handleClassificationsSearch,
            hideClassifications,
            classificationFilterCheckboxes,
            classificationFilterOptionsData,
            toggleClassifications,
            classificationsScrollContainer,
            handleClassificationFilterChange,
            operationFilterOptionsData,
            operationFilterCheckboxes,
            addedByFilterOptionsData,
            addedByFilterCheckboxes,
            handleAddedByChange,
        }
    },
    mounted() {},
})
</script>

<style lang="less" module>
.badge {
    :global(.ant-badge-dot) {
        @apply bg-primary !important;
    }
    :global(.ant-badge-count) {
        @apply top-3 right-2 !important;
    }
}
</style>
<style lang="less" scoped>
.radio-btn:last-child {
    @apply ml-2 !important;
}
</style>
