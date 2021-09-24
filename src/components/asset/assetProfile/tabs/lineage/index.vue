<template>
    <div>
        Lineage 
        <!-- <component :is="'lineageGraph'" class="bg-transparent"></component> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue'

    export default defineComponent({
        name: 'Lineage',
        components: {
            // lineageGraph: defineAsyncComponent(
            //     () =>
            //         import('@/asset/assetProfile/tabs/lineage/lineageGraph.vue')
            // ),
        },
    })
</script>
