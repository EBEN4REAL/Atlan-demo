<template>
    <div>
        <div
            v-if="columnsData.isLoading"
            class="w-full h-full p-6 text-center border border-t-0 border-gray-300 "
        >
            <a-spin />
        </div>
        <div
            :class="{
                'border border-gray-300 border-t-0': showColumns,
            }"
            v-else
        >
            <div class="flex items-center p-3 gap-x-3">
                <a-input-search
                    :value="query"
                    placeholder="Search columns"
                    @change="filterByQuery"
                >
                </a-input-search>
                <a-popover placement="bottomRight">
                    <template #content>
                        <div class="text-xs">
                            <p class="mb-3 text-gray-500">Column Type</p>
                            <a-checkbox-group
                                v-model:value="filtersSelected"
                                @change="filterByType"
                            >
                                <div class="flex flex-col space-y-1">
                                    <a-checkbox
                                        v-for="(type, index) in filters"
                                        :key="index"
                                        :value="type"
                                        class="text-xs"
                                        >{{ type }}</a-checkbox
                                    >
                                </div>
                            </a-checkbox-group>
                        </div>
                    </template>
                    <a-button size="default"
                        ><fa icon="fal cog" class="mr-1"></fa
                        ><fa
                            icon="fas chevron-down"
                            class="text-xs text-primary-500"
                        ></fa
                    ></a-button>
                </a-popover>
            </div>

            <ul class="mb-0">
                <li
                    v-for="(column, index) in columnsData.filteredList"
                    :key="'column' + String(index)"
                    class="px-3 py-2 hover:bg-gray-100"
                >
                    <div class="flex items-center">
                        <component
                            :is="dataTypeImage(column)"
                            class="w-5 h-5 mr-3 text-gray"
                        ></component>
                        <span
                            class="flex-shrink mr-2 font-bold leading-tight  text-gray"
                        >
                            {{ column.displayText }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        nextTick,
        watch,
        ref,
        ToRefs,
        toRefs,
        onMounted,
    } from 'vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import useColumns from '~/composables/asset/useColumns'
    import useColumnsFilter from '~/composables/asset/useColumnsFilter'
    import { dataTypeList } from '~/constant/datatype'

    export default defineComponent({
        props: {
            refs: {
                type: Array,
                required: true,
            },
            showColumns: {
                type: Boolean,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        setup(props, { emit }) {
            /** DATA */
            const { refs, data, showColumns }: ToRefs = toRefs(props)
            const query = ref('')
            const filters = ref([])
            const filtersSelected = ref([])
            const columnsData = ref({})

            /** METHODS */
            // dataTypeImage
            const { dataTypeImage } = useAssetInfo()

            // getColumnTypes
            const getColumnTypes = (filteredList) => {
                const filtersIdSet = new Set()
                dataTypeList.forEach((i) => {
                    filteredList.forEach((j) => {
                        if (i.type.includes(j.attributes.dataType))
                            filtersIdSet.add(i.id)
                    })
                })
                filters.value = Array.from(filtersIdSet)
                filtersSelected.value = Array.from(filtersIdSet)
            }

            //  filterByQuery
            const filterByQuery = (e) => {
                query.value = e.target.value
                handleFilter()
            }

            // filterByType
            const filterByType = (e) => {
                filtersSelected.value = e
                handleFilter()
            }

            // handleFilter
            const handleFilter = () => {
                const { columnList, groupId, groupHeadersLength, guid } =
                    columnsData.value

                filterColumnsList(columnList, groupId, groupHeadersLength, guid)
            }

            //  filterColumnsList
            const filterColumnsList = (
                columnList,
                groupId,
                groupHeadersLength,
                guid
            ) => {
                const { filteredList } = useColumnsFilter(
                    columnList,
                    query,
                    filtersSelected
                )

                if (filters.value.length === 0)
                    getColumnTypes(filteredList.value)

                columnsData.value = {
                    filteredList: filteredList.value,
                    columnList,
                    groupHeadersLength,
                    groupId,
                    guid,
                }

                nextTick(() => {
                    const nodeCon = refs.value[`node-content-${guid}`]
                    const groupHeadersHeight = 38 * groupHeadersLength
                    const groupContentHeight = nodeCon.clientHeight

                    columnsData.value.isLoading = false
                    const val = groupHeadersHeight + groupContentHeight
                    emit('update-content-height', {
                        groupId,
                        val,
                    })
                })
            }

            //  fetchColumns
            const fetchColumns = (data, fetch) => {
                const { guid, groupId, groupHeadersLength } = data.value

                if (fetch) {
                    columnsData.value = { isLoading: true }

                    const val = 38 * groupHeadersLength + 77
                    emit('update-content-height', {
                        groupId,
                        val,
                    })

                    const { columnList } = useColumns(guid)

                    watch(columnList, () => {
                        filterColumnsList(
                            columnList.value,
                            groupId,
                            groupHeadersLength,
                            guid
                        )
                    })
                } else {
                    columnsData.value.isLoading = false
                    const val = 38 * groupHeadersLength
                    emit('update-content-height', {
                        groupId,
                        val,
                    })
                }
            }

            watch(showColumns, (newVal) => {
                if (newVal) fetchColumns(data, true)
                else fetchColumns(data, false)
            })

            onMounted(() => {
                fetchColumns(data, true)
            })

            return {
                dataTypeImage,
                filterByQuery,
                filterByType,
                columnsData,
                query,
                filters,
                filtersSelected,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.ant-checkbox-inner) {
        @apply w-3 h-3 !important;
    }
</style>
