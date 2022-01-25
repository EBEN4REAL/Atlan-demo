<template>
    <section class="px-5 py-4 space-y-4">
        <h1 class="text-lg font-bold text-gray-500">Integrations</h1>
        <UserSlack :integration="user_integration_list.slack" />
    </section>
</template>

<script setup lang="ts">
    import { user_integration_list } from '~/constant/integrations'
    import UserSlack from './wrappers/userSlack.vue'
</script>

<style scoped></style>
