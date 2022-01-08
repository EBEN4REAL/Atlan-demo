<template>
    <div
        ref="container"
        @click="setFocus"
        @focusout="handleContainerBlur"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        tabindex="0"
        class="relative flex items-center w-full group"
        :class="[
            isAreaFocused ? ' border-primary-focus  ' : 'border-gray-300 ',
            ,
            'flex flex-wrap items-center  rounded selector-height px-3',
        ]"
        @click.stop="() => {}"
    >
        <template v-if="selectedJoinType?.name">
            <!-- chips -->
            <div class="flex items-center cursor-pointer">
                <AtlanIcon
                    :icon="selectedJoinType.name.replace(' ', '')"
                    class="text-primary"
                />
                <span class="mb-0 ml-1 text-sm text-gray-700">
                    {{ selectedJoinType.name }}
                </span>
            </div>
        </template>

        <div class="relative left-1">
            <AtlanIcon icon="ChevronDown" class="w-4 h-4" />
        </div>
        <teleport to="body">
            <div
                v-if="isAreaFocused"
                @click.stop="() => {}"
                :style="`width: ${containerPosition?.width}px;top:${
                    containerPosition?.top + containerPosition?.height
                }px;left:${containerPosition?.left}px`"
                :class="[
                    'absolute z-10 pb-2 overflow-auto bg-white rounded custom-shadow position',
                ]"
            >
                <div
                    :class="['flex  justify-center overflow-auto']"
                    style="max-height: 250px"
                >
                    <div class="w-full">
                        <template
                            v-for="(item, index) in dropdownOption"
                            :key="item.key"
                        >
                            <div
                                class="flex items-center justify-between w-full px-4 h-9 hover:bg-primary-light"
                                @mousedown.stop="(e) => onCheckChange(item, e)"
                                :class="
                                    selectedJoinType.type === item.key
                                        ? 'bg-primary-light'
                                        : 'bg-white'
                                "
                            >
                                <div class="flex items-center">
                                    <!-- <AtlanIcon
                                    :icon="item.icon"
                                    class="mr-3 text-primary"
                                    v-if="selectedJoinType.type === item.key"
                                /> -->
                                    <span>{{ item.label }}</span>
                                </div>
                                <AtlanIcon
                                    icon="Check"
                                    class="text-primary"
                                    v-if="selectedJoinType.type === item.key"
                                />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, onMounted, onUnmounted } from 'vue'
    import { useJoin } from '~/components/insights/playground/editor/vqb/composables/useJoin'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            selectedJoinType: {
                type: Object,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { selectedJoinType } = useVModels(props)

            const { list } = useJoin()

            const inputRef = ref()
            const selectAll = ref(false)
            const topPosShift = ref(0)
            const isAreaFocused = ref(false)
            const container = ref()
            const clickPos = ref({ left: 0, top: 0 })
            const setFocus = () => {
                isAreaFocused.value = true
            }
            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })

            const handleContainerBlur = (event) => {
                if (!container.value?.contains(event?.relatedTarget)) {
                    isAreaFocused.value = false
                }
            }

            const placeholder = computed(() => {
                if (selectedJoinType.value.type) {
                    return ``
                }
                return `Select a join function`
            })

            const dropdownOption = computed(() => {
                let data = list.map((ls) => ({
                    label: ls.name,
                    key: ls.type,
                    icon: ls.name.replace(' ', ''),
                }))

                return data
            })

            const onCheckChange = (checked, event) => {
                selectedJoinType.value = {
                    type: checked.key,
                    name: checked.label,
                }
                isAreaFocused.value = false
                event.stopPropagation()
                event.preventDefault()
                return false
            }

            onMounted(() => {
                topPosShift.value = container.value?.offsetHeight
                observer.value = new ResizeObserver(onResize).observe(
                    container.value
                )
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top + 1
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height
                console.log(
                    container.value?.getBoundingClientRect(),
                    'container'
                )
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
                // observer?.value?.unobserve(container?.value)
            })

            const mouseOver = ref(false)
            const handleMouseOver = () => {
                if (!mouseOver.value) mouseOver.value = true
            }
            const handleMouseOut = () => {
                if (mouseOver.value) mouseOver.value = false
            }

            return {
                onCheckChange,
                selectAll,
                dropdownOption,
                selectedJoinType,
                placeholder,
                topPosShift,
                inputRef,
                clickPos,
                container,
                handleContainerBlur,
                setFocus,
                isAreaFocused,
                handleMouseOver,
                handleMouseOut,
                mouseOver,
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
<style lang="less" module>
    .custom_input {
        background-color: #fbfbfb !important;
    }
</style>
