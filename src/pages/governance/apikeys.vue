<template>
    <ApiKeysView />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'
import ApiKeysView from '@/governance/apikeys/apiKeysView.vue'

export default defineComponent({
    components: { ApiKeysView },
    setup() {
        useHead({
            title: 'API keys',
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
