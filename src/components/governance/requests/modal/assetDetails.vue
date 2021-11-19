<template>
    <div>
        <div class="flex flex-col">
            <div class="flex items-center mb-1 text-xs">
                <AssetLogo :asset="assetWrappper" />
                <span
                    class="ml-1 overflow-hidden text-gray-500 overflow-ellipsis"
                    >{{ entityType?.toUpperCase() }}</span
                >
                <span style="color: #c4c4c4" class="mx-2"> • </span>
                <span class="overflow-hidden text-gray-500 overflow-ellipsis">
                    {{ assetText[2] }}</span
                >
                <span class="px-1 text-gray-300">/</span>

                <span class="overflow-hidden text-gray-500 overflow-ellipsis">
                    {{ assetText[1] }}</span
                >
            </div>
            <span
                v-if="asset && title(asset) && title(asset) !== ''"
                class="text-base font-bold overflow-ellipsis text-primary"
                >{{ title(asset) }}
            </span>
            <span
                v-else
                class="text-base font-bold overflow-ellipsis text-primary"
                >{{ assetText[0] }}</span
            >
            <span
                v-if="asset && description(asset) && description(asset) !== ''"
                class="text-sm text-gray-500 overflow-ellipsis"
                >{{ description(asset) }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            assetQfName: { type: String, required: true },
            entityType: {
                type: String,
                required: true,
            },
        },
        components: { AssetLogo },
        setup(props) {
            const { assetQfName } = toRefs(props)
            const assetText = computed(() =>
                assetQfName.value.split('/').slice(-3).reverse()
            )
            const { description, title } = useAssetInfo()
            const assetWrappper = computed(() => ({
                attributes: {
                    integrationName: assetQfName.value.split('/')[1],
                },
            }))

            return { assetText, description, title, assetWrappper }
        },
    })
</script>
