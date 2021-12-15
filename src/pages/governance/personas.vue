<template>
    <PersonaView v-if="isAccess" />
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import NoAccess from '@/common/secured/access.vue'
    import PersonaView from '@/governance/personas/personaView.vue'
    import useAuth from '~/composables/auth/useAuth'
    export default defineComponent({
        components: {
            PersonaView,
            NoAccess
        },
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
    permissions: [LIST_PERSONA]
    requiresAuth: true
</route>
