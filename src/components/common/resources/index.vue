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
            <a
                class="flex cursor-pointer gap-x-2 hover:underline"
                v-for="item in links(asset)"
                :href="`//${item?.attributes?.link}`"
                target="_blank"
                rel="noreferrer"
            >
                <img
                    :src="`https://www.google.com/s2/favicons?domain=${item?.attributes?.link}`"
                    :alt="item?.attributes?.name"
                    class="w-4 h-4"
                />
                <span class="text-sm text-gray-500">{{
                    item?.attributes?.name
                }}</span>
            </a>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AddResources from './addResource.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        components: { AddResources },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { links } = useAssetInfo()

            return { links }
        },
    })
</script>
