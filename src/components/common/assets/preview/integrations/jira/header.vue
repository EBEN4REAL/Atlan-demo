<template>
    <header>
        <div class="flex items-center justify-between px-5 py-4 gap-x-6">
            <div>
                <AtlanIcon icon="Jira" class="mr-2" />
                <span class="mr-2 font-semibold text-gray-500">Jira</span>
                <span
                    v-if="assetIssueCount"
                    class="p-1 text-xs text-gray-500 bg-gray-200 rounded"
                    >{{ assetIssueCount }}
                    {{ assetIssueCount > 1 ? 'issues' : 'issue' }}</span
                >
            </div>
            <div class="flex-grow"></div>

            <div
                v-if="assetIssueCount && !isScrubbed"
                class="flex items-center px-2 py-1 rounded cursor-pointer hover:bg-gray-200 text-primary"
                @click="() => (addVisible = !addVisible)"
            >
                <AddIssue
                    v-model:visible="addVisible"
                    placement="bottom"
                    @link="emit('link')"
                    @create="emit('create')"
                >
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

    const emit = defineEmits(['link', 'create', 'remove', 'cancel'])

    const props = defineProps({
        assetIssueCount: { type: Number, required: true },
        isScrubbed: { type: Boolean, required: true },
    })

    const addVisible = ref(false)
</script>

<style scoped></style>
