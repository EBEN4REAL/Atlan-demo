<script lang="ts">
    import { computed, defineComponent } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    export default defineComponent({
        setup() {
            const route = useRoute()
            const router = useRouter()
            const id = computed(() => route?.params?.id || '')
            const tab = computed(() => route?.params?.tab || 'runs')
            router.replace({
                path: `/workflows/profile/${id.value}/${tab.value}`,
                params: route.params,
            })
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
