<template>
    <OrgOverview v-if="isAccess"></OrgOverview>
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import OrgOverview from '@/admin/overview/index.vue'
    import useAuth from '~/services2/service/composable/useAuth'

    export default defineComponent({
        name: 'Overview',
        components: { OrgOverview },
        setup() {
            useHead({
                title: 'Overview',
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
    permissions: [UPDATE_WORKSPACE]
</route>
