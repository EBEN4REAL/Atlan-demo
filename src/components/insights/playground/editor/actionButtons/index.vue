<template>
    <div></div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, ref } from 'vue'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            return {}
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
