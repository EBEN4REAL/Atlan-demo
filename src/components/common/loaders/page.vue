<template>
    <div
        class="flex items-center justify-center w-full min-h-screen mt-1 min-w-screen"
    >
        <AtlanLoader class="h-10" />
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
