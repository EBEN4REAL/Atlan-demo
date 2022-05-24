<template>
    <a-dropdown :trigger="['click']">
        <slot name="menuTrigger"> </slot>

        <template #overlay>
            <a-menu
                class="py-1 text-gray-700"
                :style="`min-width: ${minWidth}px`"
            >
                <a-menu-item
                    v-for="(option, idx) in options.filter((e) => !e?.hide)"
                    :key="idx"
                    class="px-4 py-2 text-sm"
                    :class="option.class"
                    @click.stop="
                        (e: MouseEvent) => {
                            e.stopPropagation()
                            option.handleClick({ ...option })
                            return
                        }
                    "
                >
                    <div
                        class="flex items-center gap-x-2"
                        :class="option.wrapperClass"
                    >
                        <AtlanIcon
                            v-if="option.icon"
                            class="mb-0.5"
                            :icon="option.icon"
                            :class="option.iconClass"
                        />
                        <span>
                            {{ option.title }}
                        </span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    type option = {
        title: string
        icon?: string
        handleClick: Function
        class?: string
        hide?: boolean
        wrapperClass?: string
        iconClass?: string
    }

    export default defineComponent({
        name: 'WFDropdown',
        components: {},
        props: {
            options: {
                type: Array as PropType<option[]>,
                default: () => [],
            },
            placement: {
                type: String,
                required: false,
                default: () => 'bottomCenter',
            },
            minWidth: {
                type: Number,
                required: false,
                default: () => 180,
            },
            showOverlay: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['update:showOverlay'],
    })
</script>
