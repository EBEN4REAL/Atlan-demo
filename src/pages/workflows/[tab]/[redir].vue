<!-- Dummy redirection component, need to delete later after workflowsv2 migration is complete -->

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import {
        featureEnabledMap,
        WORKFLOW_CENTER_V2,
    } from '~/composables/labs/labFeatureList'

    export default defineComponent({
        setup() {
            const route = useRoute()
            const router = useRouter()

            if (featureEnabledMap.value[WORKFLOW_CENTER_V2]) {
                const newRoute = route.fullPath.replace(
                    '/workflows/',
                    '/workflows/profile/'
                )
                router.replace(newRoute)
            } else {
                // redirect to v1 when flag disabled
                const newRoute = route.fullPath.replace(
                    '/workflows/',
                    '/workflowsv1/'
                )
                router.replace(newRoute)
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
