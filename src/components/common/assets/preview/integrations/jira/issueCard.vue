<template>
    <section
        class="flex p-3 bg-white border border-gray-200 gap-x-3 group"
        style="
            border-radius: 8px;
            box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.05);
        "
        :class="checked ? ' border-primary' : 'border-gray-200'"
        @click="$emit('click', issue)"
    >
        <template v-if="showCheckbox">
            <a-checkbox :checked="checked" :class="$style.checkboxClass" />
        </template>
        <aside class="relative flex flex-col flex-grow overflow-hidden gap-y-3">
            <a-dropdown
                v-if="$slots?.action"
                v-model:visible="actionVisible"
                :trigger="['click']"
                placement="bottomRight"
            >
                <div
                    :class="actionVisible ? 'opacity-100' : ''"
                    class="absolute right-0 flex items-center justify-end w-24 h-5 opacity-0 bg-gradient-to-l from-white via-white group-hover:opacity-100"
                >
                    <div class="pl-3 cursor-pointer">
                        <AtlanIcon
                            icon="ThreeDotsAlt"
                            class="h-1 cursor-pointer"
                        />
                    </div>
                </div>
                <template #overlay>
                    <slot name="action" />
                </template>
            </a-dropdown>
            <main class="flex flex-col gap-y-1">
                <div class="flex items-center flex-grow text-sm font-bold">
                    <Truncate
                        placement="left"
                        :route-to="issueUrl"
                        :should-open-in-new-tab="true"
                        :tooltip-text="summary"
                        classes="text-primary hover:underline"
                        @click="handleUrlClick"
                    />
                </div>
                <span class="text-xs">
                    <Truncate
                        classes="text-gray-500"
                        placement="left"
                        :tooltip-text="description"
                        :rows="2"
                    />
                </span>
            </main>
            <section class="flex gap-x-2">
                <div
                    class="flex items-center p-1 text-xs bg-gray-200 rounded gap-x-1"
                >
                    <img
                        :src="issuetype.iconUrl"
                        style="max-height: 14px; max-width: 14px"
                        class=""
                    />
                    <span class="text-gray-500">{{ key }}</span>
                </div>
                <div
                    v-if="priority"
                    class="flex items-center p-1 bg-gray-200 rounded gap-x-1"
                >
                    <img
                        :src="priority.iconUrl"
                        style="height: 16px; width: 16px"
                    />
                </div>
                <div
                    v-if="status"
                    class="flex items-center px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded gap-x-1"
                >
                    {{ status.name }}
                </div>
                <div
                    v-if="project"
                    class="flex items-center px-2 py-1 bg-gray-200 rounded gap-x-1"
                >
                    <img
                        v-if="showProjectImage"
                        style="height: 16px; width: 16px"
                        :src="project.avatarUrls['24x24']"
                        alt=""
                        class="rounded-full"
                        @error="showProjectImage = false"
                    />
                    <div class="text-xs text-gray-500">
                        {{ project.key }}
                    </div>
                </div>
            </section>
            <footer
                class="flex items-center justify-between overflow-hidden text-xs text-gray-400"
            >
                <div class="flex items-center gap-x-1">
                    <img
                        style="max-height: 16px; max-width: 16px"
                        class="rounded-full"
                        :src="creator.avatarUrls['24x24']"
                        alt=""
                    />
                    {{ creator.displayName }}
                </div>
                <div class="flex-grow"></div>
                <span class="mr-1 text-xs">{{
                    useTimeAgo(created).value
                }}</span>
            </footer>
        </aside>
    </section>
</template>

<script setup lang="ts">
    import { computed, PropType, ref, toRefs } from 'vue'
    import { useTimeAgo, useVModels } from '@vueuse/core'
    import { Issue } from '~/types/integrations/jira.types'
    import Truncate from '@/common/ellipsis/index.vue'
    import integrationStore from '~/store/integrations/index'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

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

    const showProjectImage = ref(true)
    const actionVisible = ref(false)

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

    const handleUrlClick = (e) => {
        e?.stopPropagation()
        useAddEvent('integration', 'jira', 'issue_link_opened')
    }
</script>

<style lang="less" module>
    .checkboxClass {
        @apply h-3; // reduce extra height
        :global(.ant-checkbox) {
            top: 0px !important;
        }
    }
</style>
