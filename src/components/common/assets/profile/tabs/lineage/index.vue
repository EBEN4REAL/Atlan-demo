<template>
    <div class="relative w-full h-screen bg-white">
        <div
            class="absolute flex items-center justify-center w-full"
            style="height: 80vh"
        >
            <div v-if="isLoading">
                <a-spin tip="Loading Graph..." />
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
            <LineageGraph :lineage="data" @preview="emit('preview', $event)" />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, ref, provide } from 'vue'
    import { useRoute } from 'vue-router'
    import { whenever } from '@vueuse/core'
    import { message } from 'ant-design-vue'

    // Components
    import LineageGraph from './lineageGraph.vue'
    import EmptyState from '~/components/common/empty/index.vue'

    // Utils
    import useLineageService from '~/services/meta/lineage/lineage_service'

    export default defineComponent({
        name: 'LineageIndex',
        components: { LineageGraph, EmptyState },
        emits: ['preview'],
        setup(_, { emit }) {
            const route = useRoute()

            /** DATA */
            const depth = ref(1)
            const guid = computed(() => route?.params?.id || '')
            const direction = ref('BOTH')
            const config = computed(() => ({
                depth: depth.value,
                guid: guid.value,
                direction: direction.value,
            }))

            /** METHODS */
            // useLineageService
            const { useFetchLineage } = useLineageService()
            const { data, isLoading, isReady, mutate, error } =
                useFetchLineage(config)

            // Control
            const control = (type, item = null) => {
                if (type === 'depth') depth.value = item
                if (type === 'direction') direction.value = item
                mutate()
            }

            /** PROVIDERS */
            provide('depth', depth)
            provide('direction', direction)
            provide('control', control)

            /** WATCHERS */
            whenever(error, () => {
                message.error(
                    `${error.value?.response?.status}: Something went wrong. Please try again`
                )
            })

            return {
                data,
                isLoading,
                isReady,
                error,
                emit,
            }
        },
    })
</script>
