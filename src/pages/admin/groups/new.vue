<template>
    <AddGroup />
</template>

<script lang="ts">
    import { useRouter } from 'vue-router'
    import AddGroup from '@/admin/groups/addGroup.vue'

    export default {
        name: 'NewGroup',
        components: {
            AddGroup,
        },
        setup() {
            const router = useRouter()
            const routeToGroups = () => {
                router.push(`/admin/groups`)
            }
            return { routeToGroups }
        },
    }
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
