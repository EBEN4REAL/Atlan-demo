<template>
    <PurposeView v-if="isAccess" />
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent, computed, onMounted, watch } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useDebounceFn } from '@vueuse/core'
    import NoAccess from '@/common/secured/access.vue'
    import PurposeView from '@/governance/purposes/purposeView.vue'
    // import useAuth from '~/services2/service/composable/useAuth'
    import useAuth from '~/composables/auth/useAuth'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'
    import { useRoute } from 'vue-router'

    export default defineComponent({
        components: {
            PurposeView,
            NoAccess,
        },
        setup() {
            useHead({
                title: 'Purposes',
            })
            const route = useRoute()
            const id = computed(() => route?.params?.id || null)
            const { isAccess } = useAuth()

            const sendPageEvent = useDebounceFn(() => {
                if (id.value) {
                    useTrackPage('governance', 'purposes')
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
    requiresAuth: true
    permissions: [LIST_PURPOSE]
</route>
