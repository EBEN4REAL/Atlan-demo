<template>
    <div class="flex items-center justify-between">
        <div class="flex w-full">
            <!-- back button -->
            <div class="self-center mr-2">
                <router-link
                    class="
                        rounded
                        block
                        border border-gray-200
                        px-1
                        border-transparent
                        shadow-none
                        hover:border-gray-300
                        py-0.5
                    "
                    to="/workflows"
                >
                    <atlan-icon
                        icon="ArrowRight"
                        class="w-5 h-5 text-gray-500 transform rotate-180"
                    />
                </router-link>
            </div>
            <div class="flex flex-col w-full">
                <div class="flex text-sm text-gray-500">
                    <div class="mr-2">
                        <img
                            src="/src/assets/images/source/snowflake.png"
                            class="flex-none w-auto h-3.5 mb-0.5"
                        />
                    </div>
                    <span class="text-gray-500">Workflow</span>
                </div>
                <div>
                    <h3 class="text-xl capitalize">
                        {{ workflow?.name }}
                        <span
                            class="px-2 py-1 text-xs border border-transparent border-gray-200 rounded shadow-none hover:border-gray-300"
                            @click="$router.back()"
                        >
                            Scheduled
                        </span>
                    </h3>
                </div>
                <div class="flex items-center gap-x-3">
                    <div
                        class="flex items-center text-sm text-gray-500 gap-x-1"
                    >
                        <AtlanIcon icon="User" />
                        <span>{{ `Creator name` }}</span>
                    </div>
                    <div style="color: rgb(196, 196, 196)">•</div>
                    <div class="flex text-sm text-gray-500">
                        <span class="text-gray-500"> Last run 8 days ago</span>
                    </div>
                    <div style="color: rgb(196, 196, 196)">•</div>
                    <div class="flex text-sm text-gray-500">
                        <span class="text-gray-500">308 total runs</span>
                    </div>
                </div>
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
        props: {
            workflow: { type: Object, default: () => {} },
        },
        emits: ['openLogs'],
    })
</script>
