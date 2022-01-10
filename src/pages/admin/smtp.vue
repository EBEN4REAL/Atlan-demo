<template>
    <SmtpForm v-if="isAccess" />
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent, onMounted } from 'vue'
    import SmtpForm from '@/admin/smtp/index.vue'
    import { useHead } from '@vueuse/head'

    import useAuth from '~/composables/auth/useAuth'
    import NoAccess from '@/common/secured/access.vue'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: {
            SmtpForm,
            NoAccess,
        },
        setup() {
            useHead({
                title: 'SMTP',
            })
            const { isAccess } = useAuth()
            onMounted(() => {
                useTrackPage('admin', 'smtp')
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
    permissions: [UPDATE_WORKSPACE]
</route>
