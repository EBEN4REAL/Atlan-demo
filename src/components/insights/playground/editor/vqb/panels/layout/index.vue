<template>
    <div
        @mouseover="emit('handleMouseOver')"
        @mouseout="emit('handleMouseOut')"
        :class="containerHovered || expand ? 'hover-shadow' : ''"
    >
        <div
            @click="emit('toggleExpand')"
            class="box-border relative flex items-center px-3 pt-3 pb-2 cursor-pointer"
        >
            <div
                class="flex items-center justify-between w-full min-h-panel-header"
            >
                <div class="flex items-center">
                    <div
                        class="flex items-center justify-center mr-2 rounded-md p-1.5"
                        :class="[expand ? 'bg-primary-light' : 'bg-gray-100']"
                        style="z-index: 2"
                    >
                        <slot name="panelIcon"></slot>
                    </div>
                    <div class="">
                        <div
                            :class="[
                                isChecked ? 'text-gray' : 'text-gray-500',
                                'text-sm   ',
                            ]"
                        >
                            <div class="flex items-center">
                                <div class="relative font-bold">
                                    <slot name="panelName"></slot>
                                </div>
                                <div
                                    v-if="!isChecked && expand"
                                    class="px-3 ml-2 text-gray-500 rounded-full bg-gray-light"
                                >
                                    Disabled
                                </div>
                            </div>
                        </div>
                        <p
                            :class="[
                                isChecked
                                    ? 'text-gray-500'
                                    : 'text-gray-400 line-through',
                                'text-xs break-words line-clamp-2',
                            ]"
                            v-if="!expand"
                        >
                            <slot name="panelDescription"></slot>
                        </p>
                    </div>
                </div>

                <slot name="options"> </slot>
            </div>
        </div>
        <!-- Show on expand -->
        <slot name="expand"> </slot>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    export default defineComponent({
        name: 'Panel Layout',
        components: {},
        props: {
            expand: {
                type: Boolean,
                required: false,
                default: false,
            },
            isChecked: {
                type: Boolean,
                required: false,
                default: true,
            },
            containerHovered: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['handleMouseOver', 'handleMouseOut', 'toggleExpand'],

        setup(props, { emit }) {
            const { expand, isChecked, containerHovered } = toRefs(props)

            return {
                emit,
                expand,
                isChecked,
                containerHovered,
            }
        },
    })
</script>
<style lang="less" scoped>
    .hover-shadow {
        box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);
    }
</style>
