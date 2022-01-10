<template>
    <GroupList v-if="isAccess"></GroupList>
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent, onMounted } from 'vue'
    import { useHead } from '@vueuse/head'
    import GroupList from '@/admin/groups/groups.vue'
    import useAuth from '~/composables/auth/useAuth'
    import NoAccess from '@/common/secured/access.vue'
    import map from '~/constant/accessControl/map'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'GroupsPage',
        components: {
            GroupList,
            NoAccess,
        },
        setup() {
            useHead({
                title: 'Groups',
            })
            const { isAccess } = useAuth()

            onMounted(() => {
                useTrackPage('admin', 'groups')
            })

            return { isAccess, map }
        },
    })
</script>
<style lang="less" module></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_GROUPS]
</route>
