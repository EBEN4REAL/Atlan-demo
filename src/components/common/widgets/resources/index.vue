<template>
    <div class="p-4 bg-white rounded" style="min-height: 140px">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
                <AtlanIcon icon="Resources" class="w-auto h-8 mr-3" /><span
                    class="text-base font-bold text-gray"
                    >Resources</span
                >
            </div>
            <AddResources
                v-if="links(asset)?.length > 0"
                :asset="asset"
                placement="left"
                ><template #trigger>
                    <a-button
                        class="text-gray-500 border border-transparent rounded shadow-none  hover:border-gray-400"
                    >
                        <AtlanIcon icon="Add" /> </a-button
                ></template>
            </AddResources>
        </div>
        <div>
            <div v-if="links(asset)?.length > 0" class="flex flex-col gap-y-2">
                <a
                    v-for="(item, index) in links(asset)"
                    :key="index"
                    class="flex cursor-pointer gap-x-2 hover:underline"
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
            <div
                v-else
                class="flex flex-col items-center justify-center h-full gap-y-3"
            >
                <AtlanIcon
                    icon="EmptyResource"
                    alt="EmptyResource"
                    class="w-auto h-32"
                />
                <p class="text-sm text-center text-gray-700">
                    Add URLs related to this asset
                </p>
                <AddResources :asset="asset" placement="top"
                    ><template #trigger>
                        <AtlanButton
                            size="lg"
                            color="primary"
                            padding="compact"
                        >
                            <AtlanIcon icon="Add" class="inline mb-0.5 mr-1" />
                            Add Resource
                        </AtlanButton></template
                    ></AddResources
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AddResources from './addResource.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import AtlanButton from '~/components/UI/button.vue'

    export default defineComponent({
        components: { AddResources, AtlanButton },
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
