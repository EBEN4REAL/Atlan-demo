<template>
    <div>Overview</div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'

    export default defineComponent({
        components: {},
        setup() {
            useHead({
                title: 'Overview',
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
