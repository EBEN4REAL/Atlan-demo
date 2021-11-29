<template>
    <!-- TODO: Add disabled styles -->
    <button
        :tabindex="!disabled && $attrs.onClick ? 0 : undefined"
        :data-test-id="dataTestId"
        class="relative flex items-center text-gray-700 transition duration-300 border border-gray-300 rounded-full cursor-pointer  gap-x-1 group hover:border-primary hover:bg-primary hover:text-white"
        :class="size === 'sm' ? 'px-2' : 'px-3'"
        :style="{ height: size === 'sm' ? '22px' : '30px' }"
        @blur="blur"
    >
        <slot name="prefix"></slot>
        <div v-if="label" class="flex items-center">
            <span v-if="prefixIcon">
                <AtlanIcon :icon="prefixIcon" class="h-4 -ml-0.5 mr-1" />
            </span>
            <span>
                {{ label }}
            </span>
        </div>

        <button
            class="absolute right-0 h-full pl-4 pr-2 transition duration-300 rounded-tr-full rounded-br-full opacity-0  group-hover:opacity-100 bg-gradient-to-l from-primary via-primary"
            v-if="!disabled && hasAction"
            :tabindex="!disabled && hasAction ? 0 : undefined"
            @click.stop="emitActions"
            data-test-id="cancel"
            @blur="blur"
        >
            <slot v-if="$slots.action" name="action" />
            <AtlanIcon v-else class="h-3 text-white" icon="Cancel" />
        </button>
    </button>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    export default defineComponent({
        name: 'Pill',
        props: {
            label: {
                type: String,
                default: () => '',
            },
            prefixIcon: {
                type: String,
                default: undefined,
            },
            disabled: {
                type: Boolean,
                default: () => false,
            },
            hasAction: {
                type: Boolean,
                default: () => false,
            },
            hoveredPill: {
                type: Boolean,
                default: true,
            },
            dataTestId: {
                type: String,
                default: () => 'add',
                required: false,
            },
            size: {
                type: String as PropType<'md' | 'sm'>,
                default: () => 'md',
            },
        },
        // Do not uncomment, else code will break
        emits: ['action', 'blur'],
        setup(prop, { emit }) {
            const { disabled } = toRefs(prop)
            function emitActions() {
                if (!disabled.value) emit('action')
            }
            const blur = () => {
                emit('blur')
            }
            console.log()
            return { emitActions, blur }
        },
    })
</script>
