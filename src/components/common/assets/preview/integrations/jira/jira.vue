<template>
    <CreateModal
        v-model:visible="createModal"
        :asset="asset"
        @success="handleIssueCreationSuccess"
    />
    <LinkIssueDrawer
        v-model:visible="linkIssueVisible"
        :asset="asset"
        @close="mutate"
    />
    <Header
        :remove-mode="!!checkedIDs.length"
        :asset-issue-count="issues?.length || 0"
        @link="linkIssueVisible = true"
        @create="createModal = true"
        @cancel="resetIDs"
        @remove="handleIssueUnLink"
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

    <div v-else ref="wrapper" class="w-full h-full">
        <div
            class="flex flex-col p-4 overflow-y-auto gap-y-3"
            style="height: calc(100vh - 11.5rem)"
        >
            <IssueList
                v-model:checkedIDs="checkedIDs"
                :issues="issues"
                :checkbox="false"
                :error-i-ds="unlinkErrorIDs"
            />
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
    }

    const store = integrationStore()
    const { userJiraStatus } = toRefs(store)

    const checkedIDs = ref<string[]>([])
    const unlinkErrorIDs = ref<string[]>([])

    const allUnlinkPromises: any = []

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
            mutate: unlink,
        } = unlinkIssue(body, id)
        allUnlinkPromises.push(unlink())
        watch([unlinkData, unlinkError], (v) => {
            if (unlinkError.value) {
                unlinkErrorIDs.value.push(id)
                message.error({
                    content: `Failed to unlink "${key}: ${summary}"`,
                    key: id,
                    duration: 3,
                })
            } else {
                const index = checkedIDs.value.indexOf(id)
                if (index !== -1) checkedIDs.value.splice(index, 1)
                message.success({
                    content: `"${key}: ${summary}" has been unlinked from "${asset.value.displayText}"`,
                    key: id,
                    duration: 3,
                })
            }
        })
    }

    const resetIDs = () => {
        checkedIDs.value = []
        unlinkErrorIDs.value = []
    }

    const handleIssueUnLink = () => {
        message.loading({
            content: `unlinking issues to "${asset.value.displayText}"`,
            key: 'link',
            duration: 2,
        })
        checkedIDs.value.forEach((id) => callUnlinkIssue(id))

        Promise.allSettled(allUnlinkPromises).then(() => {
            fetchLinkedIssues()
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
