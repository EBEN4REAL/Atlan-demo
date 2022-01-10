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
                    :scroll="{ y: 300, x: 500 }"
                    :pagination="false"
                    size="middle"
                    :loading="isLoading"
                    bordered
                >
                    <template #bodyCell="{ text, column }">
                        <!-- Asset Details -->
                        <template v-if="column.key === 'details'">
                            <div class="flex flex-col">
                                <div class="flex items-center gap-1">
                                    <Tooltip
                                        :tooltip-text="text.name"
                                        classes="text-sm text-primary mb-0"
                                    />

                                    <CertificateBadge
                                        v-if="text.certificateStatus"
                                        :status="text.certificateStatus"
                                        :username="text.certificateUpdatedBy"
                                        :timestamp="text.certificateUpdatedAt"
                                        class="mb-1 ml-1"
                                    ></CertificateBadge>
                                </div>
                                <div
                                    class="flex items-center text-sm text-gray-500"
                                >
                                    <img
                                        :src="text.sourceImg"
                                        class="h-3 mr-1 mb-0.5"
                                    />
                                    <span class="tracking-wider uppercase">
                                        {{ text.typeName }}
                                    </span>
                                    <span class="px-1 text-gray-400">•</span>
                                    <span class="truncate">{{
                                        text.qfPath
                                    }}</span>
                                </div>
                            </div>
                        </template>

                        <!-- Depth -->
                        <!-- FIXME: This depth number is dummy for now, change it to use actual depth -->
                        <template v-else-if="column.key === 'depth'">
                            <div class="flex items-center gap-1">
                                <AtlanIcon icon="Platform" />
                                <span class="text-sm text-gray">{{
                                    text
                                }}</span>
                            </div>
                        </template>

                        <!-- Owners -->
                        <!-- FIXME: Change the design as in Figma. -->
                        <template v-else-if="column.key === 'owners'">
                            <div class="flex flex-wrap items-center gap-x-1">
                                <span
                                    v-for="(owner, idx) in text.slice(0, 2)"
                                    :key="idx"
                                    class="px-2 py-1 text-sm border rounded-full text-gray"
                                >
                                    {{ owner }}
                                </span>
                                <span
                                    class="text-sm text-gray-500"
                                    v-if="text.length - 2 > 0"
                                >
                                    +{{ text.length - 2 }}
                                </span>
                                <span
                                    v-if="!text.length"
                                    class="text-sm text-gray-500"
                                    >--</span
                                >
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

                                <span
                                    v-if="text.length - 2 > 0"
                                    class="text-sm text-gray-500"
                                >
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
                                <span
                                    v-if="text.length - 2 > 0"
                                    class="text-sm text-gray-500"
                                >
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
    import { message } from 'ant-design-vue'
    import { json2csv } from 'json-2-csv'

    /** COMPOSABLES */
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGetNodes from './useGetNodes'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    /** COMPONENTS */
    import TermPill from '@/common/pills/term.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import { downloadFile } from '~/utils/library/download'

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

            const {
                ownerGroups,
                ownerUsers,
                certificateUpdatedAt,
                getConnectorImage,
                assetTypeLabel,
            } = useAssetInfo()
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
                                typeName:
                                    assetTypeLabel(entity) || entity.typeName,
                                source: getSource(entity),
                                sourceImg: getConnectorImage(entity),
                                qfPath: entity.attributes?.qualifiedName
                                    ?.split('/')
                                    .slice(3, -1)
                                    .join('/'),
                                certificateStatus:
                                    entity.attributes?.certificateStatus,
                                certificateUpdatedBy:
                                    entity.attributes?.certificateUpdatedBy,
                                certificateUpdatedAt:
                                    certificateUpdatedAt(entity),
                            },
                            db: getTable(entity),
                            schema: getSchema(entity),
                            depth: 1,
                            owners: [
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
                // const data: any[] = []
                const data = columnsData.value.map((x) => {
                    const y = JSON.parse(JSON.stringify(x))
                    return {
                        Name: y.details.name,
                        Certification: y.details.certificateStatus,
                        Depth: y.depth,
                        Source: y.details.source,
                        Type: y.details.typeName,
                        Database: y.db,
                        Schema: y.schema,
                        Owners: y.owners,
                        Classifications: y.classifications,
                        Terms: y.terms.map((t) => t.termGuid),
                    }
                })

                json2csv(data, (err, csv) => {
                    if (err) {
                        console.error(err)
                        message.error(
                            'Error downloading CSV, please try again.'
                        )
                    } else {
                        const cell = getCell(guid.value)
                        const { entity } = cell.store.data
                        const fileName = `${entity.displayText}_lineage_impact`
                        downloadFile(csv, fileName)
                    }
                })
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
                getConnectorImage,
                assetTypeLabel,
                isLoading,
                columnsData,
                columns: [
                    {
                        width: 300,
                        title: 'Name',
                        dataIndex: 'details',
                        key: 'details',
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
                        title: 'Owners',
                        dataIndex: 'owners',
                        key: 'owners',
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
