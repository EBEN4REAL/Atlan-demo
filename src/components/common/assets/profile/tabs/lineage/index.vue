<template>
    <div class="relative w-full bg-white">
        <div
            v-if="isLoading || error"
            class="absolute flex items-center justify-center w-full bg-white"
            style="height: 80vh"
        >
            <div v-if="isLoading">
                <a-spin :tip="loaderText" />
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
    import { whenever } from '@vueuse/core'

    // Libs
    import { message } from 'ant-design-vue'

    // Components
    import LineageGraph from './lineageGraph.vue'
    import EmptyState from '~/components/common/empty/index.vue'

    // Store
    import useAssetStore from '~/store/asset'

    // Utils
    import useLineageService from '~/services/meta/lineage/lineage_service'

    // Constants
    import {
        AssetAttributes,
        BasicSearchAttributes,
        SQLAttributes,
        AssetRelationAttributes,
    } from '~/constant/projection'

    // Composables
    import { useRelations } from '~/composables/discovery/useRelations'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

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
            const lineage = ref({})
            const depth = ref(1)
            const baseEntity = ref({})
            const guid = ref(route.params?.id || '')
            const direction = ref('BOTH')
            const hideProcess = ref(true)
            const loaderText = ref('Fetching Data...')
            const isFirstLoad = ref(true)
            const selectedAsset = ref(assetStore.getSelectedAsset)
            const biAssetNoLinMap = {
                PowerBIReport: 'dataset',
                LookerTile: 'query',
            }
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
                attributes: [
                    ...AssetAttributes,
                    ...SQLAttributes,
                    ...AssetRelationAttributes,
                    ...BasicSearchAttributes,
                    ...customMetadataProjections,
                ],
            }))

            /** METHODS */
            // computeLineageForBiAssetNoLin
            const computeLineageForBiAssetNoLin = (data) => {
                const computedLineage = { ...data }
                const { childrenCounts, guidEntityMap } = computedLineage
                const parentGuid = computedLineage.baseEntityGuid
                computedLineage.baseEntityGuid = selectedAsset.value.guid
                computedLineage.childrenCounts = {
                    ...childrenCounts,
                    [selectedAsset.value.guid]: { OUTPUT: 0 },
                }
                computedLineage.guidEntityMap = {
                    ...guidEntityMap,
                    [selectedAsset.value.guid]: selectedAsset.value,
                }
                computedLineage.relations.push({
                    fromEntityId: parentGuid,
                    processId: 'processId',
                    toEntityId: selectedAsset.value.guid,
                    type: 'related',
                })

                return computedLineage
            }

            // useLineageService
            const { useFetchLineage } = useLineageService()
            const { data, isLoading, isReady, mutate, error } =
                useFetchLineage(config)

            watch(data, async () => {
                if (!data.value.relations.length) {
                    lineage.value = { ...data.value }
                    const { baseEntityGuid } = lineage.value
                    baseEntity.value = selectedAsset.value
                    lineage.value.guidEntityMap = {
                        [baseEntityGuid]: baseEntity.value,
                    }
                }

                lineage.value = biAssetNoLinMap[selectedAsset.value.typeName]
                    ? computeLineageForBiAssetNoLin(data.value)
                    : data.value

                const { guidEntityMap, baseEntityGuid } = lineage.value
                baseEntity.value = guidEntityMap[baseEntityGuid]

                if (isFirstLoad.value) loaderText.value = 'Fetching Data...'
                isFirstLoad.value = false
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

            // getBiAssetNoLinParentGuid
            const getBiAssetNoLinParentGuid = (entity) => {
                let parentGuid = ''
                Object.entries(entity.attributes).forEach(([key, value]) => {
                    if (key === biAssetNoLinMap[entity.typeName])
                        parentGuid = value.guid
                })
                return parentGuid
            }

            /** LIFECYCLES */
            onMounted(() => {
                const biAssetNoLinArr = Object.keys(biAssetNoLinMap)
                const { data: relData } = useRelations(selectedAsset)
                watch(relData, () => {
                    const entity = relData.value?.entities[0]
                    const { typeName } = selectedAsset.value

                    if (biAssetNoLinArr.includes(typeName))
                        guid.value = getBiAssetNoLinParentGuid(entity)

                    mutate()
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
                isReady,
                error,
                emit,
            }
        },
    })
</script>
