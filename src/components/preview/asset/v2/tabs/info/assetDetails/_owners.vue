<template>
    <a-input v-input-focus placeholder="Search users & groups">
        <!-- <template #prefix>
                                        <fa icon="fal search" />
                                    </template> -->
    </a-input>
    <div class="w-full h-56 overflow-y-auto">
        <div
            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
        >
            <img
                src="https://picsum.photos/id/237/50/50"
                alt="view"
                class="w-4 h-4 mr-1 rounded-full"
            /><span class="text-gray truncate ...">Sarbik Betal</span>
        </div>
        <div
            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
        >
            <img
                src="https://picsum.photos/id/237/50/50"
                alt="view"
                class="w-4 h-4 mr-1 rounded-full"
            /><span class="text-gray truncate ...">Sarbik Betal</span>
        </div>
        <div
            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
        >
            <img
                src="https://picsum.photos/id/237/50/50"
                alt="view"
                class="w-4 h-4 mr-1 rounded-full"
            /><span class="text-gray truncate ...">Sarbik Betal</span>
        </div>
        <div
            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
        >
            <img
                src="https://picsum.photos/id/237/50/50"
                alt="view"
                class="w-4 h-4 mr-1 rounded-full"
            /><span class="text-gray truncate ...">Sarbik Betal</span>
        </div>
        <div
            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
        >
            <img
                src="https://picsum.photos/id/239/50/50"
                alt="view"
                class="w-4 h-4 mr-1 rounded-full"
            /><span class="text-gray truncate ...">Shubhankar Khare</span>
        </div>
        <div
            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
        >
            <img
                src="https://picsum.photos/id/239/50/50"
                alt="view"
                class="w-4 h-4 mr-1 rounded-full"
            /><span class="text-gray truncate ...">Shubhankar Khare</span>
        </div>
        <div
            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
        >
            <img
                src="https://picsum.photos/id/239/50/50"
                alt="view"
                class="w-4 h-4 mr-1 rounded-full"
            /><span class="text-gray truncate ...">Shubhankar Khare</span>
        </div>
        <div
            class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
        >
            <img
                src="https://picsum.photos/id/239/50/50"
                alt="view"
                class="w-4 h-4 mr-1 rounded-full"
            /><span class="text-gray truncate ...">Shubhankar Khare</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            return {}
        },
    })
</script>
<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
    .hover_bg-primary-light:hover {
        background: rgba(34, 81, 204, 0.05);
    }
</style>
