<template>
    <a-dropdown trigger="click" :placement="placement">
        <slot name="menuTrigger"> </slot>

        <template #overlay>
            <a-menu
                class="py-2 text-gray-700"
                style="min-width: 180px"
                @visibleChange="addBackground"
            >
                <a-menu-item
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
                >
            </a-menu>
            <slot name="menuFooter"> </slot>
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
                default: '',
            },
        },
        emits: ['addBackground'],
        setup(props, { emit }) {
            const { options, item } = props

            const handleMenuItemClick = (option: any) => {
                option.handleClick()
            }
            const addBackground = () => {
                emit('addBackground')
            }

            return {
                item,
                options,
                addBackground,
                handleMenuItemClick,
            }
        },
    })
</script>
