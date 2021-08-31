<template>
    <RequestList
        @approve="handleApproval"
        @reject="handleRejection"
        :list="requestList"
    />
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
            const { response, takeAction } = useRequests()
            const requestList = computed(() => response.value?.records || [])

            async function handleApproval(reqId: string) {
                takeAction(reqId, {
                    action: 'approved',
                    message: 'testing approval',
                })
            }
            async function handleRejection(reqId: string) {
                takeAction(reqId, {
                    action: 'rejected',
                    message: 'testing rejection',
                })
            }
            return { requestList, handleApproval, handleRejection }
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
