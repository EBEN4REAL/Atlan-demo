<template>
    <template v-for="issue in issues" :key="issue.id">
        <IssueCard
            :checked="checkedIDs.includes(issue.id)"
            :show-checkbox="!!checkedIDs.length"
            :issue="issue"
            :error="errorIDs.includes(issue.id)"
            class="cursor-pointer hover:bg-gray-100"
            @click="handleClick"
        />
    </template>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { ref, PropType } from 'vue'
    import IssueCard from '@/common/assets/preview/integrations/jira/issueCard.vue'

    const props = defineProps({
        issues: { type: Object, required: true },
        errorIDs: { type: Array, default: () => [] },
        checkedIDs: { type: Array, default: () => [] },
    })

    const emit = defineEmits([])

    const { checkedIDs } = useVModels(props, emit)

    const handleClick = (issue) => {
        if (checkedIDs.value.includes(issue.id)) {
            const index = checkedIDs.value.indexOf(issue.id)
            if (index !== -1) checkedIDs.value.splice(index, 1)
        } else checkedIDs.value.push(issue.id)
    }
</script>

<style scoped></style>
