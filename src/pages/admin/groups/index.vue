<template>
    <GroupList v-if="isAccess"></GroupList>
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import GroupList from '@/admin/groups/index.vue'
    import useAuth from '~/services2/service/composable/useAuth'
    import NoAccess from '@/admin/common/noAccessPage.vue'

    export default defineComponent({
        components: {
            GroupList,
            NoAccess,
        },
        setup() {
            useHead({
                title: 'Groups',
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
    permissions: [LIST_GROUPS]
</route>
