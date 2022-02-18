<template>
    <div class="bg-white rounded-lg shadow" style="">
        <div class="flex items-center p-4 pb-3 border-b">
            <h1 class="flex items-start text-sm font-bold gap-x-2">
                <AtlanIcon :icon="icon" class="text-gray-800" />
                {{ title }}
            </h1>
        </div>
        <div class="p-4">
            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        title: { type: String, required: true },
        icon: { type: String, required: true },
    })
</script>

<style scoped></style>
