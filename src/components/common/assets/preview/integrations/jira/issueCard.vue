<template>
    <section
        class="flex p-3 bg-white border shadow gap-x-4 group"
        style="border-radius: 8px"
        :class="checked ? ' border-primary' : 'border-gray-200'"
        @click="$emit('click', issue)"
    >
        <div v-if="showCheckbox">
            <a-checkbox :checked="checked" />
        </div>
        <aside class="flex-grow space-y-2 overflow-hidden">
            <header
                class="relative flex items-center justify-between overflow-hidden"
            >
                <div class="flex items-center">
                    <img
                        :src="issuetype.iconUrl"
                        style="max-height: 14px; max-width: 14px"
                        class="mr-1"
                    />
                    <span>{{ key }}</span>
                </div>
                <div class="flex-grow"></div>
                <template v-if="footer">
                    <span class="mr-1 text-xs text-gray-600">{{
                        useTimeAgo(created).value
                    }}</span>
                    <img
                        style="max-height: 16px; max-width: 16px"
                        class="rounded-full"
                        :src="creator.avatarUrls['24x24']"
                        alt=""
                    />
                </template>
                <div
                    v-else
                    class="flex items-center px-2 py-1 text-gray-500 rounded gap-x-1"
                >
                    <img
                        style="height: 16px; width: 16px"
                        :src="project.avatarUrls['24x24']"
                        alt=""
                        class="rounded-full"
                    />
                    <div class="text-xs text-gray-600">{{ project.key }}</div>
                </div>
                <a-dropdown
                    v-if="$slots?.action"
                    :trigger="['click']"
                    placement="bottomRight"
                >
                    <div
                        class="absolute right-0 flex items-center justify-end w-24 h-5 opacity-0 bg-gradient-to-l from-white via-white group-hover:opacity-100"
                    >
                        <AtlanIcon
                            icon="ThreeDotsAlt"
                            class="z-50 h-1 cursor-pointer"
                        />
                    </div>
                    <template #overlay>
                        <slot name="action" />
                    </template>
                </a-dropdown>
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
            <footer v-if="footer" class="flex gap-x-2">
                <div class="flex items-center p-1 bg-gray-200 rounded gap-x-1">
                    <img
                        :src="priority.iconUrl"
                        style="height: 16px; width: 16px"
                    />
                </div>
                <div
                    class="flex items-center px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded gap-x-1"
                >
                    {{ status.name }}
                </div>
                <div
                    class="flex items-center px-2 py-1 bg-gray-200 rounded gap-x-1"
                >
                    <img
                        style="height: 16px; width: 16px"
                        :src="project.avatarUrls['24x24']"
                        alt=""
                        class="rounded-full"
                    />
                    <div class="text-xs text-gray-500">
                        {{ project.key }}
                    </div>
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
        footer: { type: Boolean, default: true },
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
