<template>
    <div
        ref="container"
        @click="
            () => {
                if (!disabled) {
                    isAreaFocused = true
                }
            }
        "
        class="relative flex items-center w-full group"
        :class="[
            isAreaFocused ? ' border-primary-focus  ' : 'border-gray-300 ',
            ,
            'flex flex-wrap items-center  rounded selector-height pl-3',
            disabled ? ' cursor-not-allowed disable-bg ' : '',
        ]"
        @click.stop="() => {}"
    >
        <slot name="head"> </slot>

        <teleport to="body">
            <div
                v-if="isAreaFocused"
                @click.stop="() => {}"
                :style="`width:${containerPosition?.width}px;top:${
                    containerPosition?.top + containerPosition?.height
                }px;left:${containerPosition?.left}px`"
                :class="[
                    'absolute z-10 overflow-auto bg-white rounded custom-shadow position',
                ]"
            >
                <slot name="body"> </slot>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        onMounted,
        onUnmounted,
        toRefs,
    } from 'vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            isAreaFocused: {
                type: Boolean,
                required: true,
                default: false,
            },
        },

        setup(props, { emit }) {
            const { disabled } = toRefs(props)
            const { isAreaFocused } = useVModels(props)
            const container = ref()

            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })

            onMounted(() => {
                // const _container = document.getElementById('_container')
                if (container.value) {
                    observer.value = new ResizeObserver(onResize).observe(
                        container.value
                    )

                    const viewportOffset =
                        container.value?.getBoundingClientRect()
                    if (viewportOffset?.width)
                        containerPosition.value.width = viewportOffset?.width
                    if (viewportOffset?.top)
                        containerPosition.value.top = viewportOffset?.top + 1
                    if (viewportOffset?.left)
                        containerPosition.value.left = viewportOffset?.left
                    if (viewportOffset?.height)
                        containerPosition.value.height = viewportOffset?.height

                    document?.addEventListener('click', function (event) {
                        let isClickInside = container.value?.contains(
                            event.target
                        )

                        if (!isClickInside) {
                            isClickInside =
                                event?.target?.classList?.contains('ant-input')
                        }
                        if (!isClickInside) {
                            isClickInside =
                                event?.target?.classList?.contains(
                                    'dropdown-container'
                                )
                        }

                        if (!isClickInside) {
                            isAreaFocused.value = false
                        }
                    })
                }
            })

            const onResize = () => {
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top + 1
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height
            }

            onUnmounted(() => {
                observer?.value?.unobserve(container?.value)
            })

            return {
                disabled,
                container,
                isAreaFocused,
                containerPosition,
            }
        },
    })
</script>
<style lang="less" scoped>
    .border-plus {
        padding: 1px;
    }
    .border-minus {
        padding: 0px;
    }
    .custom-shadow {
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }
    .selector-height {
        min-height: 32px;
    }
    .position {
        @apply right-0;
    }
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
    .disable-bg {
        background-color: #fbfbfb;
    }
</style>
