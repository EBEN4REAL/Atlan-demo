<template>
    <header>
        <div
            class="flex justify-between px-5 py-2 border-b border-gray-200 gap-x-6 bg-gray-50"
        >
            <div>
                <AtlanIcon icon="Jira" class="mr-2" />
                <span class="font-semibold text-gray-500">Jira</span>
            </div>
            <div class="flex-grow"></div>
            <template v-if="removeMode">
                <div
                    class="flex items-center text-gray-700 cursor-pointer hover:underline"
                    @click="$emit('cancel')"
                >
                    Cancel
                </div>
                <AtlanButton
                    padding="compact"
                    size="sm"
                    class="flex items-center h-5 px-4 text-xs cursor-pointer"
                    @click="$emit('remove')"
                >
                    Unlink
                </AtlanButton>
            </template>
            <div
                v-else-if="assetIssueCount"
                class="flex items-center px-2 py-1 rounded cursor-pointer hover:bg-gray-200 text-primary"
                @click="() => (addVisible = true)"
            >
                <AddIssue v-model:visible="addVisible">
                    <div class="">
                        <AtlanIcon icon="Add" class="mr-1 mb-0.5" /> Add Issue
                    </div>
                </AddIssue>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import AddIssue from '@/common/assets/preview/integrations/jira/misc/addIssuePopover.vue'

    const emit = defineEmits(['add', 'remove', 'cancel'])

    const props = defineProps({
        removeMode: { type: Boolean, default: false },
        assetIssueCount: { type: Number, required: true },
    })

    const addVisible = ref(false)
</script>

<style scoped></style>
