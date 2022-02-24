<template>
    <section class="flex items-center p-2 m-4 rounded shadow gap-x-2">
        <div class="flex h-10">
            <img
                :src="project.avatarUrls['24x24']"
                alt=""
                class="rounded-full"
            />
        </div>
        <aside>
            <h1 class="flex font-bold">
                <img :src="issuetype.iconUrl" class="mr-1" />{{
                    `${key}: ${summary}`
                }}
            </h1>
            <span class="text-xs">{{ description }}</span>
            <div class="text-xs text-gray-500">
                <span>{{ creator.displayName }}</span
                >,
                <span v-if="updated">{{ useTimeAgo(updated).value }}</span>
                <span v-else>{{ useTimeAgo(created).value }}</span>
            </div>
        </aside>
    </section>
</template>

<script setup lang="ts">
    import { computed, PropType, toRefs } from 'vue'
    import { Issue } from '~/types/integrations/jira.types'
    import { useTimeAgo } from '@vueuse/core'
    import { listIssueTypes } from '~/composables/integrations/jira/useJiraTickets'

    const props = defineProps({
        issue: { type: Object as PropType<Issue>, required: true },
    })

    const { issue } = toRefs(props)

    const {
        key,
        fields: {
            summary,
            description,
            creator,
            created,
            updated,
            lastViewed,
            issuetype,
            project,
            priority,
        },
    } = issue.value

    // const { data: issueTypes, isLoading, error, mutate } = listIssueTypes()
</script>

<style scoped></style>
