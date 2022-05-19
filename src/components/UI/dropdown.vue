<template>
    <a-dropdown trigger="click" :overlay-class-name="$style.dropdownClass">
        <IconButton :data-test-id="dataTestId" icon="KebabMenu" />

        <template #overlay>
            <a-menu click="overflow-hidden">
                <a-menu-item
                    v-for="(option, index) in options"
                    :key="index"
                    class="px-4 py-2"
                    style="min-width: 8rem"
                    @click="() => handleMenuItemClick({ index, ...option })"
                >
                    <div
                        class="flex items-center m-w-20"
                        :class="option.class"
                        :data-test-id="option?.title?.toLowerCase()"
                    >
                        <AtlanIcon v-if="option.icon" :icon="option.icon" />
                        <span class="pl-1">{{ option.title }}</span>
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
        handleClick?: Function
        class?: string
    }

    export default defineComponent({
        name: 'Dropdown',
        components: {},
        props: {
            options: {
                type: Array as PropType<option[]>,
                default: () => [],
            },
            dataTestId: {
                type: String,
                default: () => 'atlan-dropdown',
                required: false,
            },
        },
        setup() {
            const handleMenuItemClick = (option: any) => {
                option.handleClick()
            }

            return {
                handleMenuItemClick,
            }
        },
    })
</script>

<style lang="less" module>
    .dropdownClass {
        :global(.ant-dropdown-menu) {
            @apply overflow-hidden !important;
        }
    }
</style>
