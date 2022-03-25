<template>
    <Card
        :integration="integration"
        :status="userJiraStatus"
        :disable-connect="!tenantJiraStatus.configured"
        @connect="handleConnect"
        @disconnect="disconnect"
    />
</template>

<script setup lang="ts">
    import { computed, toRefs, watch } from 'vue'
    import Card from '../card.vue'
    import integrationStore from '~/store/integrations/index'
    import {
        archiveJira,
        connectJira,
    } from '~/composables/integrations/jira/useJira'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    const emit = defineEmits(['refresh'])

    const callback = (s) => {
        console.log('callback called', s)
        if (s === 'success') emit('refresh')
    }

    const props = defineProps({
        integration: { type: Object, required: true },
    })
    const store = integrationStore()
    const { userJiraStatus, tenantJiraStatus } = toRefs(store)
    const pV = computed(() => ({ id: userJiraStatus.value.id }))
    const { data, isLoading, error, disconnect } = archiveJira(pV)

    const { isLoading: configLoading, connect: handleConnect } = connectJira({
        callback,
        tenant: false,
    })

    watch([data, error], () => {
        if (!error.value)
            useAddEvent('admin', 'integration', 'removed', {
                integration: 'slack',
                level: 'user',
            })
    })
</script>

<style scoped></style>
