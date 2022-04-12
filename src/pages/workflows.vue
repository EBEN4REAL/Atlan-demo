<template>
    <router-view></router-view>
</template>
<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter, onBeforeRouteUpdate, useRoute } from 'vue-router'

    export default defineComponent({
        name: 'WorkflowV2Wrapper',
        setup() {
            const router = useRouter()
            const route = useRoute()

            if (!route.params?.tab) router.replace('/workflows/monitor')

            onBeforeRouteUpdate((to, _, next) => {
                if (to.path === '/workflows') next('/workflows/monitor')
                else next(true)
            })
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
