<template>
    <div class="w-full">
        <div class="flex justify-between">
            <h1 class="font-bold">Resources</h1>
            <AtlanButton
                class="flex-none px-2 rounded-full"
                size="sm"
                color="secondary"
                padding="compact"
            >
                <AtlanIcon icon="Add" class="w-4 text-gray-400" />
            </AtlanButton>
        </div>
        <section>
            <template v-if="!resources?.length">
                <div class="flex flex-col items-center">
                    <EmptyScreen
                        desc="No Resources found."
                        button-text="Add Resource"
                    />
                </div>
            </template>
            <template v-else>
                <div class=""></div>
            </template>
        </section>
    </div>
</template>

<script setup lang="ts">
    import EmptyScreen from '@/common/empty/index.vue'
    import ResourcePreview from './resourcePreview.vue'
    import SlackPreview from './slackPreview.vue'

    const props = defineProps({
        resources: {
            type: Array,
            required: true,
        },
    })
</script>

<style scoped></style>
