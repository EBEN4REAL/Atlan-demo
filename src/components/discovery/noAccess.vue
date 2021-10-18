<template>
    <div
        class="flex items-center justify-center w-full h-full mx-auto text-lg text-gray-700 "
    >
        <slot></slot>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            type: {
                type: String,
                required: true,
                default: '',
            },
        },
    })
</script>
<style lang="less" module></style>
