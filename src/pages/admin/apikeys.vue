<template>
    <ListAPIKeys />
</template>
<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import ListAPIKeys from '~/components/admin/apikeys/listApiKeys.vue'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        components: { ListAPIKeys },
        setup() {
            useHead({
                title: 'API keys',
            })
            const { isAccess } = useAuth()

            return {
                isAccess,
            }
        },
    })
</script>
<style lang="less" module></style>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
