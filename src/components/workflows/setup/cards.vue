<template>
    <div class="flex flex-wrap justify-between gap-y-5">
        <div
            v-for="(i, x) in list"
            :key="x"
            class="flex items-center justify-center w-40 h-24 border-2"
        >
            {{ i.metadata.name }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'WorkflowCards',
        props: {
            list: {
                type: Array,
                required: true,
            },
        },
        setup() {
            return {}
        },
    })
</script>

<style scoped></style>
