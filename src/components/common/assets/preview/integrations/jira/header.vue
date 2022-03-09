<template>
    <header>
        <div
            class="flex items-center justify-between px-5 py-2 border-b border-gray-200 gap-x-6 bg-gray-50"
        >
            <div>
                <AtlanIcon icon="Jira" class="mr-2" />
                <span class="font-semibold text-gray-500">Jira</span>
            </div>
            <div class="flex-grow"></div>

            <div
                v-if="assetIssueCount"
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
    })

    const addVisible = ref(false)
</script>

<style scoped></style>
