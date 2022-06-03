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
            <div v-if="asset?.guid" class="flex items-center mb-6 text-lg">
                All Downstream Impacted Assets of
                <span class="ml-2 font-medium text-gray-600">{{
                    title(asset)
                }}</span>
                <router-link
                    v-if="!portsTypeNames.includes(asset.typeName)"
                    :to="getLineagePath(asset)"
                    target="_blank"
                >
                    <div
                        class="flex items-center ml-3 text-base cursor-pointer text-primary"
                    >
                        <AtlanIcon icon="External" class="mr-1" /> View Lineage
                    </div>
                </router-link>
            </div>

            <!-- Content - Table -->
            <div class="relative mb-6">
                <a-table
                    :columns="columns"
                    :class="$style.impactTable"
                    :data-source="columnsData"
                    :scroll="{ y: 300, x: 500 }"
                    :pagination="false"
                    size="middle"
                    :loading="isLoading"
                    bordered
                >
                    <template #headerCell="{ column }">
                        <template v-if="column.isCm">
                            <span class="flex items-center">
                                <span :title="`CM Name: ${column.cmNameDN}`">
                                    {{ column.cmNameDN }}
                                </span>

                                <svg
                                    width="2"
                                    height="2"
                                    viewBox="0 0 2 2"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="mx-1"
                                >
                                    <circle
                                        opacity="0.5"
                                        cx="1"
                                        cy="1"
                                        r="1"
                                        fill="#6F7590"
                                    />
                                </svg>

                                <span
                                    :title="`CM Attribute: ${column.cmAttributeDN}`"
                                    class="truncate"
                                >
                                    {{ column.cmAttributeDN }}
                                </span>

                                <span
                                    v-if="!column.cmIconValue"
                                    class="mb-1 ml-2"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-auto h-auto"
                                    >
                                        <g opacity="0.4">
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M2.16667 1C1.52233 1 1 1.52233 1 2.16667V11.5V13.8333C1 14.4777 1.52233 15 2.16667 15H13.8333C14.4777 15 15 14.4777 15 13.8333V2.16667C15 1.52233 14.4777 1 13.8333 1H2.16667ZM13.8333 8.92506L11.7416 6.83335C11.5228 6.61456 11.2261 6.49164 10.9167 6.49164C10.6072 6.49164 10.3105 6.61456 10.0917 6.83335L6.83333 10.0917L5.32495 8.58335C5.10616 8.36456 4.80942 8.24164 4.5 8.24164C4.19058 8.24164 3.89383 8.36456 3.67504 8.58335L2.16667 10.0917V2.16667H13.8333V8.92506Z"
                                                fill="#6F7590"
                                            ></path>
                                            <path
                                                d="M5.5 6C5.91421 6 6.25 5.66421 6.25 5.25C6.25 4.83579 5.91421 4.5 5.5 4.5C5.08579 4.5 4.75 4.83579 4.75 5.25C4.75 5.66421 5.08579 6 5.5 6Z"
                                                fill="#6F7590"
                                            ></path>
                                        </g>
                                    </svg>
                                </span>

                                <span v-if="column.isEmojiIcon" class="ml-2">{{
                                    column.cmIconValue
                                }}</span>

                                <span v-if="column.isImageIcon" class="ml-2">
                                    <img
                                        :src="column.cmIconValue"
                                        alt=""
                                        class="object-contain w-full"
                                        :style="{ height: '13px' }"
                                    />
                                </span>
                            </span>
                        </template>
                    </template>
                    <template #bodyCell="{ text, column }">
                        <!-- Asset Details -->
                        <template v-if="column.key === 'details'">
                            <div class="flex flex-col">
                                <div class="flex items-center gap-1 pr-2">
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
                                        class="h-4 mr-1 mb-0.5"
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
                                <ClassificationPopover
                                    v-for="(classif, idx) in getClassification(
                                        text.slice(0, 2)
                                    )"
                                    :key="idx"
                                    :classification="classif"
                                    :mouse-enter-delay="mouseEnterDelay"
                                    @mouse-entered="enteredPill"
                                    @mouse-left="leftPill"
                                >
                                    <ClassificationPill
                                        :name="classif.name"
                                        :display-name="classif?.displayName"
                                        :is-propagated="isPropagated(classif)"
                                        :color="classif.options?.color"
                                        :allow-delete="false"
                                        :created-by="classif?.createdBy"
                                    />
                                </ClassificationPopover>

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
                                <GlossaryPopover
                                    v-for="(term, idx) in text.slice(0, 2)"
                                    :key="idx"
                                    :term="{ guid: term.termGuid }"
                                    :mouse-enter-delay="termMouseEnterDelay"
                                >
                                    <TermPill
                                        :term="term"
                                        :allow-delete="false"
                                        @mouseenter="termEnteredPill"
                                        @mouseleave="termLeftPill"
                                    />
                                </GlossaryPopover>
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

                        <!-- SQL -->
                        <template v-else-if="column.isSQL">
                            <div class="truncate">
                                {{ text || '--' }}
                            </div>
                            <div v-if="text" class="relative">
                                <span
                                    class="flex justify-end cursor-pointer text-new-blue-500"
                                    @click="
                                        () =>
                                            currrTruncatedSQL === text
                                                ? (currrTruncatedSQL = '')
                                                : (currrTruncatedSQL = text)
                                    "
                                    >{{
                                        currrTruncatedSQL === text
                                            ? 'hide'
                                            : 'see more'
                                    }}</span
                                >
                                <div
                                    v-if="currrTruncatedSQL === text"
                                    class="absolute right-0 z-50 p-3 overflow-scroll bg-white shadow-2xl max-h-40"
                                >
                                    {{ text }}
                                </div>
                            </div>
                        </template>

                        <template v-else>
                            <span>
                                {{ text || '--' }}
                            </span>
                        </template>
                    </template>
                </a-table>
            </div>

            <!-- Footer CTA -->
            <div class="flex justify-end w-full gap-x-4">
                <AtlanButton2
                    label="Close"
                    color="secondary"
                    @click="$emit('update:visible', false)"
                />

                <AtlanButton2
                    label="Download"
                    :disabled="columnsData.length === 0 || !isReady"
                    :loading="isLoading"
                    @click="downloadImpactedAssets"
                />
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    /** VUE */
    import { defineComponent, toRefs, watch, computed, ref } from 'vue'

    /** MODULES */
    import { message } from 'ant-design-vue'
    import { json2csv } from 'json-2-csv'
    import { whenever } from '@vueuse/core'

    /** COMPONENTS */
    import GlossaryPopover from '@common/popover/glossary/index.vue'
    import TermPill from '@/common/pills/term.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import ClassificationPopover from '@/common/popover/classification/index.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import { downloadFile } from '~/utils/library/download'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'

    /** COMPOSABLES */
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import useLineageService from '~/services/meta/lineage/lineage_service'
    import { AssetAttributes } from '~/constant/projection'
    import useCustomMetadata from '@/common/assets/preview/lineage/useCustomMetadata'

    /** UTILS */
    import {
        portsTypeNames,
        getSource,
        getSchema,
    } from '@/common/assets/profile/tabs/lineage/util.js'

    export default defineComponent({
        name: 'LineageImpactModal',
        components: {
            GlossaryPopover,
            TermPill,
            ClassificationPill,
            CertificateBadge,
            Tooltip,
            ClassificationPopover,
        },
        props: {
            guid: { type: String, required: true },
            visible: {
                type: Boolean,
                required: true,
            },
            isBaseOnGraph: {
                type: Boolean,
                required: false,
            },
        },
        emits: ['update:visible'],
        setup(props, { emit }) {
            const { guid, visible } = toRefs(props)
            const classificationPopoverMouseEnterDelay = ref(1)
            const currrTruncatedSQL = ref('')
            const { useFetchLineage } = useLineageService()
            const {
                ownerGroups,
                ownerUsers,
                certificateUpdatedAt,
                getConnectorImage,
                assetTypeLabel,
            } = useAssetInfo()
            const { classificationList, customMetadataProjections } =
                useTypedefData()
            const { getLineagePath, title } = useAssetInfo()

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
                return guid.value !== classification.entityGuid
            }

            const getTable = (entity) => {
                const item = entity.attributes.qualifiedName.split('/')
                if (item[0] === 'default') return item[3]
                return item[2]
            }

            const {
                data: downstreamData,
                isLoading,
                isReady,
                mutate: mutateDownstream,
                error,
            } = useFetchLineage(
                computed(() => ({
                    depth: 21,
                    direction: 'OUTPUT',
                    guid: guid.value,
                    hideProcess: true,
                    allowDeletedProcess: false,
                    attributes: [
                        ...AssetAttributes,
                        ...customMetadataProjections,
                    ],
                }))
            )

            const downstreamAssets = computed(() =>
                Object.values(downstreamData.value?.guidEntityMap || {}).filter(
                    (assetObj) => assetObj.guid !== guid.value
                )
            )

            const asset = computed(() =>
                Object.values(downstreamData.value?.guidEntityMap || {}).find(
                    (assetObj) => assetObj.guid === guid.value
                )
            )

            const assets = ref([])

            const columnsData = computed(() =>
                assets.value.map((entity, idx) => {
                    const hasCm = !!entity?.cm
                    const cm = {}
                    if (hasCm) {
                        entity.cm.forEach((cmDataObj) => {
                            const { cmNameDN, cmAttributeDN, cmValueDN } =
                                cmDataObj
                            const id = `${cmNameDN}.${cmAttributeDN}`
                            cm[id] = cmValueDN
                        })
                    }
                    return {
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
                            certificateStatus:
                                entity.attributes?.certificateStatus,
                            certificateUpdatedBy:
                                entity.attributes?.certificateUpdatedBy,
                            certificateUpdatedAt: certificateUpdatedAt(entity),
                            cm,
                        },
                        db: getTable(entity),
                        schema: getSchema(entity),

                        owners: [...ownerUsers(entity), ...ownerGroups(entity)],
                        classifications: entity.classificationNames,
                        terms: entity.meanings,
                        ...cm,
                    }
                })
            )

            const columns = ref([
                {
                    width: 300,
                    title: 'Name',
                    dataIndex: 'details',
                    key: 'details',
                    fixed: 'left',
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
            ])

            watch(isReady, () => {
                assets.value = [...downstreamAssets.value]

                const { assetGuidCMMap } = useCustomMetadata(
                    downstreamAssets.value
                )
                const cmColumns = {}

                const assetsWithCM = Object.keys(assetGuidCMMap)

                Object.values(assetGuidCMMap).forEach((cm) => {
                    cm.forEach((cmData) => {
                        const { cmAttributeDN } = cmData
                        if (!cmColumns[cmAttributeDN])
                            cmColumns[cmAttributeDN] = cmData
                    })
                })

                const cmColumnsSorted = Object.values(cmColumns)
                cmColumnsSorted.sort((a, b) => {
                    const nameA = a.cmNameDN.toUpperCase()
                    const nameB = b.cmNameDN.toUpperCase()
                    if (nameA < nameB) return -1
                    if (nameA > nameB) return 1
                    return 0
                })

                cmColumnsSorted.forEach((cmColumn) => {
                    const {
                        cmNameDN,
                        cmAttributeDN,
                        cmIcon,
                        isSQL,
                        isEmojiIcon,
                        isImageIcon,
                    } = cmColumn
                    const id = `${cmNameDN}.${cmAttributeDN}`

                    let cmEmojiHexa = ''
                    if (isEmojiIcon) {
                        const cmIconHex = cmIcon.codePointAt(0).toString(16)
                        cmEmojiHexa = String.fromCodePoint(`0x${cmIconHex}`)
                    }

                    let cmImageURL = ''
                    if (isImageIcon) {
                        cmImageURL = `${window.location.origin}/api/service/images/${cmIcon}?ContentDisposition=inline&name=${cmIcon}`
                    }

                    const obj = {
                        width: 250,
                        title: id,
                        dataIndex: id,
                        key: id,
                        cmNameDN,
                        cmAttributeDN,
                        isSQL,
                        isEmojiIcon,
                        isImageIcon,
                        cmIconValue: isEmojiIcon ? cmEmojiHexa : cmImageURL,
                        isCm: true,
                    }
                    columns.value.push(obj)
                })

                assets.value = assets.value.map((asset) => {
                    if (!assetsWithCM.includes(asset.guid)) return asset
                    return { ...asset, cm: assetGuidCMMap[asset.guid] }
                })
            })

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

                        Source: y.details.source,
                        Type: y.details.typeName,
                        Database: y.db,
                        Schema: y.schema,
                        Owners: y.owners,
                        Classifications: y.classifications,
                        Terms: y.terms.map((t) => t.termGuid),
                        ...y.details.cm,
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
                                `${title(asset.value)}_lineage_impact`
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
            const { mouseEnterDelay, enteredPill, leftPill } =
                useMouseEnterDelay()
            const {
                mouseEnterDelay: termMouseEnterDelay,
                enteredPill: termEnteredPill,
                leftPill: termLeftPill,
            } = useMouseEnterDelay()

            return {
                enteredPill,
                mouseEnterDelay,
                error,
                downloadImpactedAssets,
                getClassification,
                isPropagated,
                getConnectorImage,
                assetTypeLabel,
                isLoading,
                isReady,
                columnsData,
                columns,
                classificationPopoverMouseEnterDelay,
                termMouseEnterDelay,
                currrTruncatedSQL,
                termEnteredPill,
                termLeftPill,
                leftPill,
                getLineagePath,
                title,
                asset,
                portsTypeNames,
            }
        },
    })
</script>

<style lang="less" module>
    .impactTable {
        :global(.ant-table-body .ant-table-cell) {
            background-color: white;
        }
    }
</style>
