<template>
    <div>
        <!-- Asset Image Preview -->
        <div class="">
            <a-image :src="imagePreview" />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            imagePreview: {
                type: String,
                required: true,
            },
        },
    })
</script>

<style lang="less" scoped></style>
