<template>
    <PurposeView />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'

    import PurposeView from '@/governance/purposes/purposeView.vue'
    // import useAuth from '~/services2/service/composable/useAuth'
    import useAuth from '~/composables/auth/useAuth'
    export default defineComponent({
        components: {
            PurposeView,
        },
        setup() {
            useHead({
                title: 'Purposes',
            })
            const { isAccess } = useAuth()
            return { isAccess }
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
