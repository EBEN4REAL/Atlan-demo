<template>
    <div
        class="flex flex-col items-center justify-center w-full h-full text-center"
    >
        <img :src="image" class="w-1/3 h-auto" />
        <p class="mt-2 mb-2">No {{ type }} Found</p>
        <a-button v-if="showClearFiltersCTA" @click="handleClick" class="mt-3"
            >Clear all filters</a-button
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import image from '~/assets/images/empty_discover.png';
    export default defineComponent({
        components: {},
        props: {
            empty: {
                type: String,
                required: false,
                default() {
                    return '';
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
                    return '';
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
                emit('event');
            };
            const type = props.type;
            return {
                type,
                handleClick,
                image,
            };
        },
    });
</script>
