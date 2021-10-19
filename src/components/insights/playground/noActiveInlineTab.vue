<template>
    <div
        class="flex items-center justify-center w-full h-full p-3 bg-white rounded "
    >
        <div class="flex flex-col items-center justify-center text-primary">
            <AtlanIcon icon="AddQuery" class="z-30 w-40 h-36" />
            <p class="my-8 text-2xl font-bold text-gray-700">
                Your results will appear here
            </p>
            <a-button
                type="primary"
                class="w-48 text-sm rounded h-9"
                @click="handleAdd"
                >+ Create a new query</a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'

    export default defineComponent({
        emits: ['handleAdd'],
        components: {},
        props: {},
        setup(props, { emit }) {
            const handleAdd = () => {
                emit('handleAdd')
            }
            return {
                handleAdd,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
