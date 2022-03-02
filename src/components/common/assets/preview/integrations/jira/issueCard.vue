<template>
    <section
        class="flex p-3 border shadow gap-x-4"
        :class="error ? ' border-red-500 border-dashed' : 'border-gray-200'"
        style="border-radius: 8px"
        @click="$emit('click', issue)"
    >
        <div v-if="showCheckbox">
            <a-checkbox :checked="checked" />
        </div>
        <aside class="flex-grow space-y-2">
            <header class="flex items-center justify-between">
                <div class="flex items-center">
                    <img
                        :src="issuetype.iconUrl"
                        style="max-height: 14px; max-width: 14px"
                        class="mr-1"
                    />
                    <span>{{ key }}</span>
                </div>
                <div class="flex-grow"></div>
                <span class="mr-1 text-xs text-gray-600">{{
                    useTimeAgo(created).value
                }}</span>
                <img
                    style="max-height: 16px; max-width: 16px"
                    class="rounded-full"
                    :src="creator.avatarUrls['24x24']"
                    alt=""
                />
            </header>
            <main class="flex flex-col space-y-1">
                <div class="flex items-center flex-grow">
                    <Truncate
                        placement="left"
                        :route-to="issueUrl"
                        :should-open-in-new-tab="true"
                        :tooltip-text="summary"
                        classes="text-primary hover:underline"
                        @click="(e) => e.stopPropagation()"
                    />
                </div>

                <span class="text-xs">
                    <Truncate
                        classes="text-gray-600"
                        placement="left"
                        :tooltip-text="description"
                        :rows="2"
                    />
                </span>
            </main>
            <footer class="flex gap-x-2">
                <div class="flex items-center p-1 bg-gray-100 rounded gap-x-1">
                    <img
                        :src="priority.iconUrl"
                        style="height: 16px; width: 16px"
                    />
                </div>
                <div
                    class="flex items-center px-2 py-1 text-gray-700 bg-gray-100 rounded gap-x-1"
                >
                    {{ status.name }}
                </div>
                <div
                    class="flex items-center px-2 py-1 bg-gray-100 rounded gap-x-1"
                >
                    <img
                        style="height: 16px; width: 16px"
                        :src="project.avatarUrls['24x24']"
                        alt=""
                        class="rounded-full"
                    />
                    <div class="text-xs text-gray-600">{{ project.key }}</div>
                </div>
            </footer>
        </aside>
    </section>
</template>

<script setup lang="ts">
    import { computed, PropType, toRefs } from 'vue'
    import { useTimeAgo, useVModels } from '@vueuse/core'
    import { Issue } from '~/types/integrations/jira.types'
    import Truncate from '@/common/ellipsis/index.vue'
    import integrationStore from '~/store/integrations/index'

    const props = defineProps({
        issue: { type: Object as PropType<Issue>, required: true },
        checked: { type: Boolean, default: false },
        error: { type: Boolean, default: false },
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
            status,
        },
    } = issue.value

    const store = integrationStore()

    const { tenantJiraStatus } = toRefs(store)

    const issueUrl = computed(() => {
        const { orgUrl } = tenantJiraStatus.value
        return `${orgUrl.replace('https://', '//')}/browse/${key}`
    })
</script>

<style scoped></style>
