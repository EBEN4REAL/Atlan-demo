<template>
    <Edit v-if="tenantJiraStatus.configured" />
    <Add v-else />
</template>

<script setup lang="ts">
    import { ref, toRefs, watch } from 'vue'
    import integrationStore from '~/store/integrations/index'
    import Add from './addJiraCard.vue'
    import Edit from './jiraIntegrationCard.vue'

    const store = integrationStore()

    const { tenantJiraStatus } = toRefs(store)
</script>

<style lang="less" module></style>
