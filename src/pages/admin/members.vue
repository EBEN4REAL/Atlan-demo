<template>
    <Users v-if="isAccess"></Users>
    <NoAccess v-else />
</template>
<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import Users from '@/admin/users/index.vue'
    import NoAccess from '@/admin/common/noAccessPage.vue'
    import useAuth from '~/services2/service/composable/useAuth'

    export default defineComponent({
        components: {
            Users,
            NoAccess,
        },
        setup() {
            useHead({
                title: 'Members',
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
    permissions: [LIST_USERS]
    redirect: false
</route>
