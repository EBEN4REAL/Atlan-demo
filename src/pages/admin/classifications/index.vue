<template></template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import useAuth from '~/services2/service/composable/useAuth'
    export default defineComponent({
        name: 'ClassificationProfileWrapper',
        setup() {
            const { isAccess } = useAuth()

            return { isAccess }
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
