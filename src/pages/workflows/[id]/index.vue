<script lang="ts">
    import { computed, defineComponent } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    export default defineComponent({
        setup() {
            const route = useRoute()
            const router = useRouter()
            const id = computed(() => route?.params?.id || '')
            if (id.value !== 'new')
                router.replace(`/workflows/${id.value}/setup`)
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
