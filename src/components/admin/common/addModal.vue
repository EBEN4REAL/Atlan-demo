<template>
    <a-modal
        v-bind="$attrs"
        :destroyOnClose="true"
        :footer="null"
        :closable="false"
    >
        <template #title />
        <p class="mb-2 text-sm font-bold text-gray">{{ title }}</p>
        <slot />
        <div class="flex items-center justify-end gap-x-4">
            <AtlanBtn
                @click="$emit('cancel')"
                color="secondary"
                padding="compact"
                >Cancel</AtlanBtn
            >
            <AtlanBtn @click="$emit('ok')" color="primary" padding="compact"
                >Create</AtlanBtn
            >
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        props: { title: String },
        emits: ['cancel', 'ok'],
        components: { AtlanBtn },
    })
</script>
