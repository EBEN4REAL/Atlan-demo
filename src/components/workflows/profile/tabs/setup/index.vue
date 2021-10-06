<template>
    <div class="flex items-center justify-center w-full h-full text-2xl">
        Workflow Setup Tab
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, computed } from 'vue'

    export default defineComponent({
        name: 'WorkflowSetup',
        components: {},
        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            /** METHODS */

            return {
                assetData,
            }
        },
    })
</script>
