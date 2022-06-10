<template>
    <div class="bg-gray-200 items-center py-3 px-4 flex border-b">
        <a-button
            shape="circle"
            size="small"
            class="cursor-pointer rounded-full shadow-sm bg-gray-300 flex justify-center items-center"
            @click="$emit('close')"
            ><atlan-icon icon="Cross" class="h-3"
        /></a-button>

        <a-button
            shape="round"
            size="small"
            :disabled="currentIndex === 0"
            class="px-1 rounded shadow-sm transform rotate-180 mx-2"
            @click="handleNavigation('up')"
            ><atlan-icon icon="CaretDown" class="h-4"
        /></a-button>
        <a-button
            shape="round"
            size="small"
            :disabled="currentIndex === totalCount - 1"
            class="px-1 py-0 rounded shadow-sm"
            @click="handleNavigation('down')"
            ><atlan-icon icon="CaretDown" class="h-4"
        /></a-button>
        <div class="flex-grow" />
        <span class="mx-3 text-gray-500"
            >{{ currentIndex + 1 }}-{{ totalCount }} Process</span
        >
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        toRefs,
        inject,
        provide,
        computed,
    } from 'vue'

    export default defineComponent({
        name: 'DrawerNavigator',
        components: {},
        props: {},
        emits: [],
        setup(props, { emit }) {
            const currentIndex = inject('currentIndex')
            const totalCount = inject('totalCount')
            const handleNavigation = inject('handleNavigation', () => {})
            return { currentIndex, totalCount , handleNavigation}
        },
    })
</script>
