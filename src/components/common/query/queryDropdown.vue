<template>
    <div class="inline-flex items-center">
        <a-dropdown :trigger="['hover']">
            <slot name="button"></slot>

            <template #overlay>
                <div
                    style="width: 176px; height: 104px"
                    class="p-2 bg-white newTabDropdown"
                >
                    <div
                        @click="$emit('handleClick', false)"
                        class="flex items-center pl-2 newTabDropdownOption newTabDropdownOption1"
                    >
                        <AtlanIcon icon="Query24" class="w-6 h-6 mr-2" />
                        <span class="text-xs font-bold"> SQL Query </span>
                    </div>
                    <div
                        @click="$emit('handleClick', true)"
                        class="flex items-center pl-2 mt-2 newTabDropdownOption newTabDropdownOption2"
                    >
                        <AtlanIcon icon="Vqb24" class="w-6 h-6 mr-2" />
                        <span class="text-xs font-bold"> Visual Query </span>
                    </div>
                </div>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'queryDropdown',
        components: {},

        props: {},
        emits: ['handleClick'],
        setup(props, { emit }) {
            return {}
        },
    })
</script>

<style lang="less" scoped>
    .newTabDropdown {
        width: 176px;
        height: 104px;

        background: #ffffff;

        box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
            0px 6px 16px rgba(0, 0, 0, 0.08),
            0px 9px 28px 8px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }
    .newTabDropdownOption {
        width: 160px;
        height: 40px;
        @apply cursor-pointer;

        // background: rgba(82, 119, 215, 0.1);
        border-radius: 4px;
        @apply transition-all;
    }
    .newTabDropdownOption1 {
        background: rgba(82, 119, 215, 0.1);
        color: #5277d7;

        &:hover {
            background: #5277d7;
            color: #fff;
        }
    }
    .newTabDropdownOption2 {
        background: rgba(109, 109, 218, 0.1);
        color: #6d6dda;

        &:hover {
            background: #6d6dda;
            color: #fff;
        }
    }
</style>
