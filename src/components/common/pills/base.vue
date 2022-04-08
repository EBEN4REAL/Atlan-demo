<template>
    <div
        class="flex items-center py-1 pl-2 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer"
    >
        <AtlanIcon v-if="icon" :icon="icon" />

        <div
            class="ml-1 truncate overflow-ellipsis peer"
            style="max-width: 150px"
        >
            {{ text }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import iconMap from '@common/icon/iconMap'

    export default defineComponent({
        name: 'BasePill',
        props: {
            icon: {
                type: String as PropType<keyof typeof iconMap>,
                required: false,
                default: '',
            },
            text: {
                type: String,
                default: '',
                required: false,
            },
        },
    })
</script>
