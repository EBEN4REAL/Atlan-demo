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
                    class="absolute flex flex-col items-center justify-center bg-white"
                    style="top: 0; left: 0; height: 80vh; width: 100%"
                >
                    <AtlanLoader class="h-10" />
                    <span class="mt-1 text-sm">Computing data...</span>
                </div>
            </div>
            <LineageGraph v-if="Object.keys(lineage.guidEntityMap).length" />
        </div>
    </div>
</template>

<script lang="ts">
    /** VUE */
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

    /** LIBS */
    import { message } from 'ant-design-vue'

    /** COMPONENTS */
    import LineageGraph from './lineageGraph.vue'
    import EmptyState from '~/components/common/empty/index.vue'

    /** STORE */
    import useAssetStore from '~/store/asset'

    /** API */
    import useLineageService from '~/services/meta/lineage/lineage_service'

    /** CONSTANTS */
    import { LineageAttributes } from '~/constant/projection'

    export default defineComponent({
        name: 'LineageIndex',
        components: { LineageGraph, EmptyState },
        emits: ['preview'],
        setup(_, { emit }) {
            /** INITIALIZE */
            const route = useRoute()
            const assetStore = useAssetStore()
            const { useFetchLineage } = useLineageService()

            /** DATA */
            const lineage: any = ref({})
            const guid = ref(route.params?.id || '')
            const depth = ref(1)
            const direction = ref('BOTH')
            const loaderText = ref('Fetching Data...')
            const initialLoad = ref(true)
            const baseEntityDataFromStore = ref(assetStore.getSelectedAsset)
            const selectedAsset = ref(null)
            const preferences = ref({
                showArrow: false,
                showSchema: true,
                showLegend: false,
            })
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

            /** METHODS */
            // useLineageService
            const { data, isLoading, isReady, mutate, error } =
                useFetchLineage(config)

            watch(data, async () => {
                lineage.value = { ...data.value }
                if (!data.value.relations.length) {
                    const { baseEntityGuid } = lineage.value
                    lineage.value.guidEntityMap = {
                        [baseEntityGuid]: baseEntityDataFromStore.value,
                    }
                }
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
            provide('lineage', lineage)
            provide('selectedAsset', selectedAsset)
            provide('preferences', preferences)
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
                initialLoad,
                isReady,
                error,
                emit,
            }
        },
    })
</script>
