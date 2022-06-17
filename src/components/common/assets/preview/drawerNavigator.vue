<template>
    <div class="bg-new-gray-100 items-center py-3 px-4 flex border-b">
        <a-button
            shape="circle"
            size="small"
            class="cursor-pointer rounded-full shadow-sm bg-new-gray-200 flex justify-center items-center border-0"
            @click="$emit('close')"
            ><atlan-icon icon="Cross" class="text-new-gray-800 h-3"
        /></a-button>

        <a-button
            shape="round"
            size="small"
            :disabled="currentIndex === 0"
            class="px-1 rounded navigator transform rotate-180 mx-2 bg-white"
            :class="{ 'opacity-30': currentIndex === 0 }"
            @click="handleNavigation('up')"
            ><atlan-icon icon="CaretDown" class="text-new-gray-800 h-4"
        /></a-button>

        <a-button
            shape="round"
            size="small"
            :disabled="currentIndex === totalCount - 1"
            class="px-1 py-0 rounded navigator bg-white"
            :class="{ 'opacity-30': currentIndex === totalCount - 1 }"
            @click="handleNavigation('down')"
            ><atlan-icon icon="CaretDown" class="text-new-gray-800 h-4"
        /></a-button>

        <div class="flex-grow" />
        <span class="mx-3 text-gray-500"
            >{{ currentIndex + 1 }}-{{ totalCount }} Processes</span
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'

    export default defineComponent({
        name: 'DrawerNavigator',
        components: {},
        props: {},
        emits: [],
        setup() {
            const currentIndex = inject('currentIndex')
            const totalCount = inject('totalCount')
            const handleNavigation = inject('handleNavigation', () => {})

            return { currentIndex, totalCount, handleNavigation }
        },
    })
</script>

<style lang="less">
    .navigator {
        border: 0 !important;
        box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05) !important;
        border-radius: 4px !important;
    }
</style>
