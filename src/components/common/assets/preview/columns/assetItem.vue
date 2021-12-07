<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div class="flex flex-col">
        <div
            class="flex items-start flex-1 px-3 py-1 transition-all duration-300 "
        >
            <div
                class="box-border flex flex-col flex-1 overflow-hidden gap-y-1"
            >
                <div
                    class="flex items-center justify-between mb-0 overflow-hidden "
                >
                    <div class="flex">
                        <component
                            :is="dataTypeCategoryImage(item)"
                            class="h-4 mr-1 mt-0.5 text-gray-500"
                        />
                        <span
                            @click="showColumnDrawer = true"
                            class="flex-shrink mr-1 overflow-hidden font-bold truncate cursor-pointer  text-md text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                        >
                            {{ title(item) }}
                        </span>
                        <CertificateBadge
                            v-if="certificateStatus(item)"
                            :status="certificateStatus(item)"
                            :username="certificateUpdatedBy(item)"
                            :timestamp="certificateUpdatedAt(item)"
                            class="mb-0.5"
                        ></CertificateBadge>
                    </div>
                    <div class="flex gap-x-2">
                        <div
                            v-if="
                                isPrimary(item) ||
                                isDist(item) ||
                                isPartition(item)
                            "
                            class="text-yellow-400"
                        >
                            <AtlanIcon
                                icon="PrimaryKey"
                                class="mr-1 mb-0.5"
                            ></AtlanIcon>
                            <span class="text-xs">Pkey</span>
                        </div>
                        <div v-if="isForeign(item)" class="text-pink-700">
                            <AtlanIcon
                                icon="ForeignKey"
                                class="mr-1 mb-0.5"
                            ></AtlanIcon>
                            <span class="text-xs">Fkey</span>
                        </div>
                    </div>
                </div>
                <Description
                    ref="descriptionRef"
                    v-model="localDescription"
                    @change="handleChangeDescription"
                    :selected-asset="item"
                />
                <div v-if="list?.length > 0" class="flex flex-wrap gap-x-1">
                    <template
                        v-for="classification in list"
                        :key="classification.guid"
                    >
                        <PopoverClassification :classification="classification">
                            <ClassificationPill
                                :name="classification.name"
                                :display-name="classification?.displayName"
                                :is-propagated="isPropagated(classification)"
                                :allow-delete="false"
                                :color="classification.options?.color"
                            ></ClassificationPill>
                        </PopoverClassification>
                    </template>
                </div>
            </div>
        </div>
        <AssetDrawer
            :data="item"
            :showDrawer="showColumnDrawer"
            @closeDrawer="handleCloseDrawer"
            @update="handleListUpdate"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, computed, watch } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'
    import Description from '@/common/input/description/index.vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { mergeArray } from '~/utils/array'
    import ClassificationPill from '@/common/pills/classification.vue'
    import PopoverClassification from '@/common/popover/classification.vue'

    export default defineComponent({
        name: 'ColumnListItem',
        components: {
            CertificateBadge,
            AssetDrawer,
            Description,
            ClassificationPill,
            PopoverClassification,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['update'],
        setup(props, { emit }) {
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
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
            } = useAssetInfo()

            const { item } = toRefs(props)

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
                if (!item?.value?.guid?.value) {
                    return false
                }
                if (item?.value?.guid === classification.entityGuid) {
                    return false
                }
                return true
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

            watch(shouldDrawerUpdate, () => emit('update', asset.value))

            return {
                title,
                getConnectorImage,
                assetType,
                dataType,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                isForeign,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                handleListUpdate,
                certificateStatusMessage,
                showColumnDrawer,
                handleCloseDrawer,
                localDescription,
                handleChangeDescription,
                descriptionRef,
                isPropagated,
                list,
            }
        },
    })
</script>
