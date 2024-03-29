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
        <span v-if="headline" class="text-xl font-bold">{{ headline }}</span>
        <p
            v-if="desc"
            style="max-width: 18rem"
            :class="descClass || 'text-center'"
        >
            {{ desc }}
        </p>
        <AtlanButton2
            v-if="buttonText && buttonVisibility"
            size="medium"
            :class="buttonClass"
            :color="buttonColor"
            :prefix-icon="buttonIcon"
            :prefixIconClass="buttonIconClass"
            :label="buttonText"
            @click="handleClick"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import AtlanButton from '~/components/UI/button.vue'

    export default defineComponent({
        name: 'EmptyPlaceholder',
        components: { AtlanButton },
        props: {
            headline: {
                type: String,
                required: false,
                default: '',
            },
            class: {
                type: String,
                required: false,
                default: '',
            },
            imageClass: {
                type: String,
                required: false,
                default: 'h-32',
            },
            descClass: {
                type: String,
                required: false,
                default: '',
            },
            desc: {
                type: String,
                required: false,
                default: '',
            },
            emptyScreen: {
                type: String,
                required: false,
                default: '',
            },
            buttonText: {
                type: String,
                required: false,
                default: '',
            },
            buttonClass: {
                type: String,
                required: false,
                default: 'w-36 mt-11',
            },
            buttonColor: {
                type: String as PropType<
                    'primary' | 'secondary' | 'light' | 'minimal'
                >,
                required: false,
                default: 'primary',
            },
            buttonIcon: {
                type: String,
                required: false,
                default: '',
            },
            buttonIconClass: {
                type: String,
                required: false,
                default: '',
            },
            buttonVisibility: {
                type: Boolean,
                required: false,
                default: true,
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
