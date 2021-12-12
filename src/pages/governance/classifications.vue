<template>
    <Classifications v-if="isAccess" />
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import Classifications from '@/governance/classifications/classifications.vue'
    import NoAccess from '@/common/secured/access.vue'

    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        name: 'ClassificationsPage',
        components: {
            NoAccess,
            Classifications,
        },
        setup() {
            useHead({
                title: 'Classifications',
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
    permissions: [LIST_CLASSIFICATION]
    redirect: false
</route>
