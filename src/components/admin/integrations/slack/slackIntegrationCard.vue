<template>
    <a-modal
        :visible="showSlackConfigModal"
        :destroy-on-close="true"
        :footer="null"
        :closable="false"
        :width="692"
        :class="$style.inviteModal"
        @cancel="showSlackConfigModal = false"
        @afterClose="showSlackConfigModal = false"
    >
        <SlackConfigModal @close="showSlackConfigModal = false" />
    </a-modal>

    <div
        class="overflow-hidden border rounded-lg customShadow"
        :class="
            openKeys.includes('slack')
                ? ' border-primary-focus'
                : 'border-gray-300'
        "
    >
        <a-menu v-model:openKeys="openKeys" mode="inline" :class="$style.menu">
            <a-sub-menu key="slack" mode="inline">
                <template #title>
                    <SlackHeader
                        class="cursor-pointer"
                        :is-open="openKeys.includes('slack')"
                        @openConfig="showSlackConfigModal = true"
                    />
                </template>
                <a-menu-item>
                    <div class="">
                        <UpdateSlackConfig
                            v-if="tenantSlackStatus.configured"
                        />
                        <template v-else>
                            <OverviewBanner
                                class="flex flex-col p-4 m-6 border rounded-lg gap-y-3"
                            />
                        </template>
                    </div>
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script setup lang="ts">
    import { ref, toRefs, watch } from 'vue'
    import integrationStore from '~/store/integrations/index'
    import UpdateSlackConfig from './updateSlackConfig.vue'
    import SlackConfigModal from './slackConfigModal.vue'
    import SlackHeader from '@/admin/integrations/slack/slackHeader.vue'
    import OverviewBanner from '@/admin/integrations/slack/misc/overviewBannerCard.vue'

    const openKeys = ref([])

    const showSlackConfigModal = ref(false)
    // store
    const store = integrationStore()

    const { tenantSlackStatus } = toRefs(store)
    watch(
        () => tenantSlackStatus.value.configured,
        (v) => {
            if (
                showSlackConfigModal.value &&
                tenantSlackStatus.value.configured
            )
                showSlackConfigModal.value = false
        }
    )
</script>

<style lang="less" module>
    .inviteModal {
        :global(.ant-modal-content) {
            @apply rounded-lg;
        }
    }
</style>

<style scoped>
    .customShadow:hover {
        box-shadow: 0px 8px 24px rgba(25, 32, 56, 0.04);
    }
</style>

<style lang="less" module>
    .menu {
        div {
            line-height: normal;
            @apply whitespace-normal;
        }
        @apply border-none  !important;
        :global(.ant-menu-submenu-title) {
            @apply h-full p-0 m-0 !important;
            :global(.ant-menu-submenu-arrow) {
                @apply hidden !important;
            }
        }

        :global(.ant-menu-title-content) {
            @apply cursor-default;
        }

        :global(.ant-menu-item) {
            @apply h-full  bg-white px-0 !important;
        }

        :global(.ant-menu-submenu-title:active) {
            @apply bg-transparent;
        }

        :global(.ant-menu-inline) {
            @apply bg-white !important;
        }

        :global(.ant-menu-item-selected) {
            @apply text-gray-700;
        }
        :global(.ant-menu-item:hover) {
            @apply text-gray-700;
        }
    }
    :global(.ant-menu-item::after) {
        @apply border-r-0 !important;
    }
</style>
