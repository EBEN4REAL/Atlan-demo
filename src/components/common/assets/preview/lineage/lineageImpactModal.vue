<template>
    <a-modal
        :visible="visible"
        :footer="null"
        width="85vw"
        style="z-index: 600"
        @cancel="$emit('update:visible', false)"
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
            <div class="flex justify-end w-full gap-x-4">
                <AtlanButton
                    padding="compact"
                    size="sm"
                    color="secondary"
                    @click="$emit('update:visible', false)"
                >
                    Close
                </AtlanButton>

                <AtlanButton
                    padding="compact"
                    size="sm"
                    :disabled="columnsData.length === 0 || !isReady"
                    :loading="isLoading"
                    @click="downloadImpactedAssets"
                >
                    Download
                </AtlanButton>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    /** VUE */
    import {
        defineComponent,
        onMounted,
        toRefs,
        watch,
        computed,
        ref,
    } from 'vue'

    /** MODULES */
    import { message } from 'ant-design-vue'
    import { json2csv } from 'json-2-csv'
    import { whenever } from '@vueuse/core'

    /** COMPOSABLES */
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import useLineageService from '~/services/meta/lineage/lineage_service'
    import { AssetAttributes } from '~/constant/projection'

    /** COMPONENTS */
    import TermPill from '@/common/pills/term.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import AtlanButton from '@/UI/button.vue'
    import { downloadFile } from '~/utils/library/download'

    /** LINEAGE PARAMETERS */
    const depth = 21
    const direction = 'OUTPUT'

    export default defineComponent({
        name: 'LineageImpactModal',
        components: {
            TermPill,
            ClassificationPill,
            CertificateBadge,
            Tooltip,
            AtlanButton,
        },
        props: {
            guid: { type: String, required: true },
            assetName: { type: String, required: true },
            visible: {
                type: Boolean,
                required: true,
            },
        },
        emits: ['update:visible'],
        setup(props, { emit }) {
            const { guid, assetName, visible } = toRefs(props)
            const { useFetchLineage } = useLineageService()
            const {
                ownerGroups,
                ownerUsers,
                certificateUpdatedAt,
                getConnectorImage,
                assetTypeLabel,
            } = useAssetInfo()

            const { classificationList } = useTypedefData()

            /** This is a flag. We check if the guid has changed and
             * only then fetch the impacted assets. */
            const updateNeeded = ref(true)

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

            const {
                data: downstreamData,
                isLoading,
                isReady,
                mutate: mutateDownstream,
                error,
            } = useFetchLineage(
                computed(() => ({
                    depth,
                    direction,
                    guid: guid.value,
                    hideProcess: true,
                    attributes: AssetAttributes,
                }))
            )

            const downstreamAssets = computed(() =>
                Object.values(downstreamData.value?.guidEntityMap || {}).filter(
                    (asset) => asset.guid !== guid.value
                )
            )

            const columnsData = computed(() =>
                downstreamAssets.value.map((entity, idx) => ({
                    key: idx,
                    details: {
                        name: entity.displayText || entity.attributes.name,
                        typeName: assetTypeLabel(entity) || entity.typeName,
                        source: getSource(entity),
                        sourceImg: getConnectorImage(entity),
                        qfPath: entity.attributes?.qualifiedName
                            ?.split('/')
                            .slice(3, -1)
                            .join('/'),
                        certificateStatus: entity.attributes?.certificateStatus,
                        certificateUpdatedBy:
                            entity.attributes?.certificateUpdatedBy,
                        certificateUpdatedAt: certificateUpdatedAt(entity),
                    },
                    db: getTable(entity),
                    schema: getSchema(entity),
                    depth: 1,
                    owners: [...ownerUsers(entity), ...ownerGroups(entity)],
                    classifications: entity.classificationNames,
                    terms: entity.meanings,
                }))
            )

            const getImpactedAssets = () => {
                if (!guid.value || !updateNeeded.value) return
                mutateDownstream()
                updateNeeded.value = false
            }

            const downloadImpactedAssets = () => {
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

                json2csv(
                    data,
                    (err, csv) => {
                        if (err)
                            message.error(
                                'Error downloading CSV, please try again.'
                            )
                        else {
                            downloadFile(
                                csv,
                                `${assetName.value}_lineage_impact`
                            )
                            message.success('CSV exported successfully')
                            emit('update:visible', false)
                        }
                    },
                    { emptyFieldValue: '' }
                )
            }

            watch(guid, () => {
                updateNeeded.value = true
            })

            whenever(error, () => {
                if (error.value)
                    message.error('There was an error fetching lineage.')
            })

            /** We only trigger the re-fetch when the modal is opened */
            whenever(visible, getImpactedAssets)

            return {
                error,
                downloadImpactedAssets,
                getClassification,
                isPropagated,
                getConnectorImage,
                assetTypeLabel,
                isLoading,
                isReady,
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
