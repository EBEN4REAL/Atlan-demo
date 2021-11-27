<template>
    <QueryLogsView />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'
import QueryLogsView from '@/governance/queryLogs/queryLogsView.vue'

export default defineComponent({
    components: { QueryLogsView },
    setup() {
        useHead({
            title: 'Query Logs',
        })
    },
})
</script>
<style lang="less" module></style>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
