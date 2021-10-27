<template>
    <div
        class="flex flex-col items-center justify-center w-full h-full text-center "
    >
        <AtlanIcon icon="EmptyDiscover" class="w-auto h-32"></AtlanIcon>
        <p class="mt-2 mb-2 text-gray-500">
            We didnt find anything that matches your search criteria
        </p>
        <a-button class="mt-3" @click="handleClick">Reset Filters</a-button>
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
                default() {
                    return ''
                },
            },
            type: {
                type: String,
                default: 'Assets',
            },
            buttonText: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            showClearFiltersCTA: {
                type: Boolean,
                default: true,
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
