<template>
    <div class="p-6 space-y-4 text-sm">
        <div class="flex flex-col p-4 border rounded-lg gap-y-3">
            <div class="grid items-center grid-cols-9">
                <span class="text-sm text-gray-500">Linked Issues</span>
                <span class="">
                    <AtlanIcon icon="Link" class="text-gray-700" /> 12
                </span>
            </div>
            <div class="grid items-center grid-cols-9">
                <span class="text-sm text-gray-500">Added by</span>
                <div class="flex items-center col-span-5 text-gray-700 gap-x-1">
                    <img :src="avatarURL" class="w-4 h-4 rounded-full" />
                    {{ user?.name }}
                    <span class="text-gray-300">•</span>
                    <span class="flex">
                        <span class="text-sm text-gray-500">{{
                            useTimeAgo(createdAt).value
                        }}</span>
                    </span>
                </div>
            </div>
        </div>

        <OverviewBanner class="flex flex-col p-4 border rounded-lg gap-y-3" />
    </div>
</template>

<script setup lang="ts">
    import { useTimeAgo } from '@vueuse/core'
    import OverviewBanner from '@/admin/integrations/jira/misc/overviewBannerCard.vue'

    const props = defineProps({
        user: { type: Object, required: true },
        avatarURL: { type: String, required: true },
        createdAt: { type: String, required: true },
    })
</script>

<style scoped></style>
