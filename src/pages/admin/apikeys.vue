<template>
    <ListAPIKeys />
</template>
<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import ListAPIKeys from '~/components/admin/apikeys/listApiKeys.vue'

    export default defineComponent({
        components: { ListAPIKeys },
        setup() {
            useHead({
                title: 'API keys',
            })
        },
    })
</script>
<style lang="less" module></style>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
