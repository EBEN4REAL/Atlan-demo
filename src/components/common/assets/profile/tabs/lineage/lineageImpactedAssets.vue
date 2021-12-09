<template>
    <a-modal
        :visible="visible"
        :class="$style.input"
        :footer="null"
        width="85vw"
        style="z-index: 600"
        @cancel="emit('cancel')"
    >
        <div class="w-full p-4 text-gray-500 bg-white rounded">
            <!-- Header -->
            <div class="mb-6 text-lg">Downstream Impacted Assets</div>

            <!-- Content - Table -->
            <div class="relative mb-6">
                <a-table
                    :columns="columns"
                    :data-source="columnsData"
                    :scroll="columnsData.length > 7 ? { y: 300 } : null"
                    :pagination="false"
                    size="small"
                    :loading="isLoading"
                >
                </a-table>
            </div>

            <!-- Footer CTA -->
            <div class="flex justify-end w-full">
                <a-button @click="emit('cancel')">Close</a-button>
                <a-button
                    :disabled="columnsData.length === 0"
                    type="primary"
                    class="flex items-center justify-between ml-4"
                    @click="downloadImpactedAssets"
                >
                    Download
                </a-button>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    /** VUE */
    import { defineComponent, ref, onMounted, toRefs, watch } from 'vue'

    /** MODULES */
    import XLSX from 'xlsx'

    /** COMPOSABLES */
    import useGetNodes from './useGetNodes'

    export default defineComponent({
        name: 'LineageImpactedAssets',
        props: {
            graph: {
                required: true,
            },
            guid: {
                type: String,
                required: true,
            },
            visible: {
                type: Boolean,
                required: true,
            },
        },
        emits: ['cancel'],
        setup(props, { emit }) {
            const isLoading = ref(true)
            const { graph, guid } = toRefs(props)
            const columnsData = ref([])

            const getSource = (entity) => {
                const item = entity.attributes.qualifiedName.split('/')
                if (item[0] === 'default') return item[1]
                return item[0]
            }

            const getTable = (entity) => {
                const item = entity.attributes.qualifiedName.split('/')
                if (item[0] === 'default') return item[3]
                return item[2]
            }

            const getSchema = (entity) => {
                const item = entity.attributes.qualifiedName.split('/')
                if (item[0] === 'default') return item[4]
                return item[3]
            }

            const getCell = (guid) => graph.value.getCellById(guid)

            const getImpactedAssets = async () => {
                if (!guid.value) return
                columnsData.value = []
                const { successors } = useGetNodes(graph, guid.value, false)

                successors.forEach((x) => {
                    const cell = getCell(x)
                    const { entity } = cell.store.data

                    if (
                        !['Process', 'AtlanProcess', 'ColumnProcess'].includes(
                            entity.typeName
                        )
                    )
                        columnsData.value.push({
                            key: columnsData.value.length + 1,
                            hash_index: columnsData.value.length + 1,
                            name: entity.displayText || entity.attributes.name,
                            type: entity.typeName,
                            source: getSource(entity),
                            database: getTable(entity),
                            schema: ['Table', 'View', 'Column'].includes(
                                entity.typeName
                            )
                                ? getSchema(entity)
                                : '---',
                        })
                })

                isLoading.value = false
            }

            const downloadImpactedAssets = () => {
                const data = []
                columnsData.value.forEach((x) => {
                    data.push({
                        Name: x.name,
                        Type: x.type,
                        Source: x.source,
                        Database: x.database,
                        Schema: x.schema,
                    })
                })

                try {
                    const cell = getCell(guid.value)
                    const { entity } = cell.store.data
                    const fileName = `${entity.displayText}_lineage_impact`
                    const name = 'atlan'
                    const ws = XLSX.utils.json_to_sheet(data)
                    const wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, ws, name)
                    XLSX.writeFile(wb, `${fileName}.csv`, {
                        bookType: 'csv',
                    })
                } catch (error) {
                    console.error('downloadFileCsv', error)
                }
            }

            watch(guid, () => {
                getImpactedAssets()
            })

            onMounted(() => {
                getImpactedAssets()
            })

            return {
                emit,
                downloadImpactedAssets,
                isLoading,
                columnsData,
                columns: [
                    {
                        width: 40,
                        title: '#',
                        dataIndex: 'hash_index',
                        key: 'hash_index',
                    },
                    {
                        width: 250,
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                        ellipsis: true,
                    },
                    {
                        width: 100,
                        title: 'Type',
                        dataIndex: 'type',
                        key: 'type',
                    },
                    {
                        width: 100,
                        title: 'Source',
                        dataIndex: 'source',
                        key: 'source',
                    },
                    {
                        width: 100,
                        title: 'Database',
                        dataIndex: 'database',
                        key: 'databse',
                    },
                    {
                        width: 150,
                        title: 'Schema',
                        dataIndex: 'schema',
                        key: 'schema',
                    },
                ],
            }
        },
    })
</script>

<style lang="less" module>
    .input {
        :global(.ant-input:focus
                .ant-input:hover
                .ant-input::selection
                .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none border-0 px-0 !important;
        }
    }
</style>
