<template>
    <div class="relative w-full h-full">
        <div class="absolute flex items-center justify-center w-full h-full">
            <a-spin />
        </div>
        <div class="absolute w-full h-full">
            <LineageGraph v-if="!isLineageEmpty" :lineage="lineage" />
            <div
                v-else
                class="z-20 flex items-center justify-center w-full h-full bg-white "
            >
                LINEAGE IS EMPTY
            </div>
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
    } from 'vue'

    import { useRoute } from 'vue-router'

    // Components
    import LineageGraph from './lineageGraph.vue'

    import useLineageService from '~/services/atlas/lineage/lineage_service'

    export default defineComponent({
        name: 'Lineage',
        components: { LineageGraph },
        setup() {
            const route = useRoute()

            const lineage = ref({})
            const depth = ref(1)
            const direction = ref('BOTH')
            const guid = computed(() => route?.params?.id || '')
            const isLineageEmpty = ref(false)

            const { useFetchLineage } = useLineageService()

            const fetchLineage = () => {
                const { data } = useFetchLineage({
                    depth: depth.value,
                    guid: guid.value,
                    direction: direction.value,
                })

                watch(data, () => {
                    lineage.value = data.value
                    if (lineage.value.relations.length === 0)
                        isLineageEmpty.value = true
                })
            }

            const control = (type, item = null) => {
                if (type === 'depth') depth.value = item
                if (type === 'direction') direction.value = item
                if (type === 'reload') fetchLineage()
            }

            provide('depth', depth)
            provide('direction', direction)
            provide('control', control)

            watch([depth, direction], () => {
                fetchLineage()
            })

            onMounted(() => {
                fetchLineage()
            })

            return {
                lineage,
                isLineageEmpty,
            }
        },
    })
</script>
