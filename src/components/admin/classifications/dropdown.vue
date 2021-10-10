<template>
    <a-dropdown trigger="click">
        <AtlanBtn
            class="flex-none"
            size="sm"
            color="secondary"
            padding="compact"
            @click.prevent
        >
            <AtlanIcon icon="KebabMenu" class="-mx-1 text-gray" />
        </AtlanBtn>

        <template #overlay>
            <a-menu>
                <a-menu-item
                    v-for="(option, index) in options"
                    :key="index"
                    @click="() => handleMenuItemClick({ index, ...option })"
                >
                    <div class="flex items-center" :class="option.class">
                        <AtlanIcon v-if="option.icon" :icon="option.icon" />
                        <span class="pl-2 text-sm">
                            {{ option.title }}
                        </span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType } from 'vue'
    import AtlanBtn from '~/components/UI/button.vue'

    type option = {
        title: string
        icon: string
        iconType: string
        handleClick: Function
        class?: string
    }

    export default defineComponent({
        name: 'Dropdown',
        components: { AtlanBtn },
        props: {
            /**
             * Options - List of all the items in the dropdown
             * { title: string, icon: string, iconType: string, handleClick: Function }
             */
            options: {
                type: Array as PropType<option[]>,
                default: () => [],
            },
        },
        setup(props, context) {
            const open = ref(false)
            const { options } = props

            const handleMenuItemClick = (option: any) => {
                option.handleClick()
            }

            /**
             * Toggles the dropdown
             */
            const toggleDropdown = () => {
                open.value = !open.value
            }

            /**
             * Closes the dropdown
             */
            const closeDropdown = () => {
                open.value = false
            }
            /**
             * Returns icon class based on icon and icon type
             */
            const getIconClass = (option: option) => {
                if (option && option.icon) {
                    switch (option.iconType) {
                        case 'at':
                            return `at at-${option.icon}`

                        case 'fal':
                            return `fal ${option.icon}`

                        case 'far':
                            return `far ${option.icon}`

                        case 'fas':
                            return `fas ${option.icon}`

                        case 'fa':
                            return `fa ${option.icon}`

                        case 'fab':
                            return `fab ${option.icon}`
                        default:
                            return `far ${option.icon}`
                    }
                } else {
                    return ''
                }
            }

            return {
                options,
                toggleDropdown,
                closeDropdown,
                getIconClass,
                handleMenuItemClick,
                open,
            }
        },
        methods: {},
    })
</script>

<style lang="less" scoped></style>
