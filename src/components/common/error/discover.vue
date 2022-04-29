<template>
    <div
        class="flex flex-col items-center justify-center w-full h-full text-center"
    >
        <AtlanIcon icon="SomethingWrong" class="w-auto h-32"></AtlanIcon>
        <p class="mt-2 mb-2 text-gray-500">Oops! Something went wrong.</p>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        components: {},
        props: {
            empty: {
                type: String,
                required: false,
                default: () => '',
            },
            type: {
                type: String,
                default: () => 'Assets',
            },
            buttonText: {
                type: String,
                required: false,
                default: () => '',
            },
            showClearFiltersCTA: {
                type: Boolean,
                default: () => true,
            },
        },
        emits: ['event'],
        setup(props, { emit }) {
            const handleClick = () => {
                emit('event')
            }
            const { type } = props
            return {
                handleClick,
                type,
            }
        },
    })
</script>
