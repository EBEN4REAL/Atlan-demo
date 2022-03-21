<template>
    <a-drawer
        v-model:visible="visible"
        :mask="false"
        :width="421"
        :closable="false"
        :destroy-on-close="true"
        @close="$emit('close')"
    >
        <div class="flex flex-col h-full overflow-y-hidden bg-primary-light">
            <Header
                class="mb-4"
                :checked-i-ds="checkedIssues"
                @close="
                    () => {
                        visible = false
                        handleCancel()
                        $emit('close')
                    }
                "
                @save="handleIssueLink"
            />

            <div
                v-if="firstLoad"
                class="flex flex-col items-center justify-center flex-grow w-full"
            >
                <AtlanLoader class="h-10" />
            </div>
            <div v-else-if="error && !searchText" class="h-full">
                <ErrorView :error="error" />
            </div>
            <!-- there is no issue in jira that is unlinked -->
            <div
                v-else-if="!issues?.length && !searchText && !searchLoading"
                class="flex items-center justify-center w-full h-full"
            >
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
                class="flex flex-col flex-grow overflow-y-hidden gap-y-4"
            >
                <main class="flex flex-col flex-grow overflow-y-hidden">
                    <div class="flex items-center px-4 my-3">
                        <Search
                            v-model:value="searchText"
                            clearable
                            class="bg-white rounded-lg"
                            :placeholder="
                                totalResults && !isLoading
                                    ? `Search from ${totalResults} issues to link`
                                    : ''
                            "
                            @change="handleSearch"
                        />
                    </div>

                    <div v-if="error" class="h-full">
                        <ErrorView :error="error" />
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
                        <AtlanButton
                            class="px-5"
                            size="sm"
                            @click="clearSearch"
                        >
                            Clear Search
                        </AtlanButton>
                    </div>

                    <div
                        v-else
                        class="flex flex-col flex-grow p-4 py-3 pt-1 overflow-y-auto gap-y-2"
                    >
                        <IssueList
                            v-model:checkedIssues="checkedIssues"
                            :issues="issues"
                            :checkbox="true"
                            :footer="true"
                            :error-i-ds="linkErrorIDs"
                            :card-class="
                                isLoading && issues?.length ? 'opacity-80 ' : ''
                            "
                        />
                        <footer
                            v-if="
                                issues.length < totalResults && !searchLoading
                            "
                            :class="issues?.length ? '' : 'opacity-0'"
                            class="flex justify-center w-full pt-1"
                        >
                            <a-button
                                class="flex items-center justify-between py-2 transition-all duration-300 bg-white border-none rounded-full text-primary"
                                @click="loadMore"
                            >
                                <template v-if="!isLoading">
                                    <p
                                        class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                                    >
                                        Load more
                                    </p>
                                    <AtlanIcon icon="ArrowDown"
                                /></template>

                                <AtlanLoader
                                    v-else-if="isLoading"
                                    class="h-5"
                                />
                            </a-button>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    </a-drawer>
</template>

<script setup lang="ts">
    import { debouncedWatch, useVModels } from '@vueuse/core'
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
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    const props = defineProps({
        visible: { type: Boolean, required: true },
        asset: { type: Object as PropType<assetInterface>, required: true },
    })

    const emit = defineEmits(['add', 'close', 'create', 'fetch'])

    const { visible } = useVModels(props, emit)

    const { asset } = toRefs(props)

    const assetID = computed(() => asset.value.guid)

    const checkedIssues = ref<string[]>([])
    const {
        issues,
        isLoading,
        error,
        mutate,
        searchText,
        searchLoading,
        handleSearch,
        offset,
        totalResults,
        loadMore,
        reset,
        isReady,
        clearSearch,
    } = listNotLinkedIssues(assetID)

    debouncedWatch(
        searchText,
        (v) => {
            if (v) {
                useAddEvent('integration', 'jira', 'issue_searched', {
                    asset_type: asset.value.typeName,
                })
            }
        },
        { debounce: 2000 }
    )

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

    const callLinkIssue = (issue) => {
        const {
            id,
            key,
            fields: { summary },
        } = issue

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
                const index = checkedIssues.value.findIndex((i) => i.id === id)
                if (index !== -1) checkedIssues.value.splice(index, 1)
                message.success({
                    content: `"${key}: ${summary}" has been linked to "${asset.value.displayText}"`,
                    key: id,
                    duration: 3,
                })
            }
        })
    }

    const resetIDs = () => {
        checkedIssues.value = []
        linkErrorIDs.value = []
    }
    const isLoadingFirst = ref(true)
    //  ? use first load loading state for showing loader once, additional loading via opacity effect
    const firstLoad = computed(() => isLoadingFirst.value && isLoading.value)

    const recall = async () => {
        searchText.value = ''
        resetIDs()
        await reset()
        isLoadingFirst.value = false
    }

    const handleCancel = () => {
        recall()
    }

    const handleIssueLink = () => {
        message.loading({
            content: `linking issues to "${asset.value.displayText}"`,
            key: 'link',
            duration: 2,
        })
        checkedIssues.value.forEach((issue) => callLinkIssue(issue))
        Promise.allSettled(alllinkPromises).then((results) => {
            mutate()
            const count = results.filter((r) => r.status === 'fulfilled').length
            useAddEvent('integration', 'jira', 'issue_linked', {
                issue_count: count,
                asset_type: asset.value.typeName,
            })
            // visible.value = false
            handleCancel()
            emit('fetch')
        })
    }

    defineExpose({
        recall,
        issues,
    })

    watch(visible, (v) => {
        // still mounted without open
        if (v && !issues.value?.length) recall()
        // else if (v && (checkedIssues.value.length || linkErrorIDs.value.length))
        //     recall()
    })
</script>

<style scoped></style>
