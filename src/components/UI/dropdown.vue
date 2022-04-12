<template>
    <a-dropdown trigger="click">
        <IconButton :data-test-id="dataTestId" icon="KebabMenu" />

        <template #overlay>
            <a-menu>
                <a-menu-item
                    v-for="(option, index) in options"
                    :key="index"
                    @click="() => handleMenuItemClick({ index, ...option })"
                >
                    <div
                        class="flex items-center"
                        :class="option.class"
                        :data-test-id="option?.title?.toLowerCase()"
                    >
                        <AtlanIcon v-if="option.icon" :icon="option.icon" />
                        <span class="pl-2 text-sm">{{ option.title }}</span>
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
