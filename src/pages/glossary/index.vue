<template>
    <p>Home</p>
    <!-- <div id="sidePanel" class="relative w-1/3">profile sidebar</div> -->
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref } from 'vue'
    import GlossaryPreview from '@/glossary/preview/glossaryPreview.vue'

    export default defineComponent({
        components: { GlossaryPreview },
        setup() {},
    })
</script>

<style scoped></style>
