<template>
    <PersonaView v-if="isAccess" />
    <NoAccess v-else />
    <router-view />
</template>

<script lang="ts">
    import { defineComponent, onMounted, watch, computed } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useDebounceFn } from '@vueuse/core'
    import { useRoute } from 'vue-router'
    import NoAccess from '@/common/secured/access.vue'
    import PersonaView from '@/governance/personas/personaView.vue'
    import useAuth from '~/composables/auth/useAuth'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: {
            PersonaView,
            NoAccess,
        },
        setup() {
            const route = useRoute()
            const id = computed(() => route?.params?.id || null)

            useHead({
                title: 'Personas',
            })
            const { isAccess } = useAuth()

            const sendPageEvent = useDebounceFn(() => {
                if (id.value) {
                    useTrackPage('governance', 'personas')
                }
            }, 500)

            onMounted(() => {
                sendPageEvent()
            })

            watch(id, () => {
                if (id.value) {
                    sendPageEvent()
                }
            })

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
