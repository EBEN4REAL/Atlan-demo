<template>
    <FormDemo />
</template>

<script lang="ts">
    import { defineComponent, defineAsyncComponent } from 'vue'

    export default defineComponent({
        components: {
            FormDemo: defineAsyncComponent(
                () => import('@/workflows/formDemo.vue')
            ),
        },
    })
</script>
