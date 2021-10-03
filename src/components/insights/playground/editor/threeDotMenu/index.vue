<template>
    <div>
        <a-dropdown :trigger="['click']">
            <a-button
                @click.prevent="toggleButtonState"
                :class="isActive ? 'border-primary-light' : ''"
                class="
                    flex
                    items-center
                    justify-center
                    py-0.5
                    ml-2
                    px-1
                    border-white
                    text-gray-500
                "
            >
                <AtlanIcon class="" icon="KebabMenu"
            /></a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item>Themes</a-menu-item>
                    <a-menu-item>Tab Spacing</a-menu-item>
                    <a-menu-item>Auto indentation</a-menu-item>
                    <a-menu-item>Curosr style</a-menu-item>
                    <a-sub-menu key="test" title="Font family">
                        <a-menu-item>Fira code</a-menu-item>
                        <a-menu-item>Sans serif</a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            const isActive = ref(false)
            const toggleButtonState = () => {
                isActive.value = !isActive.value
            }
            return {
                toggleButtonState,
                isActive,
            }
        },
    })
</script>
<style lang="less" scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
