<template>
    <div
        class="flex flex-col items-center justify-center w-full h-full mx-auto"
    >
        <AtlanIcon icon="NoAccess" class="w-auto" style="height: 120px" />
        <div class="mt-8 text-sm text-gray-500"><slot></slot></div>
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
