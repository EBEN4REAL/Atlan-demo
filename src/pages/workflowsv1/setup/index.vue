<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        name: 'WorkflowV1SetupRedirector',
        setup() {
            const router = useRouter()
            router.replace('/workflows/marketplace')
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
