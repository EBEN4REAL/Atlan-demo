<template>Setup</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, computed } from 'vue'

    // Components

    // Composables

    export default defineComponent({
        name: 'WorkflowBuilder',
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
