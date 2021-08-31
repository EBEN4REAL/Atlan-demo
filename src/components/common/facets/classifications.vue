<template>
    <div class="px-4">
        <div class="flex">
            <a-input
                ref="searchText"
                v-model:value="classificationSearchText"
                type="text"
                class="bg-white rounded shadow-none form-control border-right-0"
                :placeholder="`Search ${classificationsList.length} classifications`"
                @change="handleClassificationsSearch"
            >
                <template #prefix>
                    <fa icon="fal search" class="ml-2 mr-1 text-gray-500" />
                </template>
                <template #suffix>
                    <fa
                        v-if="classificationSearchText"
                        icon="fal times-circle"
                        class="ml-2 mr-1 text-red-600"
                        @click="clearSearchText"
                    />
                </template>
            </a-input>
            <a-popover trigger="click" placement="rightTop">
                <template #content class="rounded">
                    <div class="p-0">
                        <div class="flex justify-between mb-2">
                            <p class="mb-0 text-sm text-gray-500">Sort by</p>
                        </div>
                        <CustomRadioButton
                            class="pb-4 border-b"
                            :list="classificationFilterCheckboxes"
                            v-model:data="classificationFilterOptionsData"
                        />
                    </div>
                    <div class="mt-4">
                        <div class="flex justify-between mb-2">
                            <p class="mb-0 text-sm text-gray-500">Operator</p>
                        </div>
                        <CustomRadioButton
                            class="pb-4 border-b"
                            :list="operationFilterCheckboxes"
                            @change="handleChange"
                            v-model:data="operationFilterOptionsData"
                        />
                    </div>
                    <div class="pb-2 mt-4">
                        <div class="flex justify-between mb-2">
                            <p class="mb-0 text-sm text-gray-500">Added by</p>
                        </div>
                        <a-radio-group
                            v-model:value="addedByFilterOptionsData"
                            @change="handleChange"
                            class="rounded"
                        >
                            <a-radio-button value="all">All</a-radio-button>
                            <a-radio-button value="user">User</a-radio-button>
                            <a-radio-button value="propagation"
                                >Propagation</a-radio-button
                            >
                        </a-radio-group>
                    </div>
                </template>
                <div
                    v-if="classificationFilterOptionsData !== null"
                    class="mr-1"
                >
                    <a-badge
                        :dot="classificationFilterOptionsData !== null"
                        :class="$style.badge"
                    >
                        <a-button class="px-2 py-1 ml-2 rounded">
                            <span class="flex items-center justify-center">
                                <fa
                                    icon="fas sort-amount-up"
                                    class="hover:text-primary-500"
                                />
                            </span>
                        </a-button>
                    </a-badge>
                </div>
                <div v-else class="mr-1">
                    <a-button class="px-2 py-1 ml-2 rounded">
                        <span class="flex items-center justify-center">
                            <fa
                                icon="fas sort-amount-up"
                                class="hover:text-primary-500"
                            />
                        </span>
                    </a-button>
                </div>
            </a-popover>
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
                            v-for="item in !hideClassifications
                                ? classificationsList
                                : classificationsList?.slice(0, 5)"
                            :key="item?.guid + classificationFilterOptionsData"
                        >
                            <a-checkbox
                                v-if="item?.displayName"
                                :value="item.name"
                                class="w-full mb-3"
                            >
                                <span class="mb-0 ml-1 text-gray-500 truncated">
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

                    <div
                        v-if="
                            hideClassifications &&
                            classificationSearchText === '' &&
                            classificationsList.length > 5
                        "
                        class="flex items-center w-auto my-3 font-bold text-center cursor-pointer select-none  outlined text-primary"
                        @click="toggleClassifications"
                    >
                        {{ `Show ${classificationsList.length - 5} more` }}
                    </div>
                    <div
                        v-else-if="
                            !hideClassifications &&
                            classificationSearchText === ''
                        "
                        class="flex items-center w-auto my-3 font-bold text-center cursor-pointer select-none  outlined text-primary"
                        @click="toggleClassifications"
                    >
                        {{ `Show less` }}
                    </div>
                </div>
            </a-checkbox-group>
            <p v-else class="text-center text-gray-300">No Classifications</p>
            <div>
                <a-checkbox
                    v-model:checked="data.noClassificationsAssigned"
                    @change="noClassificationsToggle"
                    class="w-full py-3 border-t"
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
        watchEffect,
    } from 'vue'
    import { Collapse } from '~/types'
    import { Components } from '~/api/atlas/client'
    import { classificationInterface } from '~/types/classifications/classification.interface'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'

    export default defineComponent({
        name: 'Classifications',
        components: { CustomRadioButton },
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
                switch (addedByFilterOptionsData.value) {
                    case 'all': {
                        data.value.checked.forEach((val) => {
                            criterion.push({
                                attributeName: '__classificationNames',
                                attributeValue: val,
                                operator: 'eq',
                            })
                            criterion.push({
                                attributeName:
                                    '__propagatedClassificationNames',
                                attributeValue: val,
                                operator: 'eq',
                            })
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
                                attributeName:
                                    '__propagatedClassificationNames',
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
                        condition: operationFilterOptionsData.value,
                        criterion,
                    } as Components.Schemas.FilterCriteria,
                })
            }

            const noClassificationsToggle = () => {
                let criterion: Components.Schemas.FilterCriteria[] = []

                if (data.value.noClassificationsAssigned) {
                    data.value.checked = []
                    criterion.push({
                        attributeName: '__classificationNames',
                        attributeValue: '-',
                        operator: 'not_contains',
                    })
                    criterion.push({
                        attributeName: '__propagatedClassificationNames',
                        attributeValue: '-',
                        operator: 'not_contains',
                    })
                } else {
                    data.value.checked = []
                    criterion = []
                }
                console.log(props.item.id, 'idd')
                emit('change', {
                    id: props.item.id,
                    payload: {
                        condition: operationFilterOptionsData.value,
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
                                const a = classificationA.displayName
                                const b = classificationB.displayName
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
                                const a = classificationA.displayName
                                const b = classificationB.displayName
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
                    filteredClassificationList.value =
                        sortClassificationsByOrder(
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
                filteredClassificationList.value =
                    classificationsList.value.filter(
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
            const handleAddedByChange = () => {}

            return {
                data,
                clear,
                filteredClassificationList,
                classificationsList,
                classificationSearchText,
                clearSearchText,
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
