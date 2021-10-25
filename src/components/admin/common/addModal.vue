<template>
    <a-modal
        v-bind="$attrs"
        :destroyOnClose="true"
        :footer="null"
        :closable="false"
    >
        <template #title />
        <p class="mb-4 text-base font-bold text-gray">{{ title }}</p>
        <slot />
        <div class="flex items-center justify-end gap-x-4">
            <AtlanBtn
                color="secondary"
                padding="compact"
                @click="$emit('cancel')"
                >Cancel</AtlanBtn
            >
            <AtlanBtn padding="compact" @click="$emit('ok')">Create</AtlanBtn>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        components: { AtlanBtn },
        props: { title: String },
        emits: ['cancel', 'ok'],
    })
</script>
