<template>
    <div v-if="status === 'abort'">
        <span
            class="p-1 rounded"
            style="
                font-size: 10px !important;
                color: #a35a00;
                background-color: #feebdd;
                font-family: Hack;
            "
            >Aborted</span
        >
    </div>

    <div v-if="status === 'success'">
        <span
            class="p-1 rounded"
            style="
                font-size: 10px !important;
                color: #008062;
                background-color: #e3fdf7;
                font-family: Hack;
            "
            >Success</span
        >
    </div>

    <div v-if="status === 'error'">
        <span
            class="p-1 rounded"
            style="
                font-size: 10px !important;
                color: #c62f2f;
                background-color: #ffe5e5;
                font-family: Hack;
            "
            >Failed</span
        >
    </div>
</template>

<script>
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'QueryStatus',
        props: {
            status: {
                type: String,
                required: true,
            },
        },
        setup() {},
    })
</script>

<style lang="less" scoped>
    @font-face {
        font-family: Hack;
        src: url('~/assets/fonts/hack/Hack-Regular.ttf');
    }
</style>
