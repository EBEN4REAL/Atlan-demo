<template>
    <div
        ref="container"
        @click="toggleFocus"
        class="relative flex items-center w-full group"
        :class="[
            isAreaFocused ? ' border-primary-focus  ' : 'border-gray-300 ',
            ,
            'flex flex-wrap items-center  rounded selector-height',
            disabled ? ' cursor-not-allowed disable-bg ' : '',
        ]"
    >
        <slot name="head" :data="{ isAreaFocused }"> </slot>

        <teleport to="body">
            <div
                v-if="isAreaFocused"
                :style="`${
                    specifiedBodyWidth
                        ? `width:${specifiedBodyWidth}px;`
                        : `width:${containerPosition?.width}px;`
                }top:${
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
        Ref,
        watch,
        inject,
        computed,
        defineComponent,
        ref,
        onMounted,
        onUnmounted,
        toRefs,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import {
        useProvide,
        provideDataInterface,
    } from '~/components/insights/common/composables/useProvide'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },

            specifiedBodyWidth: {
                type: Number,
                required: false,
            },
        },

        setup(props, { emit }) {
            const { disabled, specifiedBodyWidth } = toRefs(props)
            const isAreaFocused = ref(false)
            const container = ref()
            // const lockVQBScroll = inject('lockVQBScroll') as Ref<Boolean>

            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })

            const setDropDownPosition = () => {
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

            onMounted(() => {
                // const _container = document.getElementById('_container')
                if (container.value) {
                    observer.value = new ResizeObserver(onResize).observe(
                        container.value
                    )

                    setDropDownPosition()
                    document.addEventListener('click', (event) => {
                        const withinBoundaries = event
                            .composedPath()
                            .includes(container.value)

                        if (withinBoundaries) {
                            console.log('inside')
                        } else {
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
            /* ---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */

            const provideData: provideDataInterface = {
                isAreaFocused: isAreaFocused,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            onUnmounted(() => {
                observer?.value?.unobserve(container?.value)
            })

            const toggleFocus = () => {
                setDropDownPosition()
                if (!disabled.value) {
                    if (isAreaFocused.value) {
                        isAreaFocused.value = false
                    } else {
                        isAreaFocused.value = true
                    }
                }
            }

            return {
                toggleFocus,
                specifiedBodyWidth,
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
        box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
            0px 6px 16px rgba(0, 0, 0, 0.08),
            0px 9px 28px 8px rgba(0, 0, 0, 0.05);
    }
    .disable-bg {
        background-color: #fbfbfb;
    }
</style>
