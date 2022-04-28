<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="flex flex-col pb-0.5"
        @mouseenter="showLineageGraphButton = true"
        @mouseleave="showLineageGraphButton = false"
    >
        <div class="flex items-start flex-1 px-3 transition-all duration-300">
            <div
                class="box-border flex flex-col flex-1 overflow-hidden gap-y-1"
            >
                <div
                    class="flex flex-wrap items-center justify-between mb-0 overflow-hidden"
                >
                    <div
                        class="flex items-center"
                        :class="dataTypeCategoryImage(item) ? '' : 'w-full'"
                    >
                        <component
                            :is="dataTypeCategoryImage(item)"
                            class="h-4 mr-1 text-gray-500 mb-0.5"
                        />

                        <Tooltip
                            :tooltip-text="`${title(item)}`"
                            classes="
                                   font-bold cursor-pointer text-md text-primary hover:underline  "
                            @click="showColumnDrawer = true"
                        />
                        <CertificateBadge
                            v-if="certificateStatus(item)"
                            :status="certificateStatus(item)"
                            :username="certificateUpdatedBy(item)"
                            :timestamp="certificateUpdatedAt(item)"
                            class="mb-0.5 ml-1"
                        ></CertificateBadge>
                        <a-tooltip placement="right"
                            ><template #title>Limited Access</template>
                            <AtlanIcon
                                v-if="isScrubbed(item)"
                                icon="Lock"
                                class="h-3.5 ml-1 mb-0.5"
                            ></AtlanIcon
                        ></a-tooltip>
                        <div
                            v-if="
                                item?.attributes?.__hasLineage &&
                                !isLineageRoute
                            "
                            class="ml-1"
                        >
                            <a-tooltip placement="top"
                                ><template #title>Lineage Exists</template>
                                <AtlanIcon
                                    icon="LineageSmall"
                                    class="w-4 h-4 cursor-pointer mb-0.5 ml-2 text-gray-400"
                                ></AtlanIcon>
                            </a-tooltip>
                        </div>
                        <div
                            v-if="
                                item?.attributes?.__hasLineage &&
                                showLineageGraphButton &&
                                isLineageRoute
                            "
                            class="ml-4"
                        >
                            <a-tooltip placement="top"
                                ><template #title
                                    >View Lineage In Graph</template
                                >
                                <AtlanIcon
                                    icon="Play"
                                    class="w-4 h-4 my-auto text-gray-500 outline-none cursor-pointer"
                                    @click="setPortToSelect(item)"
                                ></AtlanIcon>
                            </a-tooltip>
                        </div>
                    </div>
                    <div class="flex ml-1 gap-x-2">
                        <ColumnKeys
                            :is-primary="isPrimary(item)"
                            :is-foreign="isForeign(item)"
                            :is-partition="isPartition(item)"
                            :is-sort="isSort(item)"
                            :is-indexed="isIndexed(item)"
                        />
                    </div>
                </div>
                <Description
                    ref="descriptionRef"
                    v-model="localDescription"
                    :selected-asset="item"
                    :edit-permission="selectedAssetUpdatePermission(item, true)"
                    @change="handleChangeDescription"
                />
                <transition
                    v-if="similarList?.length > 0 && !localDescription"
                    name="fade"
                >
                    <Suggestion
                        class="mb-1"
                        :button-between="false"
                        :edit-permission="
                            selectedAssetUpdatePermission(item, true)
                        "
                        :list="similarList"
                        @apply="handleApplySuggestion"
                    ></Suggestion>
                </transition>
                <div v-if="list?.length > 0" class="flex flex-wrap gap-1">
                    <template
                        v-for="classification in list"
                        :key="classification.guid"
                    >
                        <PopoverClassification
                            :classification="classification"
                            :entity-guid="item?.guid"
                            :mouse-enter-delay="mouseEnterDelay"
                            @mouse-entered="enteredPill"
                            @mouse-left="leftPill"
                        >
                            <ClassificationPill
                                :name="classification.name"
                                :display-name="classification?.displayName"
                                :is-propagated="isPropagated(classification)"
                                :allow-delete="false"
                                :color="
                                    classification.options?.color?.toLowerCase()
                                "
                                :created-by="classification?.createdBy"
                            ></ClassificationPill>
                        </PopoverClassification>
                    </template>
                </div>
            </div>
        </div>
        <hr class="mx-3" :class="list?.length > 0 ? 'mt-3' : 'mt-2'" />
        <AssetDrawer
            :guid="item?.guid"
            :show-drawer="showColumnDrawer"
            :show-mask="page === 'assets'"
            :show-close-btn="page !== 'assets'"
            @closeDrawer="handleCloseDrawer"
            @update="handleListUpdate"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        computed,
        watch,
        defineAsyncComponent,
        inject,
    } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import { useRoute } from 'vue-router'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import Description from '@/common/input/description/index.vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { mergeArray } from '~/utils/array'
    import ClassificationPill from '@/common/pills/classification.vue'
    import PopoverClassification from '@/common/popover/classification/index.vue'
    import ColumnKeys from '~/components/common/column/columnKeys.vue'
    import Suggestion from '@/common/assets/preview/info/suggestion.vue'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'
    import useLineageStore from '~/store/lineage'

    export default defineComponent({
        name: 'ColumnListItem',
        components: {
            CertificateBadge,
            Description,
            ClassificationPill,
            ColumnKeys,
            Tooltip,
            Suggestion,
            PopoverClassification,
            AssetDrawer: defineAsyncComponent(
                () => import('@/common/assets/preview/drawer.vue')
            ),
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            similarList: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['update'],
        setup(props, { emit }) {
            const lineageStore = useLineageStore()

            const setPortToSelect = (item) => {
                lineageStore.setPortToSelect(item)
            }

            const showLineageGraphButton = ref(false)

            const route = useRoute()

            const isLineageRoute = computed(
                () => route.params.tab === 'lineage'
            )

            const {
                title,
                getConnectorImage,
                assetType,
                isForeign,
                dataType,
                classifications,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                isSort,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                selectedAssetUpdatePermission,
                isScrubbed,
                isIndexed,
            } = useAssetInfo()

            const { item } = toRefs(props)

            const page = inject('sidebarPage')

            const {
                localDescription,
                handleChangeDescription,
                descriptionRef,
                shouldDrawerUpdate,
                asset,
            } = updateAssetAttributes(item, true) // true - for not updating the selectedAsset in store

            const showColumnDrawer = ref(false)

            const handleCloseDrawer = () => {
                showColumnDrawer.value = false
            }

            const handleListUpdate = (asset) => {
                emit('update', asset)
            }

            const { classificationList } = useTypedefData()

            const isPropagated = (classification) => {
                if (!item?.value?.guid) {
                    return false
                }
                return item?.value?.guid !== classification.entityGuid
            }

            const list = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList.value,
                    classifications(item.value),
                    'name',
                    'typeName'
                )
                return matchingIdsResult
            })

            const handleApplySuggestion = (obj) => {
                localDescription.value = obj.value
                handleChangeDescription()
            }

            watch(shouldDrawerUpdate, () => {
                if (shouldDrawerUpdate.value) {
                    emit('update', asset.value)
                    shouldDrawerUpdate.value = false
                }
            })
            const { mouseEnterDelay, enteredPill, leftPill } =
                useMouseEnterDelay()

            return {
                title,
                getConnectorImage,
                assetType,
                dataType,
                handleApplySuggestion,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                isForeign,
                isSort,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                handleListUpdate,
                certificateStatusMessage,
                showColumnDrawer,
                handleCloseDrawer,
                localDescription,
                handleChangeDescription,
                page,
                descriptionRef,
                isPropagated,
                selectedAssetUpdatePermission,
                isScrubbed,
                list,
                isIndexed,
                mouseEnterDelay,
                enteredPill,
                setPortToSelect,
                showLineageGraphButton,
                isLineageRoute,
                leftPill,
            }
        },
    })
</script>
