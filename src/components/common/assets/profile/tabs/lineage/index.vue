<template>
    <div class="relative w-full bg-white">
        <div
            v-if="initialLoad || isLoading || error"
            class="absolute flex items-center justify-center w-full bg-white"
            style="height: 80vh"
        >
            <div
                v-if="isLoading || initialLoad"
                class="flex flex-col items-center justify-center"
            >
                <AtlanLoader class="h-10" />
                <span class="mt-1 text-sm">{{ loaderText }}</span>
            </div>
            <div v-if="error">
                <EmptyState
                    desc="You can send this info to us."
                    headline="Oops! Something went wrong"
                    empty-screen="SomethingWrong"
                />
            </div>
        </div>

        <div v-if="isReady" class="absolute w-full h-full">
            <div
                v-if="!Object.keys(lineage.guidEntityMap).length"
                class="relative bg-white"
            >
                <div
                    class="absolute flex items-center justify-center bg-white"
                    style="top: 0; left: 0; height: 80vh; width: 100%"
                >
                    <a-spin tip="Computing data..." />
                </div>
            </div>
            <LineageGraph
                v-if="Object.keys(lineage.guidEntityMap).length"
                :lineage="lineage"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        watch,
        defineComponent,
        computed,
        ref,
        provide,
        onMounted,
    } from 'vue'
    import { useRoute } from 'vue-router'
    import { whenever, watchOnce } from '@vueuse/core'

    // Libs
    import { message } from 'ant-design-vue'

    // Components
    import LineageGraph from './lineageGraph.vue'
    import EmptyState from '~/components/common/empty/index.vue'

    // Store
    import useAssetStore from '~/store/asset'

    // API
    import useLineageService from '~/services/meta/lineage/lineage_service'

    // Utils
    import {
        getNodeTypeText,
        nonBiTypes,
        childParentBiAssetMap,
        childGroupBiAssetMap,
        parentChildrenBiAssetArr,
    } from './util.js'
    import { pluralizeString } from '~/utils/string'

    // Constants
    import {
        AssetRelationAttributes,
        LineageAttributes,
    } from '~/constant/projection'

    // Composables
    import { useRelations } from '~/composables/discovery/useRelations'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import useFetchAssetList from '~/components/common/assetList/usefetchAssetList'

    export default defineComponent({
        name: 'LineageIndex',
        components: { LineageGraph, EmptyState },
        emits: ['preview'],
        setup(_, { emit }) {
            /** INITIALIZE */
            const route = useRoute()
            const assetStore = useAssetStore()
            const { customMetadataProjections } = useTypedefData()

            /** DATA */
            const lineage: any = ref({})
            const computedLineage = ref(null)
            const depth = ref(1)
            const baseEntity = ref({})
            const baseEntityRelData = ref({})
            const guid = ref(route.params?.id || '')
            const direction = ref('BOTH')
            const hideProcess = ref(true)
            const loaderText = ref('Fetching Data...')
            const initialLoad = ref(true)
            const selectedAsset = ref(assetStore.getSelectedAsset)
            const relatedBiAssets = ref([])
            const lineageDepths = [
                { id: 1, label: 'Depth 1' },
                { id: 2, label: 'Depth 2' },
                { id: 3, label: 'Depth 3' },
                { id: 21, label: 'Max. Depth' },
            ]
            const lineageDirections = [
                { id: 'BOTH', label: 'Both Direction' },
                { id: 'INPUT', label: 'Upstream' },
                { id: 'OUTPUT', label: 'Downstream' },
            ]
            const config = computed(() => ({
                depth: depth.value,
                guid: guid.value,
                direction: direction.value,
                hideProcess: hideProcess.value,
                entityFilters: {
                    attributeName: '__state',
                    operator: 'eq',
                    attributeValue: 'ACTIVE',
                },
                attributes: LineageAttributes,
            }))
            const preferences = ref({ showArrow: false })

            /** METHODS */
            // addRelatedBiAssetToLineage
            const addRelatedBiAssetToLineage = (data, entity) => {
                if (!computedLineage.value) computedLineage.value = { ...data }

                const parentGuid = computedLineage.value.baseEntityGuid

                computedLineage.value.childrenCounts = {
                    ...computedLineage.value.childrenCounts,
                    [entity.guid]: { OUTPUT: 0 },
                }
                computedLineage.value.guidEntityMap = {
                    ...computedLineage.value.guidEntityMap,
                    [entity.guid]: entity,
                }
                const relationExist = computedLineage.value.relations.find(
                    (x) => {
                        if (
                            x.fromEntityId === parentGuid &&
                            x.toEntityId === entity.guid
                        )
                            return true
                    }
                )
                if (relationExist) return
                if (parentGuid === entity.guid) return

                computedLineage.value.relations.push({
                    fromEntityId: parentGuid,
                    processId: 'related',
                    toEntityId: entity.guid,
                    type: 'related',
                })
            }

            // computeLineageForParentBiAsset
            const computeLineageForParentBiAsset = (data) => {
                if (!data.relations.length)
                    addRelatedBiAssetToLineage(data, baseEntityRelData.value)

                let parentGuidObj = {}

                relatedBiAssets.value.forEach((x, index) => {
                    if (childGroupBiAssetMap[x.typeName]) {
                        const parentGuid =
                            x.attributes[childGroupBiAssetMap[x.typeName]].guid

                        if (parentGuidObj[parentGuid])
                            parentGuidObj[parentGuid].push(x)
                        else
                            parentGuidObj = {
                                ...parentGuidObj,
                                [parentGuid]: [x],
                            }
                    }
                })

                Object.entries(parentGuidObj).forEach(([k, v]) => {
                    const typeNames = v.map((x) => x.typeName)
                    const typeNamesUnique = [...new Set(typeNames)]

                    typeNamesUnique.forEach((xxx) => {
                        const entity = v.find((x) => x.typeName === xxx)
                        const length = v.filter(
                            (x) => x.typeName === xxx
                        ).length

                        if (length > 1)
                            entity.typeCount = `${pluralizeString(
                                getNodeTypeText[entity.typeName],
                                length
                            )}`
                        addRelatedBiAssetToLineage(data, entity)
                    })
                })

                return computedLineage.value
            }

            // computeLineageForChildBiAsset
            const computeLineageForChildBiAsset = (data) => {
                if (
                    !data.relations.length &&
                    data.baseEntityGuid !== selectedAsset.value.guid
                ) {
                    const childParent = relatedBiAssets.value.find(
                        (v) =>
                            childParentBiAssetMap[
                                selectedAsset.value.typeName
                            ] === v.typeName
                    )
                    addRelatedBiAssetToLineage(data, childParent)
                }

                addRelatedBiAssetToLineage(data, selectedAsset.value)
                computedLineage.value.baseEntityGuid = selectedAsset.value.guid

                if (
                    parentChildrenBiAssetArr.includes(
                        selectedAsset.value.typeName
                    )
                )
                    lineage.value = computeLineageForParentBiAsset(data)

                return computedLineage.value
            }

            // useLineageService
            const { useFetchLineage } = useLineageService()
            const { data, isLoading, isReady, mutate, error } =
                useFetchLineage(config)

            watch(data, async () => {
                if (childParentBiAssetMap[selectedAsset.value.typeName])
                    lineage.value = computeLineageForChildBiAsset(data.value)
                else if (
                    parentChildrenBiAssetArr.includes(
                        selectedAsset.value.typeName
                    )
                )
                    lineage.value = computeLineageForParentBiAsset(data.value)
                else if (!data.value.relations.length) {
                    lineage.value = { ...data.value }
                    const { baseEntityGuid } = lineage.value
                    baseEntity.value = selectedAsset.value
                    lineage.value.guidEntityMap = {
                        [baseEntityGuid]: baseEntity.value,
                    }
                } else lineage.value = { ...data.value }

                const { guidEntityMap, baseEntityGuid } = lineage.value
                baseEntity.value = guidEntityMap[baseEntityGuid]
            })

            // Control
            const control = (type, item = null) => {
                if (type === 'depth') {
                    loaderText.value = `Changing lineage to ${
                        lineageDepths.find((x) => x.id === item)?.label
                    }...`
                    depth.value = item
                }
                if (type === 'direction') {
                    loaderText.value = `Changing lineage direction to ${
                        lineageDirections.find((x) => x.id === item)?.label
                    }...`
                    direction.value = item
                }
                if (type === 'selectedAsset') selectedAsset.value = item
                if (['depth', 'direction'].includes(type)) mutate()
            }

            // getChildBiAssetParentGuid
            const getChildBiAssetParentGuid = (entity) => {
                let parentGuid = ''
                relatedBiAssets.value.forEach((v) => {
                    if (childParentBiAssetMap[entity.typeName] === v.typeName)
                        parentGuid = v.guid
                })
                console.log('relatedBiAssets:', relatedBiAssets.value)
                console.log('parentGuid:', parentGuid)
                return parentGuid
            }

            /** LIFECYCLES */
            onMounted(() => {
                const { typeName } = selectedAsset.value
                if (nonBiTypes.includes(typeName)) {
                    mutate()
                    return
                }
                const childBiAssetArr = Object.keys(childParentBiAssetMap)
                const { data: relData, guidList } = useRelations(selectedAsset)
                const limit = ref(20)
                const offset = ref(0)
                const aggregations = ref(['typeName'])
                const isCache = ref(false)
                const relationAttributes = ref([...AssetRelationAttributes])
                const dependentKey = ref('relatedBiAssets')
                const postFilters = ref({
                    typeName: '__all',
                })
                const defaultAttributes = ref(LineageAttributes)

                watchOnce(relData, () => {
                    const filters = ref({
                        guidList: guidList.value,
                    })
                    const { list } = useFetchAssetList({
                        offset,
                        limit,
                        facets: filters,
                        postFacets: postFilters,
                        aggregations,
                        isCache,
                        dependentKey,
                        attributes: defaultAttributes,
                        relationAttributes,
                        suppressLogs: true,
                    })

                    watchOnce(list, () => {
                        relatedBiAssets.value = list.value
                        baseEntityRelData.value = relData.value?.entities[0]

                        const entity = relData.value?.entities[0]

                        if (childBiAssetArr.includes(typeName)) {
                            const parentGuid = getChildBiAssetParentGuid(entity)
                            if (parentGuid) guid.value = parentGuid
                        }

                        initialLoad.value = false
                        mutate()
                    })
                })
            })

            /** PROVIDERS */
            provide('baseEntity', baseEntity)
            provide('selectedAsset', selectedAsset)
            provide('depth', depth)
            provide('direction', direction)
            provide('lineageDepths', lineageDepths)
            provide('lineageDirections', lineageDirections)
            provide('config', config)
            provide('control', control)
            provide('preferences', preferences)

            /** WATCHERS */
            whenever(error, () => {
                message.error(
                    `${error.value?.response?.status}: Something went wrong. Please try again`
                )
            })

            return {
                lineage,
                data,
                loaderText,
                isLoading,
                initialLoad,
                isReady,
                error,
                emit,
            }
        },
    })
</script>
