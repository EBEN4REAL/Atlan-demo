<template>
    <ApiKeysView v-if="isAccess" />
    <NoAccess v-else />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useHead } from '@vueuse/head'
import ApiKeysView from '@/admin/apikeys/apiKeysView.vue'
import NoAccess from '@/common/secured/access.vue'
import useAuth from '~/composables/auth/useAuth'

export default defineComponent({
    components: { ApiKeysView, NoAccess },
    setup() {
        useHead({
            title: 'API keys',
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
    permissions: [LIST_APIKEY]
</route>
