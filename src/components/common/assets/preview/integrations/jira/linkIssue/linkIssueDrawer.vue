<template>
    <a-drawer
        v-model:visible="visible"
        :mask="true"
        :closable="false"
        :force-render="false"
    >
        <Header class="mb-4" />

        <div
            v-if="isLoading && !searchLoading"
            class="flex items-center justify-center w-full h-full"
        >
            <AtlanLoader class="h-10" />
        </div>
        <div v-else-if="error" class="">
            <ErrorView :error="error" />
        </div>
        <div
            v-if="!issues?.length && !searchText && !searchLoading"
            class="flex items-center justify-center w-full h-full"
        >
            <!-- // need empty placeholder -->
            No issues exists, create one!
        </div>

        <div v-else class="flex flex-col gap-y-4">
            <main class="flex flex-col flex-grow overflow-y-hidden">
                <div class="flex-shrink-0 px-4 mb-2">
                    <Search
                        v-model="searchText"
                        clearable
                        :placeholder="
                            issues?.length
                                ? `Search from ${issues?.length} issues to link`
                                : ''
                        "
                        @change="searchLoading = true"
                    />
                </div>

                <div
                    v-if="searchLoading"
                    class="flex items-center justify-center w-full h-full"
                >
                    <AtlanLoader class="h-10" />
                </div>
                <div v-else-if="error" class="">
                    <ErrorView :error="error" />
                </div>
                <div
                    v-else-if="!issues?.length && searchText"
                    class="flex items-center justify-center w-full h-full"
                >
                    No issue found with for "{{ searchText }}"
                </div>

                <div
                    v-else
                    class="flex flex-col p-4 space-y-4 overflow-y-auto"
                    style="height: calc(100vh - 9rem)"
                >
                    <template v-for="issue in issues" :key="issue.id">
                        <IssueCard
                            v-model:checked="issue.checked"
                            :show-checkbox="issues.some((i) => i.checked)"
                            :issue="issue"
                            class="cursor-pointer hover:bg-gray-100"
                            @click="() => (issue.checked = !issue.checked)"
                        />
                    </template>
                </div>
            </main>
        </div>
        <footer class="absolute flex justify-center w-full bottom-3">
            <Pagination
                v-model:offset="offset"
                :loading="isLoading || searchLoading"
                :page-size="pagination.pageSize"
                :total-pages="pagination.total"
                @mutate="mutate"
            />
        </footer>
    </a-drawer>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { ref, Ref, watch, toRefs, onMounted } from 'vue'
    import { listNotLinkedIssues } from '~/composables/integrations/jira/useJiraTickets'
    import IssueCard from '@/common/assets/preview/integrations/jira/issueCard.vue'
    import Search from '@/common/input/searchAdvanced.vue'
    import Header from '@/common/assets/preview/integrations/jira/linkIssue/header.vue'
    import AtlanLoader from '~/components/common/loaders/atlanLoader.vue'
    import ErrorView from '@/common/error/index.vue'
    import Pagination from '@/common/list/pagination.vue'

    const props = defineProps({
        visible: { type: Boolean, required: true },
        assetID: { type: String, required: true },
    })

    const emit = defineEmits(['add'])

    const { visible } = useVModels(props, emit)

    const { assetID } = toRefs(props)

    const linkIssueVisible = ref(false)

    const {
        issues,
        isLoading,
        error,
        mutate,
        searchText,
        searchLoading,
        offset,
        pagination,
    } = listNotLinkedIssues(assetID)

    watch([error, isLoading], (v) => {})

    onMounted(() => {
        // still mounted without open
        mutate()
    })
</script>

<style scoped></style>
