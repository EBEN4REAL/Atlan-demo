<template>
    <div
        :class="class"
        class="flex flex-col items-center justify-center h-full gap-y-3"
    >
        <AtlanIcon
            v-if="emptyScreen"
            :icon="emptyScreen"
            alt=""
            :class="imageClass"
        />
        <span v-if="headline" class="text-3xl font">{{ headline }}</span>
        <p
            v-if="desc"
            style="max-width: 29rem"
            :class="descClass || 'text-lg text-center'"
        >
            {{ desc || empty }}
        </p>
        <AtlanButton
            v-if="buttonText"
            class="w-36 mt-11"
            size="lg"
            color="primary"
            padding="compact"
            @click="handleClick"
        >
            {{ buttonText }}
            <AtlanIcon v-if="buttonIcon" :icon="buttonIcon" class="inline" />
        </AtlanButton>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanButton from '~/components/UI/button.vue'

    export default defineComponent({
        name: 'EmptyPlaceholder',
        components: { AtlanButton },
        props: {
            headline: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            class: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            imageClass: {
                type: String,
                required: false,
                default() {
                    return 'h-32'
                },
            },
            class: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            descClass: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            desc: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            emptyScreen: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            buttonText: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            buttonIcon: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['event'],
        setup(props, { emit }) {
            const handleClick = () => {
                emit('event')
            }
            return {
                handleClick,
            }
        },
    })
</script>
