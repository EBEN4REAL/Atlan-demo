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
        <AtlanButton
            v-if="buttonText"
            class="w-36 mt-11"
            size="lg"
            :color="buttonColor"
            padding="compact"
            @click="handleClick"
        >
            {{ buttonText }}
            <AtlanIcon v-if="buttonIcon" :icon="buttonIcon" class="inline" />
        </AtlanButton>
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
