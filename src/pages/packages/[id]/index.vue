<script lang="ts">
    import { computed, defineComponent } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    export default defineComponent({
        setup() {
            const route = useRoute()
            const router = useRouter()
            const id = computed(() => route?.params?.id || '')
            const sandbox = computed(() => route?.query?.sandbox || '')
            if (sandbox.value) {
                router.replace({
                    path: `/packages/${id.value}/setup`,
                    query: { sandbox: 'true' },
                })
            } else {
                router.replace(`/packages/${id.value}/setup`)
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
