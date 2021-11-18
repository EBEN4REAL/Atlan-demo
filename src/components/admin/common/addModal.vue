<template>
    <a-modal
        v-bind="$attrs"
        :destroy-on-close="true"
        :footer="null"
        :closable="false"
        :mask-closable="false"
    >
        <!-- <template #title />
        <p class="mb-4 text-base font-bold text-gray">{{ title }}</p> -->
        <slot />
        <div class="flex items-center justify-between gap-x-4">
            <slot name="extraFooterContent" />
            <div class="flex gap-x-4">
                <AtlanBtn
                    color="secondary"
                    padding="compact"
                    @click="$emit('cancel')"
                    >{{ cancelText }}</AtlanBtn
                >
                <AtlanBtn padding="compact" @click="$emit('ok')">{{
                    okText
                }}</AtlanBtn>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
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
    })
</script>
