<template>
    <div class="flex scroll-container">
        <div
            class="flex flex-col w-full h-full px-4 pt-6 overflow-y-hidden bg-gray-100 "
        >
            <span class="mb-2 text-2xl">{{ title }}</span>
            <span v-if="subTitle" class="mb-0 text-sm text-gray">{{
                subTitle
            }}</span>
            <slot name="header"></slot>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'DefaultLayout',
        props: { title: String, subTitle: String },
    })
</script>

<style scoped>
    .scroll-container {
        @apply overflow-y-auto;
        height: calc(100vh - 3rem);
    }
</style>
