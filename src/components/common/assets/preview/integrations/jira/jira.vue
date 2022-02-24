<template>
    <div ref="wrapper" class="w-full h-full overflow-y-auto">
        <Header />
        <template v-for="issue in issues" :key="issue.id">
            <IssueCard :issue="issue" />
        </template>
    </div>
</template>

<script setup lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        toRefs,
        defineAsyncComponent,
        ref,
    } from 'vue'
    import Header from '@/common/assets/preview/integrations/jira/header.vue'
    import IssueCard from '@/common/assets/preview/integrations/jira/issueCard.vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import { listLinkedIssues } from '~/composables/integrations/jira/useJiraTickets'

    const props = defineProps({
        selectedAsset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    })

    const { selectedAsset: asset } = toRefs(props)
    const assetID = computed(() => asset.value.guid)

    const { issues, isLoading, error, mutate } = listLinkedIssues(assetID)
</script>

<style scoped></style>
