<template>
    <PersonaView />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'

    import PersonaView from '@/admin/personas/personaView.vue'
    import useAuth from '~/services2/service/composable/useAuth'
    export default defineComponent({
        components: { PersonaView },
        setup() {
            useHead({
                title: 'Personas',
            })
            const { isAccess } = useAuth()
            return { isAccess }
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
