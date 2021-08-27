<template>
    <button
        :tabindex="$attrs.onClick ? 0 : undefined"
        class="flex items-center gap-2 px-3 m-1 text-gray-700 border rounded-full cursor-pointer  border-gray-light bg-gray-light"
        style="height: 30px"
    >
        <slot name="prefix"></slot>
        <span v-if="label">{{ label }}</span>

        <button
            v-if="$attrs.onAction"
            :tabindex="$attrs.onAction ? 0 : undefined"
            @click.stop="emitActions"
        >
            <slot v-if="$slots.action" name="action" />
            <AtlanIcon v-else icon="Cancel" />
        </button>
    </button>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    export default defineComponent({
        name: 'Pill',
        props: {
            label: {
                type: String,
                default: () => '',
            },
            disabled: {
                type: Boolean,
                default: () => false,
            },
        },
        // Do not uncomment, else code will break
        // emits: ['action'],
        setup(prop, { emit }) {
            const { disabled } = toRefs(prop)
            function emitActions() {
                if (!disabled.value) emit('action')
            }
            return { emitActions }
        },
    })
</script>
