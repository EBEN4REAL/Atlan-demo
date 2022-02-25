<template>
    <section
        class="flex items-center p-2 transition ease-in-out rounded shadow gap-x-2"
        @click="$emit('click', issue)"
    >
        <div v-if="showCheckbox" class="">
            <a-checkbox :checked="checked" />
        </div>
        <div class="flex" style="max-width: 40px">
            <img
                :src="project.avatarUrls['24x24']"
                alt=""
                class="rounded-full"
            />
        </div>
        <aside>
            <h1 class="flex font-bold">
                <img :src="issuetype.iconUrl" class="mr-1" />
                <Truncate :tooltip-text="`${key}: ${summary}`" />
            </h1>
            <span class="text-xs">
                <Truncate :tooltip-text="description" :rows="2" />
            </span>
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
    import { useTimeAgo, useVModels } from '@vueuse/core'
    import { listIssueTypes } from '~/composables/integrations/jira/useJiraTickets'
    import Truncate from '@/common/ellipsis/index.vue'

    const props = defineProps({
        issue: { type: Object as PropType<Issue>, required: true },
        checked: { type: Boolean, default: false },
        showCheckbox: { type: Boolean, default: false },
    })

    const emit = defineEmits(['click'])

    // const { checked } = useVModels(props, emit)

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
