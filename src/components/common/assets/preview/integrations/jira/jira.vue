<template>
    <LinkIssueDrawer
        v-model:visible="linkIssueVisible"
        :asset="asset"
        @close="mutate"
    />
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
        v-if="!issues?.length"
        class="flex flex-col items-center justify-center w-full h-full px-10 text-center gap-y-5"
    >
        <!-- // need empty placeholder -->
        <AtlanIcon icon="EmptyDiscover" class="h-40" />
        <span>
            No issues linked to <b>{{ asset.displayText }}</b
            >,
        </span>
        <AtlanButton @click="linkIssueVisible = true">Link Issues</AtlanButton>
    </div>

    <div ref="wrapper" class="w-full h-full">
        <Header
            :remove-mode="!!checkedIDs.length"
            @add="linkIssueVisible = true"
            @cancel="checkedIDs = []"
            @remove="handleIssueUnLink"
        />
        <div
            class="flex flex-col p-4 overflow-y-auto gap-y-4"
            style="height: calc(100vh - 5.1rem)"
        >
            <IssueList
                v-model:checkedIDs="checkedIDs"
                :issues="issues"
                :error-i-ds="unlinkErrorIDs"
            />
        </div>
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
        watch,
    } from 'vue'
    import Header from '@/common/assets/preview/integrations/jira/header.vue'
    import IssueCard from '@/common/assets/preview/integrations/jira/issueCard.vue'
    import LinkIssueDrawer from '@/common/assets/preview/integrations/jira/linkIssue/linkIssueDrawer.vue'
    import IssueList from '@/common/assets/preview/integrations/jira/issueList.vue'
    import { unlinkIssue } from '~/composables/integrations/jira/useJiraTickets'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { listLinkedIssues } from '~/composables/integrations/jira/useJiraTickets'
    import ErrorView from '@/common/error/index.vue'
    import { message } from 'ant-design-vue'

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

    const checkedIDs = ref<string[]>([])
    const unlinkErrorIDs = ref<string[]>([])

    const callUnlinkIssue = (id) => {
        const {
            key,
            fields: { summary },
        } = issues.value.find((i) => i.id === id)

        const { href } = window.location

        const body = computed(() => ({
            guid: asset.value.guid,
            name: asset.value.displayText,
            qualifiedName: asset.value.attributes.qualifiedName,
            integrationType: asset.value.attributes.connectorName,
            typeName: asset.value.typeName,
            assetUrl: href,
        }))

        const {
            data: unlinkData,
            isLoading: linkLoading,
            error: unlinkError,
        } = unlinkIssue(body, id)
        watch([unlinkData, unlinkError], (v) => {
            if (unlinkError.value) {
                unlinkErrorIDs.value.push(id)
                message.error({
                    content: `Failed to unlink "${key}: ${summary}"`,
                    key: id,
                    duration: 3,
                })
            } else {
                message.success({
                    content: `"${key}: ${summary}" has been unlinked from "${asset.value.displayText}"`,
                    key: id,
                    duration: 3,
                })
            }
        })
    }

    const handleIssueUnLink = () => {
        message.loading({
            content: `unlinking issues to "${asset.value.displayText}"`,
            key: 'link',
            duration: 2,
        })
        checkedIDs.value.forEach((id) => callUnlinkIssue(id))
    }
</script>

<style scoped></style>
