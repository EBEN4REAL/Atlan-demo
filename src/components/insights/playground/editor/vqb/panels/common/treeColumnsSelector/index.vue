<template>
    <a-popover placement="bottomLeft" :trigger="['click']">
        <div
            class="flex items-center px-2 border border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px"
        >
            <div
                v-if="selectedColumn?.label"
                style="max-width: 450px"
                class="flex items-center truncate"
            >
                <component
                    :is="
                        dataTypeImage({
                            attributes: { dataType: selectedColumn?.type },
                        })
                    "
                    class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                ></component>
                <span
                    class="mb-0 ml-1 text-sm text-gray-700 parent-ellipsis-container-base"
                >
                    {{ placeholder }}
                </span>
            </div>
            <span v-else>
                {{ placeholder }}
            </span>
        </div>
        <template #content>
            <div v-if="!tableSelected?.qualifiedName">
                <a-input
                    v-model:value="tableText"
                    placeholder="Enter table name"
                    class="border-l-0 border-r-0 rounded-none outline-none"
                    style="height: 36px; width: 400px"
                >
                    <template #suffix>
                        <AtlanIcon
                            icon="Search"
                            class="text-gray-500"
                        ></AtlanIcon>
                    </template>
                </a-input>
                <div style="height: 300px !important" class="overflow-y-scroll">
                    <AtlanIcon
                        v-if="isLoading"
                        icon="Loader"
                        class="w-auto h-10 animate-spin"
                        style="margin-left: 175px; margin-top: 100px"
                    ></AtlanIcon>

                    <template
                        v-if="tableDropdownOption.length !== 0 && !isLoading"
                        v-for="(item, index) in tableDropdownOption"
                        :key="item?.label + index"
                    >
                        <div
                            class="flex items-center justify-between pl-4 pr-2 cursor-pointer h-9 truncanimate-spin hover:bg-primary-selected-focus"
                            style="width: 400px"
                            @click="onSelectTable(item)"
                        >
                            <div class="flex items-center truncate">
                                <AtlanIcon
                                    :icon="
                                        getEntityStatusIcon(
                                            assetType(item),
                                            certificateStatus(item)
                                        )
                                    "
                                    class="w-4 h-4 -mt-0.5 parent-ellipsis-container-extension"
                                ></AtlanIcon>

                                <span
                                    class="ml-2 parent-ellipsis-container-base"
                                    style="width: 300px"
                                    >{{ item?.label }}
                                </span>
                            </div>
                            <div
                                class="flex items-center justify-between text-gray-500"
                            >
                                {{ item?.columnCount }}

                                <AtlanIcon
                                    icon="ChevronRight"
                                    class="w-4 h-4 ml-1 -mt-0.5 text-gray-500"
                                />
                            </div>
                        </div>
                    </template>
                    <div
                        v-if="tableDropdownOption.length === 0 && !isLoading"
                        class="flex items-center justify-center h-full"
                    >
                        No tables found
                    </div>
                </div>
            </div>

            <div v-else>
                <div
                    class="flex items-center justify-between h-9 pl-2 pr-4 truncanimate-spin pt-0.5"
                    style="width: 400px"
                >
                    <div class="flex items-center truncate">
                        <AtlanIcon
                            icon="ChevronLeft"
                            class="w-4 h-4 -mt-0.5 text-gray-500"
                            @click="onUnselectTable"
                        />

                        <span
                            class="ml-2 parent-ellipsis-container-base"
                            style="width: 300px"
                            >{{ tableSelected?.label }}
                        </span>
                    </div>
                    <div
                        class="flex items-center justify-between text-gray-500"
                    >
                        {{ tableSelected?.columnCount }}
                    </div>
                </div>
                <a-input
                    v-model:value="columnText"
                    placeholder="Enter column name"
                    class="border-l-0 border-r-0 rounded-none outline-none"
                    style="height: 36px; width: 400px"
                >
                    <template #suffix>
                        <AtlanIcon
                            icon="Search"
                            class="text-gray-500"
                        ></AtlanIcon>
                    </template>
                </a-input>
                <div style="height: 278px !important" class="overflow-y-scroll">
                    <AtlanIcon
                        v-if="isLoading"
                        icon="Loader"
                        class="w-auto h-10 animate-spin"
                        style="margin-left: 175px; margin-top: 100px"
                    ></AtlanIcon>
                    <template
                        v-if="columnDropdownOption.length !== 0 && !isLoading"
                        v-for="(item, index) in columnDropdownOption"
                        :key="item?.label + index"
                    >
                        <div
                            class="flex items-center justify-between pl-4 pr-4 cursor-pointer h-9 truncanimate-spin hover:bg-primary-selected-focus"
                            style="width: 400px"
                            @click="onSelectColumn(item)"
                            :class="
                                selectedColumn?.columnQualifiedName ===
                                item?.qualifiedName
                                    ? 'bg-primary-light'
                                    : ''
                            "
                        >
                            <div class="flex items-center truncate">
                                <component
                                    :is="dataTypeImage(item)"
                                    class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                                ></component>
                                <span
                                    class="mb-0 ml-1 text-sm text-gray-700 parent-ellipsis-container-base"
                                >
                                    {{ item.label }}
                                </span>
                            </div>
                            <div
                                class="relative h-full w-14 parent-ellipsis-container-extension"
                                v-if="item?.attributes?.isPrimary"
                            >
                                <div
                                    class="absolute right-0 flex items-center mt-1.5"
                                >
                                    <AtlanIcon
                                        icon="PrimaryKey"
                                        style="color: #3ca5bc"
                                        class="w-4 h-4 mr-1"
                                    ></AtlanIcon>
                                    <span style="color: #3ca5bc" class="text-sm"
                                        >Pkey</span
                                    >
                                </div>
                            </div>
                        </div>
                    </template>
                    <div
                        v-if="columnDropdownOption.length === 0 && !isLoading"
                        class="flex items-center justify-center h-full"
                    >
                        No columns found
                    </div>
                </div>
            </div>
        </template>
    </a-popover>
</template>

<script lang="ts">
    import {
        defineComponent,
        watch,
        toRefs,
        PropType,
        ref,
        computed,
        inject,
        ComputedRef,
        onMounted,
    } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import Loader from '@common/loaders/page.vue'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useVModels } from '@vueuse/core'
    import { selectedTables } from '~/types/insights/VQB.interface'

    import useBody from './useBody'

    export default defineComponent({
        name: 'Table Selector',
        emits: ['change'],
        components: {
            Loader,
        },
        props: {
            selectedColumn: {
                type: Object,
                required: true,
            },
            selectedTablesQualifiedNames: {
                type: Object as PropType<selectedTables[]>,
            },
            showColumnWithTable: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props, { emit }) {
            const { showColumnWithTable, selectedTablesQualifiedNames } =
                toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const tableText = ref('')
            const columnText = ref('')

            const { selectedColumn } = useVModels(props)

            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                certificateStatus,
            } = useAssetInfo()

            const getTableInitialBody = () => {
                return {
                    dsl: useBody({
                        schemaQualifiedName:
                            activeInlineTab.value.playground.editor.context
                                .attributeValue,

                        searchText: tableText.value,
                        tableQualifiedNames: selectedTablesQualifiedNames.value
                            ?.filter((x) => x !== null || undefined)
                            .map((t) => t.tableQualifiedName),
                    }),
                    attributes: [
                        'name',
                        'displayName',
                        'columnCount',
                        'certificateStatus',
                    ],
                }
            }

            const { list, replaceBody, data, isLoading } = useAssetListing(
                '',
                false
            )
            watch(
                () => activeInlineTab.value.playground.editor.context,
                () => {
                    replaceBody(getTableInitialBody())
                },
                {
                    immediate: true,
                }
            )
            watch(tableText, () => {
                replaceBody(getTableInitialBody())
            })

            watch(selectedTablesQualifiedNames, () => {
                replaceBody(getTableInitialBody())
            })

            let tableSelected = ref(null)

            watch(columnText, () => {
                replaceBody(getColumnInitialBody(tableSelected?.value))
            })

            const totalCount = computed(() => data.value?.approximateCount || 0)

            const tableDropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    columnCount: ls.attributes?.columnCount,
                    qualifiedName: ls.attributes.qualifiedName,
                    attributes: ls.attributes,
                    typeName: ls.typeName,
                }))

                // console.log('list: ', list)

                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                return data
            })

            const columnDropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    qualifiedName: ls.attributes.qualifiedName,
                    type: ls.attributes.dataType,
                    attributes: ls.attributes,
                    order: ls.attributes.order,
                }))

                // console.log('list: ', list)

                data.sort((x, y) => {
                    if (x.order < y.order) return -1
                    if (x.order > y.order) return 1
                    return 0
                })
                console.log('col: ', data)
                return data
            })

            const getColumnInitialBody = (item) => {
                let data = {}
                if (item.typeName === 'Table') {
                    data = {
                        tableQualifiedName: item?.qualifiedName,
                        searchText: columnText.value,
                    }
                } else if (item.typeName === 'View') {
                    data = {
                        viewQualifiedName: item?.qualifiedName,
                        searchText: columnText.value,
                    }
                }
                return {
                    dsl: useBody(data),
                    attributes: [
                        'name',
                        'displayName',
                        'columnCount',
                        'certificateStatus',
                        'dataType',
                        'order',
                        'isPrimary',
                        'isForeign',
                    ],
                }
            }

            const onSelectTable = (item) => {
                // console.log('selected table: ', item)
                tableSelected.value = item
                replaceBody(getColumnInitialBody(item))
            }
            const onUnselectTable = () => {
                tableSelected.value = null
                columnDropdownOption.value = []
                replaceBody(getTableInitialBody())
            }

            const onSelectColumn = (item) => {
                let qualifiedName = item?.qualifiedName.split('/')
                let size = qualifiedName?.length
                console.log(
                    'name: ',
                    `${qualifiedName[size - 2]}.${qualifiedName[size - 1]}`
                )
                selectedColumn.value = {
                    label: item.label,
                    type: item.type,
                    value: item.label,
                    columnQualifiedName: item.qualifiedName,
                }
                emit('change', item.qualifiedName)
                console.log()
            }

            const placeholder = computed(() => {
                if (selectedColumn?.value?.label) {
                    let data =
                        selectedColumn.value.columnQualifiedName.split('/')

                    if (showColumnWithTable)
                        return `${data[data.length - 2]}.${
                            data[data.length - 1]
                        }`
                    else return `${data[data.length - 1]}`
                }

                let data = !tableSelected.value?.qualifiedName
                    ? `select from ${totalCount.value} tables`
                    : `select from ${totalCount.value} columns`

                return data
            })

            return {
                totalCount,
                data,
                isLoading,
                tableDropdownOption,
                tableText,
                onSelectTable,
                onUnselectTable,
                tableSelected,
                columnText,
                columnDropdownOption,
                onSelectColumn,
                getEntityStatusIcon,
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                certificateStatus,
                selectedColumn,
                placeholder,
            }
        },
    })
</script>
<style lang="less" module>
    .selector {
        :global(.ant-select-selector) {
            height: 100% !important;
            @apply border border-gray-300 !important;
        }
        :global(.ant-select-selection-item::after) {
            display: none !important;
        }
    }
    // input::placeholder {
    //     color: #6f7590 !important;
    // }
</style>
<style lang="less" scoped>
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
</style>
