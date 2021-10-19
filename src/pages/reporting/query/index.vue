<template>
    <DashboardComponent :data="Metadata"></DashboardComponent>
</template>
<script lang="ts">
    import { defineComponent } from 'vue'
    import DashboardComponent from '@/reporting/dashboard.vue'
    import { useHead } from '@vueuse/head'

    import { Metadata } from './dashboard'

    export default defineComponent({
        components: {
            DashboardComponent,
        },
        setup() {
            useHead({
                title: 'Reporting',
            })

            return { Metadata }
        },
    })
</script>
<style lang="less" module></style>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
