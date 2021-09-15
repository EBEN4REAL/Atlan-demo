<template>
    <!-- TODO: Add disabled styles -->
    <button
        :tabindex="!disabled && $attrs.onClick ? 0 : undefined"
        class="flex items-center gap-2 px-2 text-gray-700 transition duration-300 border rounded-full cursor-pointer  border-gray-light hover:border-primary hover:bg-primary hover:text-white"
        style="height: 30px"
    >
        <slot name="prefix"></slot>
        <span v-if="label">{{ label }}</span>

        <button
            v-if="!disabled && hasAction"
            :tabindex="!disabled && hasAction ? 0 : undefined"
            @click.stop="emitActions"
        >
            <slot v-if="$slots.action" name="action" />
            <AtlanIcon v-else class="h-2 text-sm text-gray-400" icon="Cancel" />
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
            hasAction: {
                type: Boolean,
                default: () => false,
            },
        },
        // Do not uncomment, else code will break
        emits: ['action'],
        setup(prop, { emit }) {
            const { disabled } = toRefs(prop)
            function emitActions() {
                if (!disabled.value) emit('action')
            }
            console.log()
            return { emitActions }
        },
    })
</script>
