<template>
    <div
        class="flex items-center justify-center w-full min-h-screen mt-1  min-w-screen"
    >
        <AtlanIcon icon="Loader" class="w-auto h-10 animate-spin"></AtlanIcon>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'HelloWorld',
        props: {
            size: {
                type: String,
                required: false,
                default() {
                    return 'default'
                },
            },
        },
        computed: {},
        mounted() {},
        methods: {},
    })
</script>
