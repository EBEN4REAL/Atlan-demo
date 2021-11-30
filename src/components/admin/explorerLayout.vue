<template>
    <div class="flex divide-x scroll-container">
        <aside class="flex flex-col w-1/4 h-full overflow-y-hidden pt-7">
            <div class="flex items-center justify-between px-4 mb-2">
                <span class="text-2xl">{{ title }}</span>
                <slot name="action"></slot>
            </div>
            <span v-if="subTitle" class="px-4 mb-0 text-sm text-gray">{{
                subTitle
            }}</span>
            <slot name="sidebar"></slot>
        </aside>

        <div class="flex flex-col w-3/4 h-full pt-6 pb-4 overflow-y-hidden">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    /**
     * Explorer Layout - Has a sidebar and a main view with overflow handled.
     * Main content comes in the default slot.
     * Sidebar comes in the `sidebar` slot.
     * Use the `action` slot to add any optional button beside the title.
     */
    export default defineComponent({
        name: 'ExplorerLayout',
        props: { title: String, subTitle: String },
    })
</script>

<style scoped>
    .scroll-container {
        @apply overflow-y-auto;
        height: calc(100vh - 2.5rem); /** Should be 2.5rem */
    }
</style>
