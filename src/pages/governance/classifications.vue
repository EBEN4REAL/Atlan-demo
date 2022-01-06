<template>
    <Classifications v-if="isAccess" />
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent, computed, onMounted, watch } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useDebounceFn } from '@vueuse/core'
    import Classifications from '@/governance/classifications/classifications.vue'
    import NoAccess from '@/common/secured/access.vue'

    import useAuth from '~/composables/auth/useAuth'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'
    import { useRoute } from 'vue-router'

    export default defineComponent({
        name: 'ClassificationsPage',
        components: {
            NoAccess,
            Classifications,
        },
        setup() {
            useHead({
                title: 'Classifications',
            })
            const route = useRoute()
            const id = computed(() => route?.params?.classificationId || null)

            const sendPageEvent = useDebounceFn(() => {
                if (id.value) {
                    useTrackPage('governance', 'classifications')
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
            const { isAccess } = useAuth()
            return { isAccess }
        },
    })
</script>
<style lang="less" module></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_CLASSIFICATION]
    redirect: false
</route>
