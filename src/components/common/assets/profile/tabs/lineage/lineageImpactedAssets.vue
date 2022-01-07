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

            <!-- 
                Name
                Depth 
                Owner 
                Classifications
                Terms
                Custom Metadata
             -->

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
                    <template #bodyCell="{ text, column }">
                        <template v-if="column.key === 'details'">
                            <div class="flex items-center gap-1">
                                <Tooltip
                                    :tooltip-text="text.name"
                                    classes="text-base font-bold text-gray-700  mb-0"
                                />

                                <!-- <CertificateBadge
                                    v-if="text.certificateStatus"
                                    :status="text.certificateStatus"
                                    :username="text.certificateUpdatedBy"
                                    :timestamp="text.certificateUpdatedAt"
                                    class="mb-1 ml-1"
                                ></CertificateBadge> -->
                            </div>
                            <!-- {{ text.name }} -->
                        </template>
                        <!-- Depth -->
                        <template v-else-if="column.key === 'depth'">
                            <div class="flex items-center gap-1">
                                <AtlanIcon icon="Platform" />
                                <span class="text-sm text-gray">{{
                                    text
                                }}</span>
                            </div>
                        </template>

                        <!-- Classification -->
                        <template v-else-if="column.key === 'classifications'">
                            <div class="flex flex-wrap items-center gap-1">
                                <ClassificationPill
                                    v-for="(classif, idx) in getClassification(
                                        text.slice(0, 2)
                                    )"
                                    :key="idx"
                                    :name="classif.name"
                                    :display-name="classif?.displayName"
                                    :is-propagated="isPropagated(classif)"
                                    :color="classif.options?.color"
                                    :allow-delete="false"
                                />

                                <span v-if="text.length - 2 > 0">
                                    +{{ text.length - 2 }}
                                </span>
                                <span
                                    v-if="!text.length"
                                    class="text-sm text-gray-500"
                                    >--</span
                                >
                            </div>
                        </template>

                        <!-- Terms -->
                        <template v-else-if="column.key === 'terms'">
                            <div class="flex flex-wrap items-center gap-x-1">
                                <TermPill
                                    v-for="(term, idx) in text.slice(0, 2)"
                                    :key="idx"
                                    :term="term"
                                    :allow-delete="false"
                                />
                                <span v-if="text.length - 2 > 0">
                                    +{{ text.length - 2 }}
                                </span>
                                <span
                                    v-if="!text.length"
                                    class="text-sm text-gray-500"
                                    >--</span
                                >
                            </div>
                        </template>

                        <template v-else>
                            <span>
                                {{ text }}
                            </span>
                        </template>
                    </template>
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
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import useGetNodes from './useGetNodes'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    /** COMPONENTS */
    import TermPill from '@/common/pills/term.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import Tooltip from '@/common/ellipsis/index.vue'

    export default defineComponent({
        name: 'LineageImpactedAssets',
        components: { TermPill, ClassificationPill, CertificateBadge, Tooltip },
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

            const { ownerGroups, ownerUsers } = useAssetInfo()
            const { classificationList } = useTypedefData()

            const getClassification = (ids: String[]) =>
                classificationList.value.filter((clsf) =>
                    ids.includes(clsf.name)
                )

            const isPropagated = (classification) => {
                if (!guid?.value) {
                    return false
                }
                if (guid.value === classification.entityGuid) {
                    return false
                }
                return true
            }

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

            const getImpactedAssets = () => {
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
                            details: {
                                name:
                                    entity.displayText ||
                                    entity.attributes.name,
                                certificateStatus:
                                    entity.attributes?.certificateStatus,
                                certificateUpdatedBy:
                                    entity.attributes?.certificateUpdatedBy,
                                certificateUpdatedAt:
                                    entity.attributes?.certificateUpdatedAt,
                            },
                            depth: 1,
                            owner: [
                                ...ownerUsers(entity),
                                ...ownerGroups(entity),
                            ],
                            classifications: entity.classificationNames,
                            terms: entity.meanings,
                        })
                })

                isLoading.value = false
            }

            const downloadImpactedAssets = () => {
                // const data = []
                // columnsData.value.forEach((x) => {
                //     data.push({
                //         Name: x.name,
                //         Type: x.type,
                //         Source: x.source,
                //         Database: x.database,
                //         Schema: x.schema,
                //     })
                // })
                // try {
                //     const cell = getCell(guid.value)
                //     const { entity } = cell.store.data
                //     const fileName = `${entity.displayText}_lineage_impact`
                //     const name = 'atlan'
                //     const ws = XLSX.utils.json_to_sheet(data)
                //     const wb = XLSX.utils.book_new()
                //     XLSX.utils.book_append_sheet(wb, ws, name)
                //     XLSX.writeFile(wb, `${fileName}.csv`, {
                //         bookType: 'csv',
                //     })
                // } catch (error) {
                //     console.error('downloadFileCsv', error)
                // }
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
                getClassification,
                isPropagated,
                isLoading,
                columnsData,
                columns: [
                    {
                        width: 400,
                        title: 'Name',
                        dataIndex: 'details',
                        key: 'details',
                        // ellipsis: true,
                        fixed: 'left',
                    },
                    {
                        width: 70,
                        title: 'Depth',
                        dataIndex: 'depth',
                        key: 'depth',
                    },
                    {
                        width: 250,
                        title: 'Owner',
                        dataIndex: 'owner',
                        key: 'owner',
                    },
                    {
                        width: 400,
                        title: 'Classifications',
                        dataIndex: 'classifications',
                        key: 'classifications',
                    },
                    {
                        width: 400,
                        title: 'Terms',
                        dataIndex: 'terms',
                        key: 'terms',
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
