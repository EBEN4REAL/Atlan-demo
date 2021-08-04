<template>
    <RequestList :list="requestList" />
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import RequestList from '@/admin/requests/requestList.vue'
    import useRequests from '~/composables/requests/useRequests'

    export default defineComponent({
        components: { RequestList },
        setup() {
            useHead({
                title: 'Requests',
            })
            const { response } = useRequests()
            const requestList = computed(() => response.value?.records || [])
            return { requestList }
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
