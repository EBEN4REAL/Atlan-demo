<template>
    <Card
        :integration="props.integration"
        :status="userSlackStatus"
        @connect="
            () =>
                openSlackOAuth({
                    tenant: false,
                    callback: (s) => call(s),
                })
        "
        @disconnect="disconnect"
        :disableConnect="!tenantSlackStatus.configured"
    />
</template>

<script setup lang="ts">
    import { computed, toRefs } from 'vue'
    import Card from '../card.vue'
    import integrationStore from '~/store/integrations/index'
    import {
        archiveSlack,
        openSlackOAuth,
    } from '~/composables/integrations/useSlack'
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
</script>

<style scoped></style>
