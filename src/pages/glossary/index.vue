<template>
    <div class="flex flex-col items-center w-full pt-5 mb-5">
        <SearchWidget />
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue'
    // components
    import SearchWidget from '@/glossary/home/searchWidget.vue'
    // composables

    export default defineComponent({
        components: {
            SearchWidget,
        },
        setup() {},
    })
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
