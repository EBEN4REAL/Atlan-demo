<template>
    <a-drawer
        v-model:visible="visible"
        :mask="true"
        :closable="false"
        :force-render="false"
        @close="$emit('close')"
    >
        <Header
            class="mb-4"
            :add-mode="!!checkedIDs.length"
            @cancel="checkedIDs = []"
            @save="handleIssueLink"
        />

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
                <div class="flex-shrink-0 px-4 h-14">
                    <Search
                        v-model="searchText"
                        clearable
                        :placeholder="
                            totalResults
                                ? `Search from ${totalResults} issues to link`
                                : ''
                        "
                        @change="searchLoading = true"
                    />
                    <div
                        v-if="checkedIDs.length"
                        class="w-full my-1 text-xs text-right text-gray-500"
                    >
                        {{ checkedIDs.length }} issues selected
                    </div>
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
                    class="flex flex-col p-4 pt-1 overflow-y-auto gap-y-4"
                    style="height: calc(100vh - 10.4rem)"
                >
                    <IssueList
                        v-model:checkedIDs="checkedIDs"
                        :issues="issues"
                        :error-i-ds="linkErrorIDs"
                    />
                </div>
            </main>
        </div>
        <footer
            class="absolute flex justify-center w-full pt-2 bg-white bottom-3"
        >
            <Pagination
                v-if="visible"
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
    import { ref, Ref, watch, toRefs, onMounted, computed, PropType } from 'vue'
    import { message } from 'ant-design-vue'
    import {
        listNotLinkedIssues,
        linkIssue,
    } from '~/composables/integrations/jira/useJiraTickets'
    import IssueList from '@/common/assets/preview/integrations/jira/issueList.vue'
    import Search from '@/common/input/searchAdvanced.vue'
    import Header from '@/common/assets/preview/integrations/jira/linkIssue/header.vue'
    import AtlanLoader from '~/components/common/loaders/atlanLoader.vue'
    import ErrorView from '@/common/error/index.vue'
    import Pagination from '@/common/list/pagination.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    const props = defineProps({
        visible: { type: Boolean, required: true },
        asset: { type: Object as PropType<assetInterface>, required: true },
    })

    const emit = defineEmits(['add', 'close'])

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

    const callLinkIssue = (id) => {
        const {
            key,
            fields: { summary },
        } = issues.value.find((i) => i.id === id)

        const {
            data: linkData,
            isLoading: linkLoading,
            error: linkError,
        } = linkIssue(body, id)
        watch([linkData, linkError], (v) => {
            if (linkError.value) {
                linkErrorIDs.value.push(id)
                message.error({
                    content: `Failed to link "${key}: ${summary}"`,
                    key: id,
                    duration: 3,
                })
            } else {
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
    }

    const reset = () => {
        checkedIDs.value = []
        offset.value = 0
        linkErrorIDs.value = []
        mutate()
    }

    watch(visible, (v) => {
        // still mounted without open
        if (v) reset()
    })
</script>

<style scoped></style>
