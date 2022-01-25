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
    <Edit v-if="tenantSlackStatus.configured" />
    <Add v-else @openConfig="showSlackConfigModal = true" />
</template>

<script setup lang="ts">
    import { ref, toRefs, watch } from 'vue'
    import integrationStore from '~/store/integrations/index'
    import Add from './addSlackCard.vue'
    import Edit from './slackIntegrationCard.vue'
    import SlackConfigModal from './slackConfigModal.vue'

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
