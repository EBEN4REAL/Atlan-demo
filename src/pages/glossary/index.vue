<template>
    <div class="flex flex-col items-center w-full pt-5 mb-5">
        <SearchWidget />
        <PopularTerms />
        <RecentlyViewed />
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue'
    // components
    import SearchWidget from '@/glossary/home/searchWidget.vue'
    import PopularTerms from '@/glossary/home/popularTerms.vue'
    import RecentlyViewed from '@/glossary/home/recentlyViewedGtc.vue'
    // composables

    export default defineComponent({
        components: {
            SearchWidget,
            PopularTerms,
            RecentlyViewed,
        },
        setup() {},
    })
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
