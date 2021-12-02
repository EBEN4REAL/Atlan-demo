<template>
    <div>
        <a-dropdown :trigger="['hover']">
            <AtlanBtn
                class="
                    flex-none
                    px-3.5
                    py-1
                    border-none border-r border-gray-300
                "
                size="sm"
                color="secondary"
                @click.stop="() => {}"
                padding="compact"
            >
                <AtlanIcon icon="Add" class="-mx-1 text-gray"></AtlanIcon>
            </AtlanBtn>
            <template #overlay>
                <a-menu @mouseover="handleMouseOver" @mouseout="handleMouseOut">
                    <template
                        v-for="(item, index) in items"
                        :key="item.label + index"
                    >
                        <a-menu-item>
                            <div class="py-0.5 px-2 flex items-center">
                                <AtlanIcon
                                    :icon="item.icon"
                                    :class="item.class"
                                ></AtlanIcon>
                                <span>{{ item.label }}</span>
                            </div>
                        </a-menu-item>
                    </template>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Columns',
        components: { AtlanBtn },
        props: {
            submenuHovered: {
                type: Boolean,
                reqruied: true,
                default: false,
            },
            containerHovered: {
                type: Boolean,
                reqruied: true,
                default: false,
            },
        },
        setup(props, { emit }) {
            const { submenuHovered, containerHovered } = useVModels(props)
            const items = [
                {
                    icon: 'Columns',
                    label: 'Column',
                    class: '',
                },
                {
                    icon: 'Trigger',
                    label: 'Aggregate',
                    class: 'mt-0.5',
                },
                {
                    icon: 'Filter',
                    label: 'Filter',
                    class: '',
                },
                {
                    icon: 'Sort',
                    label: 'Sort',
                    class: '',
                },
                {
                    icon: 'Union',
                    label: 'Join data',
                    class: '',
                },
                {
                    icon: 'BuilderGroup',
                    label: 'Group',
                    class: '',
                },
            ]

            const handleMouseOver = () => {
                if (!containerHovered.value) containerHovered.value = true
                if (!submenuHovered.value) submenuHovered.value = true
            }
            const handleMouseOut = () => {
                if (containerHovered.value) containerHovered.value = false
                if (submenuHovered.value) submenuHovered.value = false
            }
            return {
                handleMouseOut,
                handleMouseOver,
                items,
            }
        },
    })
</script>
<style lang="less" scoped></style>
