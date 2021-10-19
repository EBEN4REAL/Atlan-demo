<template>
    <div class="flex justify-center h-full">
        <setup></setup>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import Setup from './setup.vue'

export default defineComponent({
    name: 'SlackWrapper',
    components: { Setup },
})
</script>

<style>
</style>