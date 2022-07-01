<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    export default defineComponent({
        name: 'WorkflowV1SetupRedirector',
        setup() {
            const router = useRouter()
            const route = useRoute()
            router.replace(`/workflows/setup/${route.params.id}`)
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
