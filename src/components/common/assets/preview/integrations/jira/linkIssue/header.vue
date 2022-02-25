<template>
    <div
        class="flex justify-between px-5 py-2 border-b border-gray-200 gap-x-3 bg-gray-50"
    >
        <div>
            <span class="font-semibold text-gray-500"> Link Issues </span>
        </div>
        <div class="flex-grow"></div>
        <template v-if="addMode">
            <div
                class="flex items-center text-gray-700 cursor-pointer hover:underline"
                @click="$emit('cancel')"
            >
                Cancel
            </div>
            <AtlanButton
                padding="compact"
                size="sm"
                class="flex items-center h-5 px-4 cursor-pointer"
                @click="$emit('save')"
            >
                Link
            </AtlanButton>
        </template>
        <div
            v-else
            class="flex items-center cursor-pointer text-primary"
            @click="$emit('create')"
        >
            <AtlanIcon icon="Add" class="mr-1 mb-0.5" /> Create Issue
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        addMode: { type: Boolean, default: false },
    })

    const emit = defineEmits(['create', 'save', 'cancel'])
</script>

<style scoped></style>
