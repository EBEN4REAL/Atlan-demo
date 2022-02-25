<template>
    <header>
        <div
            class="flex justify-between px-5 py-2 border-b border-gray-200 gap-x-6 bg-gray-50"
        >
            <div>
                <span class="font-semibold text-gray-500"> Linked Issues </span>
            </div>
            <div class="flex-grow"></div>

            <div
                class="flex items-center cursor-pointer text-primary"
                @click="$emit('add')"
            >
                <AtlanIcon icon="Add" class="mr-1 mb-0.5" /> Link
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
    const emit = defineEmits(['add'])
</script>

<style scoped></style>
