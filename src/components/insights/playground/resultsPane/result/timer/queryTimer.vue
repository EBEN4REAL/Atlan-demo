<template>
    <div
        :id="`${timerId}`"
        class="flex justify-center w-full mt-1 text-sm text-gray-700"
    >
        00:00:00:000
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        props: {
            timerId: {
                type: String,
                required: true,
            },
        },
        setup() {
            return {}
        },
    })
</script>
