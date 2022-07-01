<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        name: 'WorkflowV1Redirector',
        setup() {
            const router = useRouter()
            router.replace('/workflows/manage')
        },
    })
</script>
