<template>
    <PersonaView />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'

    import PersonaView from '@/admin/personas/personaView.vue'
    export default defineComponent({
        components: { PersonaView },
        setup() {
            useHead({
                title: 'Personas',
            })
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
