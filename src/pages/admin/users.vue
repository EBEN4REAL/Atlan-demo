<template>
    <Users v-if="isAccess"></Users>
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent, onMounted } from 'vue'
    import { useHead } from '@vueuse/head'
    import Users from '@/admin/users/users.vue'
    import NoAccess from '@/common/secured/access.vue'

    import useAuth from '~/composables/auth/useAuth'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'UserPage',
        components: {
            Users,
            NoAccess,
        },
        setup() {
            useHead({
                title: 'Users',
            })
            const { isAccess } = useAuth()
            onMounted(() => {
                useTrackPage('admin', 'users')
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
    permissions: [LIST_USERS]
    redirect: false
</route>
