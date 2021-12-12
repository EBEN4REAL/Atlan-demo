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
                @preview="emit('preview', $event)"
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
    import { useRoute, useRouter } from 'vue-router'
    import { whenever } from '@vueuse/core'

    // Libs
    import { message } from 'ant-design-vue'

    // Components
    import LineageGraph from './lineageGraph.vue'
    import EmptyState from '~/components/common/empty/index.vue'

    // Utils
    import useLineageService from '~/services/meta/lineage/lineage_service'
    import { useAPIPromise } from '~/services/api/useAPIPromise'
    import { map as entityMap } from '~/services/meta/entity/key'

    export default defineComponent({
        name: 'LineageIndex',
        components: { LineageGraph, EmptyState },
        emits: ['preview'],
        setup(_, { emit }) {
            const route = useRoute()
            const router = useRouter()

            /** DATA */
            const lineage = ref({})
            const depth = ref(1)
            const baseEntity = ref({})
            const guid = computed(() => route.params?.id || '')
            const direction = ref('BOTH')
            const selectedAssetGuid = ref('')
            const selectedAsset = ref({})
            const showProcess = ref(false)
            const loaderText = ref('Fetching Data...')
            const isFirstLoad = ref(true)
            const lineageDepths = [
                { id: 1, label: 'Depth 1' },
                { id: 2, label: 'Depth 2' },
                { id: 3, label: 'Depth 3' },
                { id: 21, label: 'Maximum Depth' },
            ]
            const lineageDirections = [
                { id: 'BOTH', label: 'Both' },
                { id: 'INPUT', label: 'Upstream' },
                { id: 'OUTPUT', label: 'Downstream' },
            ]

            const config = computed(() => ({
                depth: depth.value,
                guid: guid.value,
                direction: direction.value,
                hideProcess: true,
            }))

            /** METHODS */
            // getEntity
            const getEntity = async (guid: string) => {
                const { entity } = await useAPIPromise(
                    entityMap.GET_ENTITY({ guid }),
                    'GET',
                    {}
                )
                return entity
            }

            // useLineageService
            const { useFetchLineage } = useLineageService()
            const { data, isLoading, isReady, mutate, error } =
                useFetchLineage(config)

            watch(isReady, async () => {
                lineage.value = {}

                if (!data.value.relations.length) {
                    lineage.value = { ...data.value }

                    baseEntity.value = await getEntity(
                        lineage.value.baseEntityGuid
                    )

                    lineage.value.guidEntityMap = {
                        [lineage.value.baseEntityGuid]: baseEntity.value,
                    }
                } else lineage.value = data.value

                if (
                    selectedAssetGuid.value &&
                    data.value.guidEntityMap[selectedAssetGuid.value]
                )
                    selectedAsset.value =
                        data.value.guidEntityMap[selectedAssetGuid.value]
                else selectedAsset.value = baseEntity.value

                if (isFirstLoad.value) loaderText.value = 'Fetching Data...'
                isFirstLoad.value = false
            })

            // updateRouterQuery
            const updateRouterQuery = () => {
                router.replace({
                    query: {
                        depth: depth.value,
                        direction: direction.value,
                        showProcess: showProcess.value,
                        select: selectedAssetGuid.value,
                    },
                })
            }

            // Control
            const control = (type, item = null) => {
                if (['depth', 'direction', 'showProcess'].includes(type))
                    mutate()

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
                if (type === 'showProcess') {
                    loaderText.value = showProcess.value
                        ? 'Adding process nodes...'
                        : 'Removing process nodes...'
                    showProcess.value = item
                }
                if (type === 'selectedAsset') selectedAsset.value = item
                if (type === 'selectedAssetGuid') selectedAssetGuid.value = item

                updateRouterQuery()
            }

            /** LIFECYCLES */
            onMounted(() => {
                const {
                    depth: de,
                    direction: di,
                    select: se,
                    showProcess: sp,
                } = route.query
                if (de)
                    depth.value = [1, 2, 3, 21].includes(Number(de))
                        ? Number(de)
                        : depth.value
                if (di)
                    direction.value = ['both', 'input', 'output'].includes(
                        di.toLowerCase()
                    )
                        ? di
                        : direction.value
                if (se) selectedAssetGuid.value = se
                if (sp) showProcess.value = sp === 'true'
                updateRouterQuery()
            })

            /** PROVIDERS */
            provide('baseEntity', baseEntity)
            provide('selectedAssetGuid', selectedAssetGuid)
            provide('selectedAsset', selectedAsset)
            provide('showProcess', showProcess)
            provide('depth', depth)
            provide('direction', direction)
            provide('lineageDepths', lineageDepths)
            provide('lineageDirections', lineageDirections)
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
