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
    import { whenever } from '@vueuse/core'

    // Libs
    import { message } from 'ant-design-vue'

    // Components
    import LineageGraph from './lineageGraph.vue'
    import EmptyState from '~/components/common/empty/index.vue'

    // Store
    import useAssetStore from '~/store/asset'

    // API
    import useLineageService from '~/services/meta/lineage/lineage_service'

    // Constants
    import { LineageAttributes } from '~/constant/projection'

    export default defineComponent({
        name: 'LineageIndex',
        components: { LineageGraph, EmptyState },
        emits: ['preview'],
        setup(_, { emit }) {
            /** INITIALIZE */
            const route = useRoute()
            const assetStore = useAssetStore()

            /** DATA */
            const lineage: any = ref({})
            const baseEntity = ref({})
            const guid = ref(route.params?.id || '')

            const depth = ref(1)
            const direction = ref('BOTH')

            const loaderText = ref('Fetching Data...')
            const initialLoad = ref(true)
            const selectedAsset = ref(assetStore.getSelectedAsset)

            const config = computed(() => ({
                depth: depth.value,
                guid: guid.value,
                direction: direction.value,
                hideProcess: true,
                entityFilters: {
                    attributeName: '__state',
                    operator: 'eq',
                    attributeValue: 'ACTIVE',
                },
                attributes: LineageAttributes,
            }))
            const preferences = ref({ showArrow: false })

            /** METHODS */
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
                } else lineage.value = { ...data.value }

                const { guidEntityMap, baseEntityGuid } = lineage.value
                baseEntity.value = guidEntityMap[baseEntityGuid]
            })

            // Control
            const control = (type, item = null) => {
                if (type === 'selectedAsset') selectedAsset.value = item
            }

            /** LIFECYCLES */
            onMounted(() => {
                initialLoad.value = false
                mutate()
            })

            /** PROVIDERS */
            provide('baseEntity', baseEntity)
            provide('selectedAsset', selectedAsset)
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
