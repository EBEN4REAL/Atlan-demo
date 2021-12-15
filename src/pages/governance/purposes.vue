<template>
    <PurposeView v-if="isAccess" />
     <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
     import NoAccess from '@/common/secured/access.vue'
    import PurposeView from '@/governance/purposes/purposeView.vue'
    // import useAuth from '~/services2/service/composable/useAuth'
    import useAuth from '~/composables/auth/useAuth'
    export default defineComponent({
        components: {
            PurposeView,
            NoAccess
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
    permissions: [LIST_PURPOSE]
</route>
