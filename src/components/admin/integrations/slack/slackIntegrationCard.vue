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

    <div class="overflow-hidden border border-gray-300 rounded-lg customShadow">
        <a-menu v-model:openKeys="openKeys" mode="inline" :class="$style.menu">
            <a-sub-menu key="slack">
                <template #expandIcon> <AtlanIcon icon="CaretDown" /></template>
                <template #title>
                    <SlackHeader
                        :is-open="openKeys.includes('slack')"
                        @openConfig="showSlackConfigModal = true"
                    />
                </template>
                <UpdateSlackConfig v-if="tenantSlackStatus.configured" />
                <template v-else>
                    <OverviewBanner
                        class="flex flex-col p-4 rounded-lg gap-y-3"
                    />
                </template>
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

    const openKeys = ref(['slack'])

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

<style lang="less" module>
    .menu {
        div {
            line-height: normal;
        }
        @apply border-none  !important;
        :global(.ant-menu-submenu-title) {
            @apply h-full p-0 m-0 !important;
            :global(.ant-menu-title-content + svg) {
                @apply hidden !important;
            }
        }

        :global(.ant-menu) {
        }

        :global(.ant-menu-inline) {
            @apply bg-white !important;
        }
    }
</style>
