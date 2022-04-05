<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        name: 'WorkflowV2Wrapper',
        setup() {
            const router = useRouter()
            router.replace('/workflowsv2/monitor')
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
