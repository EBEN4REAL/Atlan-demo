<template>
    <div class="mt-4 text-sm text-gray-500">
        <p class="mb-3 text-sm">Classifications</p>
        <div
            class="
                items-center
                px-3
                py-1.5
                mr-3
                rounded-full
                text-sm
                cursor-pointer
                bg-gray-light
                text-gray-700
                inline-flex
                hover:bg-primary hover:text-white
            "
        >
            <fa icon="fal plus" class="" />
            <span class="ml-2">Add Classifications</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'Classifications',
    })
</script>
