<template>
    <b>Status</b> changed to
    <fa
        :icon="data.value.icon"
        :class="data.value.iconClass"
        class="mx-1 pushtop"
    ></fa
    ><b>{{ data.value.label }}</b>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            data,
        },
    })
</script>
