<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        setup() {
            const router = useRouter()
            router.replace(`/governance/personas`)
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
