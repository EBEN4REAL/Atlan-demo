<template>
    <div>
        <div class="flex items-center justify-between mb-3">
            <span class="text-base font-bold text-gray">Resources</span>
            <AddResources :asset="asset">
                <button class="flex items-center pr-4 text-gray-500 gap-x-2">
                    <AtlanIcon icon="Add" />
                    <span class="text-sm">Add</span>
                </button>
            </AddResources>
        </div>
        <div class="flex flex-col gap-y-2">
            <div
                class="flex cursor-pointer gap-x-2 hover:underline"
                v-for="item in resources"
            >
                <img :src="item.img" alt="" class="w-4 h-4" />
                <span class="text-sm text-gray-500">{{ item.text }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AddResources from './addResource.vue'

    export default defineComponent({
        components: { AddResources },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const resources = [
                {
                    img: 'https://vuejs.org/images/logo.svg',
                    text: 'Vue - The Progressive JavaScript Framework',
                },
                {
                    img: 'https://static.figma.com/app/icon/1/favicon.ico',
                    text: 'Figma - The Collaborative Design Workspace',
                },
                {
                    img: 'https://github.com/favicon.ico',
                    text: 'Github - Where the world builds software',
                },
            ]
            return { resources }
        },
    })
</script>
