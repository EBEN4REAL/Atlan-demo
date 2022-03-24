<template>
    <a-popover
        v-model:visible="visible"
        align
        :trigger="'click'"
        :placement="placement"
        :overlay-class-name="$style.popover"
    >
        <template #content>
            <div class="p-2">
                <!-- connect with jira banner -->
                <ConnectJira v-if="!userJiraStatus.configured" />

                <a-menu click="border-0" :style="{ border: 'none' }">
                    <div
                        :class="
                            !userJiraStatus.configured
                                ? 'text-gray-400 cursor-not-allowed'
                                : ''
                        "
                        class="mb-1 rounded menu-item"
                        @click="
                            () => {
                                if (userJiraStatus.configured) {
                                    visible = false
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
                                : ''
                        "
                        @click="
                            () => {
                                if (userJiraStatus.configured) {
                                    visible = false
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
    import ConnectJira from '@/common/assets/preview/integrations/jira/misc/connectJiraCard.vue'

    const props = defineProps({
        visible: { type: Boolean, required: true },
        placement: { type: String, default: '' },
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

<style lang="less" module>
    .popover {
        :global(.ant-popover-inner) {
            @apply shadow-none;
        }
        :global(.ant-popover-content) {
            box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12);
            border-radius: 4px;
        }
        :global(.ant-dropdown-menu) {
            @apply shadow-none !important;
        }
    }
</style>
