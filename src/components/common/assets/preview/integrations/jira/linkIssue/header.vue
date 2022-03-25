<template>
    <Shortcut
        shortcut-key="esc"
        action="close"
        placement="left"
        :delay="0"
        :edit-permission="true"
    >
        <div class="close-btn-sidebar" @click="$emit('close')">
            <AtlanIcon icon="Add" class="text-white outline-none" />
        </div>
    </Shortcut>
    <div
        class="flex items-center justify-between px-5 py-2 bg-white border-b border-gray-200 gap-x-3"
    >
        <div
            class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-light"
        >
            <AtlanIcon icon="Jira" />
        </div>
        <span class="flex-grow font-semibold text-gray-500"> Link Issues </span>
        <div
            v-if="checkedIDs.length"
            class="my-1 text-xs font-bold text-right text-gray-600"
        >
            {{ checkedIDs.length }} issues selected
        </div>
        <AtlanButton
            size="sm"
            class="flex items-center cursor-pointer px-7"
            :disabled="!checkedIDs.length"
            @click="$emit('save')"
        >
            Link
        </AtlanButton>
    </div>
</template>

<script setup lang="ts">
    import Shortcut from '@/common/popover/shortcut.vue'

    const props = defineProps({
        checkedIDs: { type: Array, default: [] },
    })

    const emit = defineEmits(['create', 'save', 'cancel', 'close'])
</script>

<style scoped></style>
