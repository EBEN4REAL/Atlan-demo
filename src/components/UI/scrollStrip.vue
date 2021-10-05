<template>
    <div class="flex items-center">
        <button
            v-if="isOverflowing"
            class="w-8 h-8 p-2 group"
            @click="() => scrollWrapper?.scrollBy(-200, 0)"
        >
            <AtlanIcon
                icon="ChevronRight"
                class="text-gray-500 transform rotate-180  opacity-70 group-hover:opacity-100"
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
            class="w-8 h-8 p-2 group"
            @click="() => scrollWrapper?.scrollBy(200, 0)"
        >
            <AtlanIcon
                icon="ChevronRight"
                class="text-gray-500 opacity-70 group-hover:opacity-100"
            />
        </button>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, Ref, ref } from 'vue'
    export default defineComponent({
        name: 'ScrollStrip',
        emits: ['action'],
        setup(prop, { emit }) {
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
