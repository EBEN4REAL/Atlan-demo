<template>
    <Card
        :integration="props.integration"
        :status="userSlackStatus"
        :disable-connect="!tenantSlackStatus.configured"
        @connect="
            () =>
                openSlackOAuth({
                    tenant: false,
                    callback: (s) => call(s),
                })
        "
        @disconnect="disconnect"
    />
</template>

<script setup lang="ts">
    import { computed, toRefs, watch } from 'vue'
    import Card from '../card.vue'
    import integrationStore from '~/store/integrations/index'
    import {
        archiveSlack,
        openSlackOAuth,
    } from '~/composables/integrations/slack/useSlack'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    const emit = defineEmits(['refresh'])

    const call = (s) => {
        console.log('callback called', s)
        if (s === 'success') emit('refresh')
    }

    const props = defineProps({
        integration: { type: Object, required: true },
    })
    const store = integrationStore()
    const { userSlackStatus, tenantSlackStatus } = toRefs(store)
    const pV = computed(() => ({ id: userSlackStatus.value.id }))
    const { data, isLoading, error, disconnect } = archiveSlack(pV)

    watch([data, error], () => {
        if (!error.value)
            useAddEvent('admin', 'integration', 'removed', {
                integration: 'slack',
                level: 'user',
            })
    })
</script>

<style scoped></style>
