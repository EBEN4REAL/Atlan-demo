<template>
    <p>Empty Widget</p>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRef, toRefs } from 'vue'

    export default defineComponent({
        name: 'Home',
        props: {
            id: {
                type: String,
                required: false,
            },
            label: {
                type: String,
                required: false,
            },
            payload: {
                type: Object,
                required: false,
            },
        },
        components: {},
        setup(props, { emit }) {
            return {}
        },
    })
</script>
