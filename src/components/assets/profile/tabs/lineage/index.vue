<template>
    <div class="relative w-full h-full">
        <div
            v-if="isLoading"
            class="absolute flex items-center justify-center w-full h-full"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-10 animate-spin"
            ></AtlanIcon>
        </div>
        <div v-else-if="error" class="flex justify-center h-full items center">
            <EmptyScreen
                empty-screen="EmptyLineage"
                desc="Lineage could not be loaded"
                image-class="h-32"
            />
        </div>
        <div v-else-if="isReady" class="absolute w-full h-full overflow-hidden">
            <LineageGraph
                :is-lineage-empty="isLineageEmpty"
                :lineage="lineage"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        computed,
        ref,
        provide,
        watch,
        onMounted,
        ComputedRef,
    } from 'vue'

    import { useRoute } from 'vue-router'

    // Components
    import { message } from 'ant-design-vue'
    import LineageGraph from './lineageGraph.vue'
    import EmptyScreen from '@/common/empty/index.vue'

    import useLineageService from '~/services/meta/lineage/lineage_service'

    export default defineComponent({
        name: 'LineageTab',
        components: { LineageGraph, EmptyScreen },
        setup() {
            const route = useRoute()

            const lineage = ref({})
            const depth = ref(1)
            const direction = ref('BOTH')
            const guid = computed(() => route?.params?.id || '')
            const isLineageEmpty = ref(false)

            const { useFetchLineage } = useLineageService()

            const lineageOptions = computed(() => ({
                depth: depth.value,
                guid: guid.value,
                direction: direction.value,
            }))

            const { data, isLoading, reFetch, isReady, error } =
                useFetchLineage(lineageOptions)

            watch([data, error], () => {
                lineage.value = data.value
                isLineageEmpty.value = lineage.value.relations.length === 0
                if (error.value) {
                    const errMsg = error.value?.response?.data?.errorMessage
                    message.error({
                        key: 'error',
                        content: errMsg ?? 'Network Error',
                        duration: 2,
                    })
                }
            })

            const control = (type, item = null) => {
                if (type === 'depth') depth.value = item
                if (type === 'direction') direction.value = item
                if (type === 'reload') reFetch()
            }

            provide('depth', depth)
            provide('direction', direction)
            provide('control', control)

            watch([depth, direction], () => {
                reFetch()
            })

            onMounted(() => {
                reFetch()
            })

            return {
                isReady,
                error,
                isLoading,
                lineage,
                isLineageEmpty,
            }
        },
    })
</script>
