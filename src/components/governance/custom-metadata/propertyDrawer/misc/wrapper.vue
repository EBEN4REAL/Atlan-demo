<template>
    <div class="bg-white rounded-lg shadow" style="">
        <div class="flex items-center justify-between p-4 pb-3 border-b">
            <div class="flex items-center">
                <h1 class="flex items-center text-sm font-bold gap-x-2">
                    <AtlanIcon :icon="icon" class="text-gray-700" />
                    {{ title }}
                    <template v-if="helpText">
                        <a-popover>
                            <template #content>
                                <div
                                    class="flex flex-col items-center px-4 py-2 w-60"
                                >
                                    {{ helpText }}
                                </div>
                            </template>
                            <AtlanIcon icon="Info" class="" />
                        </a-popover>
                    </template>
                </h1>
            </div>
            <slot name="action" />
        </div>
        <div class="p-4">
            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        title: { type: String, required: true },
        icon: { type: String, required: true },
        helpText: { type: String, required: false, default: '' },
    })
</script>

<style scoped></style>
