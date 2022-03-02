<template>
    <!-- // need empty placeholder -->
    <div
        class="flex flex-col items-center justify-center w-full h-full px-10 text-center"
    >
        <AtlanIcon
            icon="EmptyJira"
            class="mb-8"
            style="width: 272px; height: 212px"
        />
        <span class="mx-5 text-gray-600 mb-9">
            Jira tickets linked to this assets will appear over here
        </span>
        <AddIssue
            v-model:visible="addVisible"
            @create="$emit('create')"
            @link="$emit('link')"
        >
            <AtlanButton class="px-5" size="sm" @click="addVisible = true">
                <AtlanIcon icon="Add" class="mr-1 mb-0.5" /> Add Issue
            </AtlanButton>
        </AddIssue>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import AddIssue from '@/common/assets/preview/integrations/jira/misc/addIssuePopover.vue'

    const emit = defineEmits(['create', 'link'])

    const addVisible = ref(false)
</script>

<style scoped></style>
