<template>
    <Integrations />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Integrations from '@/integrations/wrapper.vue'

    export default defineComponent({
        name: 'IntegrationPage',
        components: { Integrations },
        setup() {
            return {}
        },
    })
</script>

<style scoped></style>
