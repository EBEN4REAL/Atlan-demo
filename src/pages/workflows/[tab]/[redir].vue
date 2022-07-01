<!-- Dummy redirection component, need to delete later after workflowsv2 migration is complete -->

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    export default defineComponent({
        setup() {
            const route = useRoute()
            const router = useRouter()

            const newRoute = route.fullPath.replace(
                '/workflows/',
                '/workflows/profile/'
            )
            router.replace(newRoute)
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
