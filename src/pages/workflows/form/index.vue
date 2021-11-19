<template>
    <Playground />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Playground from '~/components/workflows/formDemo.vue'

    export default defineComponent({
        name: 'FormPlaygroud',
        components: { Playground },
        setup() {
            return {}
        },
    })
</script>

<style scoped></style>
