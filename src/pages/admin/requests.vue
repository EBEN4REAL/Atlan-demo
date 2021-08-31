<template>
    <RequestList />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import RequestList from '@/admin/requests/requestList.vue'

    export default defineComponent({
        components: { RequestList },
        setup() {
            useHead({
                title: 'Requests',
            })
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
