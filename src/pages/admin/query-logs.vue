<template>
    <QueryLogsView v-if="isAccess" />
    <NoAccess v-else />
</template>
<script lang="ts">
    import { defineComponent, onMounted } from 'vue'
    import { useHead } from '@vueuse/head'
    import QueryLogsView from '@/governance/queryLogs/queryLogsView.vue'
    import NoAccess from '@/common/secured/access.vue'
    import useAuth from '~/composables/auth/useAuth'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: { QueryLogsView, NoAccess },
        setup() {
            useHead({
                title: 'Query Logs',
            })
            const { isAccess } = useAuth()
            onMounted(() => {
                useTrackPage('admin', 'query_logs')
            })
            return { isAccess }
        },
    })
</script>
<style lang="less" module></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [QUERY_SQL_LOGS]
</route>
