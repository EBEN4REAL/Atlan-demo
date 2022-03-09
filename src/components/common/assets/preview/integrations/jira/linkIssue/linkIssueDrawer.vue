<template>
    <a-drawer
        v-model:visible="visible"
        :mask="false"
        :width="421"
        :closable="false"
        :destroy-on-close="true"
        @close="$emit('close')"
    >
        <div class="h-full bg-primary-light">
            <Header
                class="mb-4"
                :checked-i-ds="checkedIDs"
                @close="
                    () => {
                        visible = false
                        $emit('close')
                    }
                "
                @cancel="resetIDs"
                @save="handleIssueLink"
            />

            <div
                v-if="isLoading && !searchLoading"
                class="flex items-center justify-center w-full h-full"
            >
                <AtlanLoader class="h-10" />
            </div>
            <div v-else-if="error && !searchText" class="h-full">
                <ErrorView :error="error" />
            </div>
            <div
                v-else-if="!issues?.length && !searchText && !searchLoading"
                class="flex items-center justify-center w-full h-full"
            >
                <!-- // need empty placeholder -->
                <div
                    class="flex flex-col items-center justify-center w-full h-full px-10 text-center"
                >
                    <AtlanIcon
                        icon="EmptyJira"
                        class="mb-8"
                        style="width: 272px; height: 212px"
                    />
                    <span class="mx-5 mb-6 text-gray-600">
                        Oops! seems like you don't have any issues in Jira.
                        Create one now
                    </span>
                    <AtlanButton
                        class="px-5"
                        size="sm"
                        @click="$emit('create')"
                    >
                        <AtlanIcon icon="Add" class="mr-1 mb-0.5" />
                        Create Issue
                    </AtlanButton>
                </div>
            </div>

            <div
                v-else
                class="flex flex-col gap-y-4"
                style="height: calc(100vh - 3.1rem)"
            >
                <main class="flex flex-col flex-grow overflow-y-hidden">
                    <div class="flex items-center px-4 mb-2 h-14">
                        <Search
                            v-model:value="searchText"
                            clearable
                            class="bg-white rounded-lg"
                            :placeholder="
                                totalResults
                                    ? `Search from ${totalResults} issues to link`
                                    : ''
                            "
                            @change="searchLoading = true"
                        />
                    </div>

                    <div v-if="error" class="h-full">
                        <ErrorView :error="error" />
                    </div>
                    <div
                        v-else-if="searchLoading"
                        class="flex items-center justify-center w-full h-full"
                    >
                        <AtlanLoader class="h-10" />
                    </div>

                    <div
                        v-else-if="!issues?.length && searchText"
                        class="flex flex-col items-center justify-center w-full h-full px-10 text-center"
                    >
                        <AtlanIcon
                            icon="EmptyResultJira"
                            class="mb-8"
                            style="width: 271px; height: 212px"
                        />
                        <span class="mx-5 mb-6 text-gray-600">
                            Oops… we didn’t find any jira issues that matches
                            this search
                        </span>
                    </div>

                    <div
                        v-else
                        class="flex flex-col p-4 pt-1 overflow-y-auto gap-y-2"
                        style="height: calc(100vh - 10rem)"
                    >
                        <IssueList
                            v-model:checkedIDs="checkedIDs"
                            :issues="issues"
                            :checkbox="true"
                            :footer="true"
                            :error-i-ds="linkErrorIDs"
                        />
                    </div>
                </main>
            </div>
            <footer
                :class="issues?.length ? '' : 'opacity-0'"
                class="absolute bottom-0 flex justify-center w-full pt-2 pb-2 bg-white"
            >
                <Pagination
                    v-model:offset="offset"
                    :loading="isLoading || searchLoading"
                    :page-size="pagination.pageSize"
                    :total-pages="pagination.total"
                    @mutate="mutate"
                />
            </footer>
        </div>
    </a-drawer>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { ref, Ref, watch, toRefs, onMounted, computed, PropType } from 'vue'
    import { message } from 'ant-design-vue'
    import {
        listNotLinkedIssues,
        linkIssue,
    } from '~/composables/integrations/jira/useJiraTickets'
    import IssueList from '@/common/assets/preview/integrations/jira/issueList.vue'
    import Search from '@/common/input/searchAndFilter.vue'
    import Header from '@/common/assets/preview/integrations/jira/linkIssue/header.vue'
    import AtlanLoader from '~/components/common/loaders/atlanLoader.vue'
    import ErrorView from '@/common/error/index.vue'
    import Pagination from '@/common/list/pagination.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    const props = defineProps({
        visible: { type: Boolean, required: true },
        asset: { type: Object as PropType<assetInterface>, required: true },
    })

    const emit = defineEmits(['add', 'close', 'create'])

    const { visible } = useVModels(props, emit)

    const { asset } = toRefs(props)

    const assetID = computed(() => asset.value.guid)

    const checkedIDs = ref<string[]>([])

    const {
        issues,
        isLoading,
        error,
        mutate,
        searchText,
        searchLoading,
        offset,
        pagination,
        totalResults,
    } = listNotLinkedIssues(assetID)

    const { href } = window.location

    const body = computed(() => ({
        guid: asset.value.guid,
        name: asset.value.displayText,
        qualifiedName: asset.value.attributes.qualifiedName,
        integrationType: asset.value.attributes.connectorName,
        typeName: asset.value.typeName,
        assetUrl: href,
    }))

    const linkErrorIDs = ref<string[]>([])

    const alllinkPromises: any = []

    const callLinkIssue = (id) => {
        const {
            key,
            fields: { summary },
        } = issues.value.find((i) => i.id === id)

        const {
            data: linkData,
            isLoading: linkLoading,
            error: linkError,
            mutate: link,
        } = linkIssue(body, id)
        alllinkPromises.push(link())
        watch([linkData, linkError], (v) => {
            if (linkError.value) {
                linkErrorIDs.value.push(id)
                message.error({
                    content: `Failed to link "${key}: ${summary}"`,
                    key: id,
                    duration: 3,
                })
            } else {
                const index = checkedIDs.value.indexOf(id)
                if (index !== -1) checkedIDs.value.splice(index, 1)
                message.success({
                    content: `"${key}: ${summary}" has been linked to "${asset.value.displayText}"`,
                    key: id,
                    duration: 3,
                })
            }
        })
    }

    const handleIssueLink = () => {
        message.loading({
            content: `linking issues to "${asset.value.displayText}"`,
            key: 'link',
            duration: 2,
        })
        checkedIDs.value.forEach((id) => callLinkIssue(id))
        Promise.allSettled(alllinkPromises).then(() => {
            mutate()
        })
    }

    const resetIDs = () => {
        checkedIDs.value = []
        linkErrorIDs.value = []
    }

    const reset = () => {
        resetIDs()
        offset.value = 0
        mutate()
    }

    watch(visible, (v) => {
        // still mounted without open
        if (v) reset()
    })
</script>

<style scoped></style>
