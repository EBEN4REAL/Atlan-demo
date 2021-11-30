<template>
    <AccessLogsView />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'
import AccessLogsView from '@/governance/accessLogs/accessLogsView.vue'

export default defineComponent({
    components: { AccessLogsView },
    setup() {
        useHead({
            title: 'Access Logs',
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
