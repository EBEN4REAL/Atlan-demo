<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        name: 'PlatformPage',
        setup() {
            const router = useRouter()
            router.replace(`/platform/services`)
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
