<template>
    <router-view v-slot="{ Component, route }">
        <keep-alive
            :max="3"
            exclude="WorkflowSetupPage,WorkflowProfileTabWrapper,WFProfileId"
        >
            <component
                :is="Component"
                :key="`${route.name}${route.params?.id || ''}`"
            />
        </keep-alive>
    </router-view>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter, onBeforeRouteUpdate, useRoute } from 'vue-router'

    import {
        featureEnabledMap,
        WORKFLOW_CENTER_V2,
    } from '~/composables/labs/labFeatureList'

    export default defineComponent({
        name: 'WorkflowV2Wrapper',
        setup() {
            const router = useRouter()
            const route = useRoute()

            if (!featureEnabledMap.value[WORKFLOW_CENTER_V2]) {
                router.replace('/workflowsv1')
                return
            }

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
