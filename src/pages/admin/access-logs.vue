<template>
    <AccessLogsView v-if="isAccess" />
    <NoAccess v-else />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'
import AccessLogsView from '@/governance/accessLogs/accessLogsView.vue'
import NoAccess from '@/common/secured/access.vue'
import useAuth from '~/composables/auth/useAuth'

export default defineComponent({
    components: { AccessLogsView, NoAccess },
    setup() {
        useHead({
            title: 'Access Logs',
        })
        const { isAccess } = useAuth()
        return { isAccess }
    },
})
</script>
<style lang="less" module></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [QUERY_ACCESS_LOGS]
</route>
