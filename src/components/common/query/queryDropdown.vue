<template>
    <a-dropdown trigger="click" placement="bottomRight">
        <slot name="button"></slot>

        <template #overlay>
            <a-menu class="" mode="vertical">
                <a-menu-item
                    class="px-4 py-2"
                    key="sql"
                    @click="$emit('handleClick', false)"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="Query24" class="w-4 h-4" />
                        <span class="pl-2 text-sm"> SQL Query </span>
                    </div></a-menu-item
                >

                <a-menu-item
                    class="px-4 py-2"
                    key="visual"
                    @click="$emit('handleClick', true)"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="Vqb24" class="w-4 h-4" />
                        <span class="pl-2 text-sm"> Visual Query </span>
                    </div></a-menu-item
                ></a-menu
            >
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'queryDropdown',

        emits: ['handleClick'],
    })
</script>
