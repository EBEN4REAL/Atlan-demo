<template>
    <a-dropdown :trigger="[`${trigger}`]" @visibleChange="visibleChange">
        <slot name="menuTrigger"> </slot>

        <template #overlay>
            <a-menu
                class="py-1 text-gray-700"
                :style="`min-width: ${minWidth}px`"
                @visibleChange="addBackground"
            >
                <!-- <a-menu-item
                    v-for="option in options.filter((e) => !e?.hide)"
                    :key="option.key"
                    class="px-4 py-2 text-sm"
                    :class="option.class"
                    @click.stop="
                        (e) => {
                            e.stopPropagation()
                            handleMenuItemClick({ index, ...option, item })
                            return
                        }
                    "
                    >{{ option.title }}</a-menu-item
                > -->

                <component
                    v-for="option in options.filter(
                        (e) => !e?.hide?.value || !e?.hide
                    )"
                    :is="option.component"
                    :key="option.key"
                    class="text-sm"
                    :class="[
                        option.class,
                        option?.submenu?.length ? '' : 'px-4 py-2',
                    ]"
                    @click.stop="
                        (e) => {
                            e.stopPropagation()
                            handleMenuItemClick({ index, ...option, item })
                            return
                        }
                    "
                >
                    <span
                        v-if="!option?.submenu?.length && !option?.wrapperClass"
                    >
                        {{ option.title }}
                    </span>
                    <div
                        :class="option.wrapperClass"
                        v-if="!option?.submenu?.length && option?.wrapperClass"
                    >
                        <AtlanIcon
                            :icon="option.icon"
                            :class="option.iconClass"
                        ></AtlanIcon>
                        <span>
                            {{ option.title }}
                        </span>
                    </div>

                    <template #title v-if="option?.submenu?.length">
                        <div
                            class="flex items-center justify-between w-full mr-2"
                        >
                            <div
                                class="flex items-center justify-between w-full text-gray-500"
                            >
                                <span class="text-gray-700">
                                    {{ option.title }}</span
                                >
                                <span>
                                    {{ option.selectedOption }}
                                </span>
                            </div>
                            <AtlanIcon
                                icon="ChevronRight"
                                class="ml-1 text-gray-500 -mt-0.5"
                            />
                        </div>
                    </template>
                    <template v-if="option?.submenu?.length" #expandIcon />
                    <div v-if="option?.submenu?.length">
                        <a-menu-item
                            v-for="item in option.submenu"
                            :key="item.key"
                        >
                            {{ item.title }}
                        </a-menu-item>
                    </div>
                </component>
                <slot name="menuFooter"> </slot>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    type option = {
        title: string
        icon?: string
        handleClick?: Function
        class?: string
    }

    export default defineComponent({
        name: 'Insights Dropdown',
        components: {},
        props: {
            options: {
                type: Array as PropType<option[]>,
                default: () => [],
            },
            item: {
                type: Array as PropType<any>,
                required: true,
            },
            dataTestId: {
                type: String,
                default: () => 'atlan-dropdown',
                required: false,
            },
            placement: {
                type: String,
                required: false,
                default: () => 'bottomCenter',
            },
            trigger: {
                type: String,
                default: () => 'click',
                required: false,
            },
            minWidth: {
                type: String,
                required: false,
                default: () => '180',
            },
        },
        emits: ['addBackground', 'visibleChange'],
        setup(props, { emit }) {
            const { options, item, placement, trigger, minWidth } = props

            const handleMenuItemClick = (option: any) => {
                option.handleClick(option)
            }
            const addBackground = () => {
                emit('addBackground')
            }
            const visibleChange = (visible) => {
                emit('visibleChange', visible)
            }

            return {
                visibleChange,
                trigger,
                item,
                options,
                addBackground,
                handleMenuItemClick,
                placement,
                minWidth,
            }
        },
    })
</script>
