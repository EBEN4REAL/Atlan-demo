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

                <AtlanButton
                    padding="compact"
                    size="sm"
                    color="minimal"
                    :class="
                        !userJiraStatus.configured
                            ? 'text-gray-400'
                            : 'text-primary'
                    "
                    :disabled="!userJiraStatus.configured"
                    class="mb-1"
                    @click="$emit('Create')"
                    ><AtlanIcon icon="Add" /> Create Issue</AtlanButton
                >
                <AtlanButton
                    padding="compact"
                    size="sm"
                    color="minimal"
                    :class="
                        !userJiraStatus.configured
                            ? 'text-gray-400'
                            : 'text-primary'
                    "
                    :disabled="!userJiraStatus.configured"
                    @click="$emit('Link')"
                    ><AtlanIcon icon="Link" /> Link Issue</AtlanButton
                >
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

    const emit = defineEmits([])
    const { visible } = useVModels(props, emit)

    const store = integrationStore()
    const { userJiraStatus } = toRefs(store)
</script>

<style scoped></style>
