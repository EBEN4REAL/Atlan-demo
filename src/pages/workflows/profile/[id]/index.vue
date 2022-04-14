<script lang="ts">
    import { computed, defineComponent } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    export default defineComponent({
        name: 'WFProfileId',
        setup() {
            const route = useRoute()
            const router = useRouter()
            const id = computed(() => route?.params?.id || '')
            router.replace(`/workflows/profile/${id.value}/runs`)
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
