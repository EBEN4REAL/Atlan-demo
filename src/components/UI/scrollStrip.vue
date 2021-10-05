<template>
    <div class="flex items-center">
        <button
            v-if="isOverflowing"
            class="w-8 h-8 p-2 opacity-70 hover:opacity-100"
            @click="() => scrollWrapper?.scrollBy(-200, 0)"
        >
            <AtlanIcon
                icon="ChevronRight"
                class="text-gray-500 transform rotate-180"
            />
        </button>
        <div
            ref="scrollWrapper"
            class="flex items-center overflow-x-auto  flex-nowrap gap-x-2 hidden-scroll"
            style="scroll-behavior: smooth"
        >
            <slot></slot>
        </div>
        <button
            v-if="isOverflowing"
            class="w-8 h-8 p-2 opacity-70 hover:opacity-100"
            @click="() => scrollWrapper?.scrollBy(200, 0)"
        >
            <AtlanIcon icon="ChevronRight" class="text-gray-500" />
        </button>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, Ref, ref } from 'vue'
    export default defineComponent({
        name: 'ScrollStrip',
        setup() {
            const scrollWrapper: Ref<HTMLElement | null> = ref(null)

            const isOverflowing = computed(
                () =>
                    (scrollWrapper.value?.scrollWidth || 0) >
                    (scrollWrapper.value?.clientWidth || 0)
            )
            return { scrollWrapper, isOverflowing }
        },
    })
</script>
<style scoped>
    .hidden-scroll::-webkit-scrollbar {
        height: 0 !important;
        width: 0 !important;
    }
    .hidden-scroll {
        overflow: -moz-scrollbars-none;
        scrollbar-width: none;
    }
</style>
