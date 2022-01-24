<template>
    <a-modal
        :visible="showSlackConfigModal && !tenantSlackStatus.configured"
        :destroy-on-close="true"
        :footer="null"
        :closable="false"
        :width="692"
        :class="$style.inviteModal"
        @cancel="showSlackConfigModal = false"
    >
        <SlackConfigModal @close="showSlackConfigModal = false" />
    </a-modal>
    <Edit v-if="tenantSlackStatus.configured" />
    <Add v-else @openConfig="showSlackConfigModal = true" />
</template>

<script setup lang="ts">
    import { ref, toRefs } from 'vue'
    import integrationStore from '~/store/integrations/index'
    import Add from './addSlackCard.vue'
    import Edit from './slackIntegrationCard.vue'
    import SlackConfigModal from './slackConfigModal.vue'

    const showSlackConfigModal = ref(false)
    // store
    const store = integrationStore()

    const { tenantSlackStatus } = toRefs(store)
</script>

<style lang="less" module>
    .inviteModal {
        :global(.ant-modal-content) {
            @apply rounded-lg;
        }
    }
</style>
