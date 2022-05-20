<template>
    <section class="px-5 py-4 space-y-4">
        <h1 class="text-lg font-bold text-gray-500">Integrations</h1>
        <UserSlack
            v-if="tenantSlackStatus.configured"
            :integration="user_integration_list.slack"
            @refresh="$emit('success')"
        />
        <UserJira
            v-if="tenantJiraStatus.configured"
            :integration="user_integration_list.jira"
            @refresh="$emit('success')"
        />
    </section>
</template>

<script setup lang="ts">
    import { toRefs } from 'vue'
    import { user_integration_list } from '~/constant/integrations/integrations'
    import UserSlack from './wrappers/userSlack.vue'
    import UserJira from './wrappers/userJira.vue'
    import integrationStore from '~/store/integrations/index'

    const store = integrationStore()
    const { tenantSlackStatus, tenantJiraStatus } = toRefs(store)
</script>

<style scoped></style>
