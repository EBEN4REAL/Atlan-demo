<template>
    <a-tooltip placement="left" :title="title" :mouse-enter-delay="0.5"
        ><div class="flex items-center justify-center w-full h-full">
            <AtlanIcon
                :icon="isActive && activeIcon ? activeIcon : icon"
                :class="isActive && !activeIcon ? 'text-primary' : ''"
                class="h-6"
            />
        </div>
    </a-tooltip>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'SidePanelTabHeaders',
        props: {
            title: {
                type: String,
                required: true,
            },
            icon: {
                type: String,
                required: true,
            },
            isActive: {
                type: Boolean,
                required: true,
            },
            activeIcon: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        setup(props, { emit }) {
            return {}
        },
    })
</script>
<style lang="less" scoped></style>
<style lang="less" module></style>
