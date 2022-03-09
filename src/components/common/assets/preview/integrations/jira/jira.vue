<template>
    <CreateModal
        v-model:visible="createModal"
        :asset="asset"
        @success="handleIssueCreationSuccess"
    />
    <LinkIssueDrawer
        v-model:visible="linkIssueVisible"
        :asset="asset"
        @close="fetchLinkedIssues"
        @create="() => (createModal = true)"
    />
    <Header
        :asset-issue-count="issues?.length || 0"
        @link="linkIssueVisible = true"
        @create="createModal = true"
    />
    <div v-if="!userJiraStatus.configured" class="flex items-center h-full">
        <EmptyPlaceholder
            @create="createModal = true"
            @link="linkIssueVisible = true"
        />
    </div>
    <div
        v-else-if="isLoading"
        class="flex items-center justify-center w-full h-full"
    >
        <AtlanLoader class="h-10" />
    </div>
    <div v-else-if="error" class="">
        <ErrorView :error="error" />
    </div>
    <div v-else-if="!issues?.length" class="flex items-center h-full">
        <EmptyPlaceholder
            @create="createModal = true"
            @link="linkIssueVisible = true"
        />
    </div>

    <div
        v-else
        ref="wrapper"
        class="flex flex-col flex-grow w-full overflow-hidden"
    >
        <div class="flex flex-col flex-grow p-4 overflow-y-auto gap-y-3">
            <template v-for="issue in issues" :key="issue.id">
                <IssueCard :issue="issue">
                    <template #action>
                        <div
                            class="px-3 py-2 bg-white"
                            style="
                                box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12);
                                border-radius: 4px;
                            "
                        >
                            <div
                                class="text-red-500 cursor-pointer"
                                @click="handleUnlick(issue)"
                            >
                                <AtlanIcon icon="Link" /> Unlink issue
                            </div>
                        </div>
                    </template>
                </IssueCard>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { PropType, computed, toRefs, ref, watch, onMounted } from 'vue'
    import { message } from 'ant-design-vue'
    import Header from '@/common/assets/preview/integrations/jira/header.vue'
    import IssueCard from '@/common/assets/preview/integrations/jira/issueCard.vue'
    import LinkIssueDrawer from '@/common/assets/preview/integrations/jira/linkIssue/linkIssueDrawer.vue'
    import IssueList from '@/common/assets/preview/integrations/jira/issueList.vue'
    import {
        unlinkIssue,
        listLinkedIssues,
    } from '~/composables/integrations/jira/useJiraTickets'
    import { assetInterface } from '~/types/assets/asset.interface'
    import ErrorView from '@/common/error/index.vue'
    import EmptyPlaceholder from '@/common/assets/preview/integrations/jira/misc/emptyPlaceholder.vue'
    import integrationStore from '~/store/integrations/index'
    import { until } from '@vueuse/core'
    import CreateModal from '@/common/integrations/jira/createIssueModal.vue'

    const props = defineProps({
        selectedAsset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    })

    const { selectedAsset: asset } = toRefs(props)
    const assetID = computed(() => asset.value.guid)
    const linkIssueVisible = ref(false)
    const createModal = ref(false)

    const {
        issues,
        isLoading,
        error,
        mutate: fetchLinkedIssues,
    } = listLinkedIssues(assetID)

    const handleIssueCreationSuccess = () => {
        fetchLinkedIssues()
        if (linkIssueVisible.value) linkIssueVisible.value = false
    }

    const store = integrationStore()
    const { userJiraStatus } = toRefs(store)

    const handleUnlick = (issue) => {
        const {
            id,
            key,
            fields: { summary },
        } = issue

        message.loading({
            content: `unlinking issues from "${asset.value.displayText}"`,
            key,
            duration: 2,
        })

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
            mutate: unlink,
        } = unlinkIssue(body, id)
        watch([unlinkData, unlinkError], (v) => {
            if (unlinkError.value) {
                message.error({
                    content: `Failed to unlink "${key}: ${summary}"`,
                    key,
                    duration: 3,
                })
            } else {
                fetchLinkedIssues()
                message.success({
                    content: `"${key}: ${summary}" has been unlinked from "${asset.value.displayText}"`,
                    key,
                    duration: 3,
                })
            }
        })
    }

    onMounted(() => {
        if (userJiraStatus.value.configured) fetchLinkedIssues()
    })

    watch(
        () => userJiraStatus.value.configured,
        (v) => {
            if (v) {
                fetchLinkedIssues()
            }
        }
    )
</script>

<style scoped></style>
