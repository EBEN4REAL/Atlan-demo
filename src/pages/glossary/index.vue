<template>
    <div class="flex flex-col items-center w-full pt-5 mb-5">
        <span class="text-base">Business Glossary</span>
        <SearchWidget />
        <PopularTerms />
        <PopularGlossaries />
        <RecentlyViewed class="mt-12" />
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref } from 'vue'
    // components
    import SearchWidget from '@/glossary/home/searchWidget.vue'
    import PopularTerms from '@/glossary/home/popularTerms.vue'
    import PopularGlossaries from '@/glossary/home/popularGlossaries.vue'
    import RecentlyViewed from '@/glossary/home/recentlyViewedGtc.vue'
    // composables

    export default defineComponent({
        components: {
            SearchWidget,
            PopularTerms,
            PopularGlossaries,
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
