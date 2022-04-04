<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        setup() {
            const router = useRouter()
            // url -> workflowsv2/profile redirects to 👇
            router.replace('/workflowsv2/monitor')
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
