<template>
    <div class="flex scroll-container">
        <div class="flex flex-col w-full h-full pt-6 pl-4 overflow-y-hidden">
            <div class="inline-flex items-center">
                <span v-if="title" class="mb-2 mr-2 text-2xl">{{ title }}</span>
                <span
                    v-if="badge"
                    class="self-start px-2 py-1 text-sm text-blue-500 rounded bg-blue-50"
                    >{{ badge }}</span
                >
            </div>
            <span v-if="subTitle" class="text-sm text-gray">{{
                subTitle
            }}</span>
            <div v-if="$slots.header" class="my-3">
                <slot name="header"></slot>
            </div>
            <div class="h-full pb-4 overflow-y-auto"><slot /></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'DefaultLayout',
        props: { title: String, subTitle: String, badge: String },
    })
</script>

<style scoped>
    .scroll-container {
        @apply overflow-y-auto;
        height: calc(100vh - 2.5rem);
    }
</style>
