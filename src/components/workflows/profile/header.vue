<template>
    <div class="flex items-center justify-between">
        <div class="flex w-full">
            <!-- back button -->
            <div class="self-end mt-4 mr-2">
                <a-button
                    class="
                        px-1
                        border-transparent
                        shadow-none
                        hover:border-gray-300
                        py-0.5
                    "
                    @click="$router.push('/workflows')"
                >
                    <atlan-icon
                        icon="ArrowRight"
                        class="w-5 h-5 text-gray-500 transform rotate-180"
                    />
                </a-button>
            </div>
            <div class="flex flex-col w-full">
                <div class="flex items-center w-full gap-x-2">
                    <!-- workflow tyoe -->
                    WORKFLOW
                </div>
                <h3 class="text-lg font-bold text-primary">
                    {{ title }}
                </h3>
            </div>
            <div class="flex space-x-2">
                <UtilityButtons />
                <a-button size="small" @click="$emit('openLogs')"
                    >Logs</a-button
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import UtilityButtons from '@/workflows/shared/utilityButtons.vue'

    export default defineComponent({
        components: {
            UtilityButtons,
        },
        props: { title: { type: String, default: 'Title here' } },
        emits: ['openLogs'],
    })
</script>
