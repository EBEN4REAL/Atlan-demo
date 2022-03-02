<template>
    <a-popover v-model:visible="visible" :trigger="'click'" placement="bottom">
        <template #content>
            <div class="p-2">
                <!-- connect with jira banner -->
                <div
                    v-if="!userJiraStatus.configured"
                    class="flex flex-col px-4 py-3 mb-2 bg-primary-light"
                >
                    <h1 class="mb-1 text-gray-700 text-bold">
                        Connect with Jira
                    </h1>
                    <span class="mb-3 text-xs text-gray-600 w-52">
                        To create and link issues to assets connect your Jira
                        account with Atlan
                    </span>
                    <div
                        class="flex cursor-pointer items-center px-2 py-1.5 text-xs text-white bg-gray-800 rounded gap-x-1"
                        style="width: 82px"
                        @click="() => openJiraOAuth({ tenant: false })"
                    >
                        <AtlanIcon icon="Jira" style="height: 14px" /> Connect
                    </div>
                </div>

                <a-menu click="border-0" :style="{ border: 'none' }">
                    <div
                        :class="
                            !userJiraStatus.configured
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-primary'
                        "
                        class="mb-1 rounded menu-item"
                        @click="
                            () => {
                                if (userJiraStatus.configured) {
                                    $emit('create')
                                }
                            }
                        "
                    >
                        <AtlanIcon icon="Add" /> Create Issue
                    </div>
                    <div
                        class="menu-item"
                        :class="
                            !userJiraStatus.configured
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-primary'
                        "
                        @click="
                            () => {
                                if (userJiraStatus.configured) {
                                    $emit('link')
                                }
                            }
                        "
                    >
                        <AtlanIcon icon="Link" /> Link Issue
                    </div>
                </a-menu>
            </div>
        </template>
    </a-popover>
    <slot />
</template>

<script setup lang="ts">
    import { toRefs, useVModels } from '@vueuse/core'
    import integrationStore from '~/store/integrations/index'
    import { openJiraOAuth } from '~/composables/integrations/jira/useJira'

    const props = defineProps({
        visible: { type: Boolean, required: true },
    })

    const emit = defineEmits(['link', 'create'])
    const { visible } = useVModels(props, emit)

    const store = integrationStore()
    const { userJiraStatus } = toRefs(store)
</script>

<style lang="less" scoped>
    .menu-item {
        @apply p-2 cursor-pointer;
        &:hover {
            @apply bg-gray-100;
        }
    }
</style>
