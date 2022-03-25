<template>
    <template v-for="issue in issues" :key="issue.id">
        <IssueCard
            :checked="isChecked(issue.id)"
            :show-checkbox="checkbox"
            :footer="footer"
            :issue="issue"
            :error="errorIDs.includes(issue.id)"
            :class="{ 'cursor-pointer': checkbox, [cardClass]: cardClass }"
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
        cardClass: { type: String, default: '' },
        checkbox: { type: Boolean, default: false },
        footer: { type: Boolean, default: true },
        errorIDs: { type: Array, default: () => [] },
        checkedIssues: { type: Array, default: () => [] },
    })

    const emit = defineEmits([])

    const { checkedIssues } = useVModels(props, emit)

    const isChecked = (id) =>
        checkedIssues.value.findIndex((i) => i.id === id) > -1

    const handleClick = (issue) => {
        if (!props.checkbox) return
        const index = checkedIssues.value.findIndex((i) => i.id === issue.id)
        if (index > -1) {
            checkedIssues.value.splice(index, 1)
        } else checkedIssues.value.push(issue)
    }
</script>

<style scoped></style>
