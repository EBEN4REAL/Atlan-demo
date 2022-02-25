<template>
    <LinkIssueDrawer v-model:visible="linkIssueVisible" :asset="asset" />
    <div
        v-if="isLoading"
        class="flex items-center justify-center w-full h-full"
    >
        <AtlanLoader class="h-10" />
    </div>
    <div v-else-if="error" class="">
        <ErrorView :error="error" />
    </div>
    <div
        v-if="!issues.length"
        class="flex flex-col items-center justify-center w-full h-full px-10 text-center gap-y-5"
    >
        <!-- // need empty placeholder -->
        <AtlanIcon icon="EmptyDiscover" class="h-40" />
        <span>
            No issues linked to <b>{{ asset.displayText }}</b
            >, <br />
            link one!
        </span>
        <AtlanButton @click="linkIssueVisible = true">Link Issues</AtlanButton>
    </div>

    <div ref="wrapper" class="w-full h-full overflow-y-auto">
        <Header @add="linkIssueVisible = true" />
        <template v-for="issue in issues" :key="issue.id">
            <IssueCard :issue="issue" class="mx-4 mt-4" />
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
    import LinkIssueDrawer from '@/common/assets/preview/integrations/jira/linkIssue/linkIssueDrawer.vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import { listLinkedIssues } from '~/composables/integrations/jira/useJiraTickets'
    import ErrorView from '@/common/error/index.vue'

    const props = defineProps({
        selectedAsset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    })

    const { selectedAsset: asset } = toRefs(props)
    const assetID = computed(() => asset.value.guid)
    const linkIssueVisible = ref(false)

    const { issues, isLoading, error, mutate } = listLinkedIssues(assetID)
</script>

<style scoped></style>
