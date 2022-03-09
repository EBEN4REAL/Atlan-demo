<template>
    <div class="flex flex-row mb-2 space-x-2">
        <a-input
            v-model:value="queryText"
            class="h-8 text-base border-t-0 border-l-0 border-r-0 rounded-none"
            :placeholder="
                dropdownOption.length
                    ? `Search ${dropdownOption.length} ${searchPlaceholder}s`
                    : `Search ${searchPlaceholder}s`
            "
            bordered="false"
            :class="$style.inputSearch"
            allow-clear
        >
            <template #prefix>
                <AtlanIcon icon="Search" color="#6F7590" />
            </template>
        </a-input>
    </div>

    <div
        class="flex w-full dropdown-container max-h-96"
        :class="isTableLoading ? 'flex-col' : ''"
        style="min-height: 0"
    >
        <div
            v-if="dropdownOption.length"
            class="w-full overflow-y-auto"
            style="min-height: 0"
        >
            <template v-for="item in dropdownOption" :key="item.label">
                <div
                    class="flex items-center justify-between w-full px-4 cursor-pointer h-9"
                    @click="(e) => onSelectItem(item, e)"
                    :class="
                        modelValue === item.value
                            ? 'bg-primary-light hover:bg-primary-light'
                            : 'bg-white hover:bg-gray-200'
                    "
                >
                    <div
                        class="flex items-center justify-between w-full parent-ellipsis-container-base"
                    >
                        <div
                            class="flex items-center parent-ellipsis-container-base"
                        >
                            <AtlanIcon
                                :icon="typeName + `Gray`"
                                class="flex-shrink-0 w-auto h-4 mr-2"
                            />
                            <!-- <span class="parent-ellipsis-container-base"
                                >{{ item?.label }}
                            </span> -->
                            <Tooltip
                                :tooltip-text="item?.label"
                                classes="parent-ellipsis-container-base"
                                placement="rightTop"
                                clampPercentage="98%"
                            >
                            </Tooltip>
                        </div>
                    </div>
                    <span v-if="modelValue === item.value" class="w-6">
                        <AtlanIcon
                            v-if="modelValue === item.value"
                            icon="Check"
                            class="ml-1 text-primary parent-ellipsis-container-base"
                        />
                    </span>
                </div>
            </template>
        </div>
        <div
            v-else-if="dropdownOption === 0 && isLoading"
            class="flex items-center justify-between w-full px-4 rounded"
            style="min-height: 0"
        >
            <AtlanLoader class="h-8 mt-1 ml-auto mr-auto" />
        </div>
        <div
            v-else
            class="flex items-center justify-between w-full px-4 rounded"
            style="min-height: 0"
        >
            No {{ searchPlaceholder.toLowerCase() }}s available
        </div>
    </div>

    <!-- <template v-for="item in dropdownOption" :key="item.label">
        <div class="flex items-center truncate">
            <AtlanIcon :icon="typeName + `Gray`" class="w-auto h-4 mr-2" />
            <span class="parent-ellipsis-container-base"
                >{{ item?.label }}
            </span>
        </div>
    </template> -->
</template>

<script lang="ts">
    import {
        defineComponent,
        watch,
        toRefs,
        computed,
        PropType,
        ref,
    } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { isSelectFirstDefault } from '~/components/insights/common/composables/getDialectInfo'
    import bodybuilder from 'bodybuilder'

    import { message } from 'ant-design-vue'
    import Tooltip from '@/common/ellipsis/index.vue'

    export default defineComponent({
        name: 'AssetSelectorNew',
        components: {
            VNodes: (_, { attrs }) => attrs.vnodes,
            Tooltip,
        },
        props: {
            connector: {
                type: Object as PropType<{
                    id: string
                    label: string
                    image: string
                    types: string[]
                    hierarchy: Record<string, any>[]
                    filterMaxLevel: number
                }>,
                required: false,
            },
            modelValue: {
                type: String,
                required: false,
            },
            filters: {
                type: Object,
                required: false,
            },
            searchPlaceholder: {
                type: String,
                required: true,
            },
            typeName: {
                type: String,
                required: false,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            index: {
                type: Number,
                required: true,
            },
            bgGrayForSelector: {
                type: Boolean,
                default: true,
            },
            listFromAssetDropdown: {
                type: Array,
                required: true,
            },
            filterFromAssetDropdown: {
                type: Array,
                required: true,
            },
            assetFromAssetDropdown: {
                type: Array,
                required: true,
            },
        },
        emits: ['update:modelValue', 'change', 'firstSelectByDefaultChange'],
        setup(props, { emit }) {
            const queryText = ref<String>('')

            const {
                disabled,
                // filters,
                typeName,
                modelValue,
                connector,
                index,
                listFromAssetDropdown,
                filterFromAssetDropdown,
                assetFromAssetDropdown,
            } = toRefs(props)

            const getFilter = (index) => {
                if (index > 0) {
                    const item = listFromAssetDropdown.value[index - 1]
                    const typeName = listFromAssetDropdown.value[index].typeName
                    if (assetFromAssetDropdown.value[item.attribute]) {
                        return bodybuilder()
                            .filter(
                                'term',
                                `${item.attribute}`,
                                assetFromAssetDropdown.value[item.attribute]
                            )
                            .filter('term', '__state', 'ACTIVE')
                            .filter('term', '__typeName.keyword', typeName)
                            .size(100)
                            .build()
                    }
                }
                // For the first filter we need the connection name
                else {
                    let connectionName =
                        filterFromAssetDropdown.value?.attributeValue
                            ?.split('/')
                            .slice(0, 3)
                            ?.join('/')

                    return bodybuilder()
                        .filter('term', '__state', 'ACTIVE')
                        .filter(
                            'term',
                            'connectionQualifiedName',
                            connectionName
                        )
                        .filter(
                            'term',
                            '__typeName.keyword',
                            listFromAssetDropdown.value[index].typeName
                        )
                        .size(100)
                        .build()
                }
            }

            // const filters = computed(() => getFilter(index.value))
            const filters = ref(getFilter(index.value))

            const initialBody = {
                dsl: filters.value,
                attributes: ['name', 'displayName'],
            }
            const { list, replaceBody, data, isLoading, error } =
                useAssetListing({}, false)

            watch(error, () => {
                if (error.value) {
                    console.log(typeName.value)
                    message.error({
                        content: `Failed to fetch ${typeName.value}s!`,
                        duration: 3,
                    })
                }
            })
            const totalCount = computed(() => data.value?.approximateCount || 0)
            watch(
                [disabled, filters],
                () => {
                    if (!disabled.value) {
                        initialBody.dsl = filters.value

                        replaceBody(initialBody)
                    }
                },
                { immediate: true }
            )

            watch(
                [filterFromAssetDropdown],
                () => {
                    if (
                        filterFromAssetDropdown.value.attributeName ===
                            'connectionQualifiedName' &&
                        index.value === 0
                    )
                        filters.value = getFilter(index.value)
                },
                { immediate: true }
            )

            const dropdownOption = computed(() => {
                console.log('dropdownOption', dropdownOption)
                // const tree: Record<string, any>[] = []
                // list.value.forEach((ls) => {
                //     let treeNodeObj = {
                //         label:
                //             ls.attributes?.displayName || ls.attributes?.name,
                //         value: ls.attributes.qualifiedName,
                //         slots: {
                //             title: 'title',
                //         },
                //         children: [],
                //     }
                //     tree.push(treeNodeObj)
                //     console.log('selector tree data: ', tree)
                // })
                // tree.sort((x, y) => {
                //     if (x.label < y.label) return -1
                //     if (x.label > y.label) return 1
                //     return 0
                // })
                // return tree
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    value: ls.attributes.qualifiedName,
                }))

                // console.log('selector data: ', data)
                // Checking if there is no data that's been loaded yet, returns 0 to show AtlanLoader
                if (data.length === 0) return 0

                if (queryText.value)
                    data = data.filter((item) =>
                        item.label
                            .toUpperCase()
                            .includes(queryText.value.toUpperCase())
                    )

                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                console.log('data here: ', data)

                // Checking if there is no data found for the respective search term/selection, returns 1 to show "No Data Found"
                if (data.length === 0) return 1

                return data
            })

            const checkifNeedsIsSelectFirstDefault = (
                data: any[],
                forceRefresh = false
            ) => {
                // debugger
                if (
                    isSelectFirstDefault(connector.value.id) &&
                    index.value == 0
                ) {
                    if (data?.length > 0) {
                        // debugger
                        // emit(
                        //     'firstSelectByDefaultChange',
                        //     'connectionQualifiedName',
                        //     filters.value.attributeValue,
                        //     0
                        // )
                        emit(
                            'firstSelectByDefaultChange',
                            'databaseQualifiedName',
                            data[0].value,
                            1,
                            forceRefresh
                        )
                    }
                }
            }

            watch(dropdownOption, () => {
                if (index.value == 0)
                    checkifNeedsIsSelectFirstDefault(
                        dropdownOption.value,
                        dropdownOption.value?.length > 0
                    )
            })

            const onSelectItem = (item, event) => {
                const itemValue = item === undefined ? undefined : item.value

                console.log('item: ', item)
                console.log('itemValue: ', itemValue)

                // console.log('item: ', item.value)
                // console.log('itemevent: ', event)

                // if (item === undefined) {
                //     emit('update:modelValue', item)
                //     emit('change', item)
                // }
                // emit('update:modelValue', itemValue)
                emit('change', itemValue)
            }

            return {
                index,
                typeName,
                list,
                // handleChange,
                totalCount,
                data,
                isLoading,
                dropdownOption,
                queryText,
                onSelectItem,
                connector,
                isSelectFirstDefault,
                getFilter,
            }
        },
    })
</script>
<style lang="less" module>
    .connector {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
            background-color: #fbfbfb !important;
            border: 1px solid #e9ebf1 !important;
            color: #6f7590 !important;
            border-radius: 8px !important;

            input::placeholder {
                color: #6f7590 !important;
            }
        }
        :global(.ant-select-selection-search) {
            input::placeholder {
                color: #6f7590 !important;
            }
        }
    }
    .inputSearch {
        border-color: #e9ebf1 !important;
    }
    .inputSearch:focus {
        outline: none;
    }
    // .ant-tooltip-placement-rightTop {
    //     margin-left: 50px !important;
    //     padding-left: 50px !important;
    // }
</style>
<style lang="less" scoped>
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .ant-input-affix-wrapper:hover {
        border-right-width: 0 !important;
    }
</style>
