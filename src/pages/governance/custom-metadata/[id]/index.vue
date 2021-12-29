<script lang="ts">
    import { defineComponent } from 'vue'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        name: 'CustomMetadataSelected',
        setup() {
            const { isAccess } = useAuth()

            return { isAccess }
        },
    })
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_BUSINESS_METADATA]
    redirect: false
</route>
