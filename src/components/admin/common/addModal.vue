<template>
    <a-modal
        v-bind="$attrs"
        :destroy-on-close="true"
        :footer="null"
        :closable="false"
        :mask-closable="false"
    >
        <div class="p-4 rounded">
            <!-- <template #title />
        <p class="mb-4 text-base font-bold text-gray">{{ title }}</p> -->
            <slot />
            <div
                class="flex items-center gap-x-4"
                :class="extraFooterContent ? 'justify-between' : 'justify-end '"
            >
                <slot name="extraFooterContent" />
                <div class="flex items-center gap-x-4">
                    <AtlanBtn
                        color="secondary"
                        padding="compact"
                        class="border-none"
                        @click="$emit('cancel')"
                        >{{ cancelText }}</AtlanBtn
                    >
                    <AtlanBtn
                        :disabled="!title ? true : false"
                        padding="compact"
                        @click="$emit('ok')"
                        >{{ okText }}</AtlanBtn
                    >
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        components: { AtlanBtn },
        props: {
            title: { type: String, required: true },
            okText: { type: String, required: false, default: () => 'Create' },
            cancelText: {
                type: String,
                required: false,
                default: () => 'Cancel',
            },
        },
        emits: ['cancel', 'ok'],
        setup(_, { slots }) {
            const extraFooterContent = computed(
                () =>
                    slots.extraFooterContent &&
                    slots.extraFooterContent().length
            )
            return {
                extraFooterContent,
            }
        },
    })
</script>
