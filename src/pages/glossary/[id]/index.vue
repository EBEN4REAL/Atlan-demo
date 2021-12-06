<script lang="ts">
    import { computed, defineComponent, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    export default defineComponent({
        setup() {
            const route = useRoute()
            const router = useRouter()
            const id = computed(() => route?.params?.id || '')
            router.replace(`/glossary/${id.value}/overview`)
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
